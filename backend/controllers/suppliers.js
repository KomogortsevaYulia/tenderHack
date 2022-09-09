const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");

class Suppliers {
  
  async getPriceDynamics(req, res) {

    if (!req.body) return response.sendStatus(400);
    console.log(req.query);

    const list = await sequelize.query(
      `SELECT c.contract_date AS date , quantity AS count
      FROM contract_to_cte
      JOIN contracts c ON c.id = contract_to_cte.contract_id
      WHERE contract_to_cte.cte_id in (SELECT id
                    FROM cte
                    WHERE category = ? )`,
      {
        replacements: [req.query.category],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );

    // var priceDynamics= list.map()
    
    // {
    //   data: , 
    //   value: ,
    //   type:
    // }
    
    // for (let i = 0; i < .length; i++) {
      
    // }
    // let new_prices = prices.map(price => price * 1.06);

    return res.json(list);
  }

  async getContracts(req, res) {
    if (!req.body) return response.sendStatus(400);
    
    return res.json(courseCount);
  }

  async getPopularProducts(req, res) {
    if (!req.body) return response.sendStatus(400);
    
    return res.json(courseCount);
  }

  async getPopularProductsCategories(req, res) {
    if (!req.body) return response.sendStatus(400);
    
    return res.json(courseCount);
  }
}
module.exports = new Suppliers();
