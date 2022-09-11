const models = require("../models");
const axios = require('axios').default;

const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const  { format, compareAsc } =require( 'date-fns');
const { PROVIDER_TITLE } = require("../consts");
var request = require('request');
const {cacheWrapper} = require("../cache");

class Suppliers {
  
  async getDynamics(req, res) {

    if (!req.body) return response.sendStatus(400);


    const list = await sequelize.query(
      `SELECT c.contract_date::date AS date , sum(quantity) AS count, sum(c.amount) as total_amount, 
        cast(avg(contract_to_cte.amount / contract_to_cte.quantity)  as int) as avg_amount
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
      WHERE contract_to_cte.cte_id in (SELECT id
                    FROM cte
                    WHERE category = ? 
     )
     group by  c.contract_date::date`,
      {
        replacements: [req.query.category],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    // вызов нейронки для предсказания на 7 недель
    if(process.env.NEURAL_HOST_PORT){
        let response = await axios.post(`http://${process.env.NEURAL_HOST_PORT}/predict`, {'data': list}).catch(res => console.log(res))
        let readedJson = JSON.parse(response.data['data'])
        for (var i = 0; i < readedJson['index'].length; i++) {
         let date = format(new Date(readedJson['index'][i]), 'yyyy-MM-dd')
         list.push({date:date, count:Math.round(readedJson['data'][i][0])})
        }
      }
    return res.json(list);
  }

  async getContractsSpecifications(req, res) {
    if (!req.body) return response.sendStatus(400);
    const list = await sequelize.query(
      `		   
      select d.value, count(*)
      from cte 
      join contract_to_cte c on c.cte_id=cte.id
      join contracts b on contract_id=b.id
      join cte_to_characteristics d on d.cte_id=cte.id
      where b.contract_date > ? and b.contract_date < ? and cte.category=? and d.name=?
      group by d.value
      order by 2 desc`,
    {
      replacements: [req.query.firstDay,req.query.lastDay,req.query.category,req.query.name],
      type: Sequelize.QueryTypes.SELECT,
    }
  );
    return res.json(list);
  }

  async getPopularProducts(req, res) {

    if (!req.body) return response.sendStatus(400);
  
    const list =  await cacheWrapper(`getSuppliersPopularProducts_${req.query.firstDay}_${req.query.lastDay}`, async () =>{
        return await sequelize.query(
            `		   
        select title,count(*)
        from cte 
        join contract_to_cte c on c.cte_id=cte.id
        join contracts b on contract_id=b.id
        where b.contract_date > ? and b.contract_date < ?
        group by title 
        order by 2 desc
        limit 5`,
            {
                replacements: [req.query.firstDay,req.query.lastDay],
                type: Sequelize.QueryTypes.SELECT,
            }
        );
    })
   
    return res.json(list);
  }


  async getPopularCategory(req, res) {

    if (!req.body) return response.sendStatus(400);
  
    const list = await sequelize.query(
        `		    
 select cte.category , count(*)
 from cte
 join contract_to_cte c on c.cte_id=cte.id
 join contracts b on contract_id=b.id
 where b.contract_date > ? and b.contract_date < ?
 group by cte.category 
 order by 2 desc
 limit 5
 `,
      {
        replacements: [req.query.firstDay,req.query.lastDay],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );

   
    return res.json(list);
  }
  
  async getAssociatedCte (req, res) {

    if (!req.body) return response.sendStatus(400);

    const list = await sequelize.query(
        `	WITH tbl as (SELECT category, count(*) as count
        FROM (SELECT DISTINCT cte.category as category, contract_id
              FROM contract_to_cte
                       JOIN cte ON cte.id = contract_to_cte.cte_id
              WHERE contract_id in (SELECT contract_id
                                    FROM contract_to_cte
                                    WHERE contract_to_cte.cte_id in (SELECT id
                                                                     FROM cte
                                                                     WHERE category = ?))) t
        GROUP BY category)
SELECT category, cast (100.0 * tbl.count / (SELECT max(count) FROM tbl) as INT) as percent
FROM tbl
ORDER BY 2 DESC limit 3 offset 1`,
      {
        replacements: [req.query.category],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );

   
    return res.json(list);
  }

  
}
module.exports = new Suppliers();
