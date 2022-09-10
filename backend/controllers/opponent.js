const models = require("../models");
const { Sequelize } = require('sequelize');

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

}
module.exports = new Opponent();