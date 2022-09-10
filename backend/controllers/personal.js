const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const  { format, compareAsc } =require( 'date-fns');
const {PROVIDER_TITLE} = require("../consts");

 

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
        replacements: [req.query.firstDay,req.query.lastDay,PROVIDER_TITLE],
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
        where b.contract_date > ? and b.contract_date < ? and b.provider_title = ?
        group by title 
        order by 2 desc
        limit 5`,
      {
        replacements: [req.query.firstDay,req.query.lastDay,PROVIDER_TITLE],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );

   
    return res.json(list);
  }
}
module.exports = new Personal();