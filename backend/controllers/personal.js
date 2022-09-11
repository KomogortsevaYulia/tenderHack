const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const { format, compareAsc } = require('date-fns');
const { PROVIDER_TITLE } = require("../consts");
const {cacheWrapper} = require("../cache");



class Personal {


  async getDynamics(req, res) {

    if (!req.body) return response.sendStatus(400);
    const list = await sequelize.query(
      `SELECT c.contract_date AS date ,b.category, quantity AS count
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
	  JOIN cte b ON b.id = contract_to_cte.cte_id
      WHERE c.contract_date > ? and c.contract_date < ? and c.provider_title = ? `,
      {
        replacements: [req.query.firstDay, req.query.lastDay, PROVIDER_TITLE],
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
        replacements: [req.query.firstDay, req.query.lastDay, req.query.category, req.query.name],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return res.json(list);
  }

  async getPopularProducts(req, res) {

    if (!req.body) return response.sendStatus(400);

    const list = await cacheWrapper(`getPopularProducts_${req.query.firstDay}_${req.query.lastDay}_${PROVIDER_TITLE}`, async () =>{
        return await sequelize.query(
            `		   
        select title,count(*)
        from cte 
        join contract_to_cte c on c.cte_id=cte.id
        join contracts b on contract_id=b.id
        where b.contract_date > ? and b.contract_date < ? and b.provider_title = ?
        group by title 
        order by 2 desc
        limit 10`,
            {
                replacements: [req.query.firstDay, req.query.lastDay, PROVIDER_TITLE],
                type: Sequelize.QueryTypes.SELECT,
            }
        );
    })

    return res.json(list);
  }

  async getCategories(req, res) {

    if (!req.body) return response.sendStatus(400);

    const list = await sequelize.query(
      `		   
        select cte.category,count(*)
        from cte 
        join contract_to_cte c on c.cte_id=cte.id
        join contracts b on contract_id=b.id
        where b.contract_date > ? and b.contract_date < ? and b.provider_title = ?
        group by cte.category
        order by 2 desc limit 50`,
      {
        replacements: [req.query.firstDay, req.query.lastDay, PROVIDER_TITLE],
        type: Sequelize.QueryTypes.SELECT,
      }
    );


    return res.json(list);
  }

  async getTypesContracts(req, res) {

    if (!req.body) return response.sendStatus(400);

    const list = await cacheWrapper(`getTypesContracts_${PROVIDER_TITLE}`, async () =>{
        const list = await sequelize.query(
            `		   
        WITH average as (
            select AVG(id)*0.25 as a from cte
        )
        SELECT 
               CASE WHEN cte_id is null THEN 'Прямая закупка'
                    WHEN cte_id < (select a from average)  THEN 'Котировочная сессия '
                    ELSE 'Закупка по потребности'
               END as value, count(*)
            FROM contract_to_cte
             join contracts b on contract_id=b.id
            where b.contract_date > ? and b.contract_date < ? and b.provider_title = ? 
            group by value
            `,
            {
                replacements: [req.query.firstDay, req.query.lastDay, PROVIDER_TITLE],
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        return  list
      })


    return res.json(list);
  }

  async getAnalogProviders(req, res) {
    if (!req.body) return response.sendStatus(400);

    let list = await cacheWrapper(`getAnalogProviders${PROVIDER_TITLE}`, async () =>{
         const list = await sequelize.query(
              `	SELECT contracts.provider_title, count(*), CAST (sum(ctc.amount) AS INT)
        FROM contracts
        JOIN contract_to_cte ctc on contracts.id = ctc.contract_id
        WHERE customer_title in (SELECT customer_title
                               FROM contracts
                               WHERE provider_title = ?) and provider_title !=  ?
        and ctc.cte_id in (
            SELECT cte2.cte_id
            FROM contract_to_cte cte2
            JOIN contracts c on cte2.contract_id = c.id
            WHERE c.provider_title = ?
        )
        GROUP BY contracts.provider_title
        ORDER BY 2 DESC
        LIMIT 10`,
              {
                replacements: [PROVIDER_TITLE, PROVIDER_TITLE, PROVIDER_TITLE],
                type: Sequelize.QueryTypes.SELECT,
              }
            );
         return list;
    })


    return res.json(list);
  }

  async getCteForRecommendations (req, res) {
    if (!req.body) return response.sendStatus(400);

    const list = await sequelize.query(
      `	  select cte.title, CAST (AVG( c.amount / c.quantity )  AS INT),count(*)
      from cte 
      join contract_to_cte c on c.cte_id=cte.id
      join contracts b on contract_id=b.id
      where b.customer_title = ?
and cte.title in (select cte.title 
      from cte 
      join contract_to_cte c on c.cte_id=cte.id
      join contracts b on contract_id=b.id
      where b.provider_title = ? )
group by cte.title 
order by 3 DESC`,
      {
        replacements: [req.query.title, PROVIDER_TITLE],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return res.json(list);
  }


  async getAssociatedCte(req, res) {

    if (!req.body) return response.sendStatus(400);

    let data = await cacheWrapper(`getAssociatedCte_${PROVIDER_TITLE}`, async () => {
        const category = await sequelize.query(
                ` select cte.category,count(*) as count
            from cte 
            join contract_to_cte c on c.cte_id=cte.id
            join contracts b on contract_id=b.id
            where b.provider_title = ?
            group by cte.category
            order by 2 desc limit 5`,
                {
                    replacements: [PROVIDER_TITLE],
                    type: Sequelize.QueryTypes.SELECT,
                }
            );

        let data = await Promise.all(category.map(async x => {
          let query = await sequelize.query(`	WITH tbl as (SELECT category, count(*) as count
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
            ORDER BY 2 DESC limit 3 offset 1`, {
            replacements: [x.category],
            type: Sequelize.QueryTypes.SELECT,
          })
          return {
            'category': x.category,
            'count': x.count,
            'items': query
          }

        }))
        return data;
    })

    return res.json(data);
  }
}
module.exports = new Personal();