const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");

class Opponent {

  async getClientByOpponent(req, res) {
    if (!req.body) return response.sendStatus(400);
  
    const list = await sequelize.query(
        `		   
        SELECT c.customer_title , c.customer_inn , c.customer_kpp , count(*)
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
	    JOIN cte b ON b.id = contract_to_cte.cte_id
      WHERE c.provider_title=?
      group by c.customer_title,c.customer_inn , c.customer_kpp 
      order by 4 desc
      `,
      {
        replacements: [req.query.provider_title],
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
}
module.exports = new Opponent();