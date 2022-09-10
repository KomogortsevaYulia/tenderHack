const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const  { format, compareAsc } =require( 'date-fns');
const { PROVIDER_TITLE } = require("../consts");


class Suppliers {
  
  async getDynamics(req, res) {

    if (!req.body) return response.sendStatus(400);
   
    const list = await sequelize.query(
      `SELECT c.contract_date::date AS date , sum(quantity) AS count
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
      WHERE c.contract_date > ? and c.contract_date < ? and contract_to_cte.cte_id in (SELECT id
                    FROM cte
                    WHERE category = ? )
                    group by  c.contract_date::date`,
      {
        replacements: [req.query.firstDay,req.query.lastDay,req.query.category],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );
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
  
    const list = await sequelize.query(
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

  async getPopularSuppliers(req, res) {

    if (!req.body) return response.sendStatus(400);
  
    const list = await sequelize.query(
        `		   
        SELECT provider_title , provider_inn , provider_kpp , count(*)
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
	    JOIN cte b ON b.id = contract_to_cte.cte_id
      WHERE c.contract_date > ? and c.contract_date < ? and b.category=?
      group by provider_title,provider_inn ,provider_kpp
      order by 4 desc
      limit 5  `,
      {
        replacements: [req.query.firstDay,req.query.lastDay,req.query.category],
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
