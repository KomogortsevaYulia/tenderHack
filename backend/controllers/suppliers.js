const models = require("../models");
const { Op } = require("sequelize");

class Suppliers {
  
  async getPriceDynamics(req, res) {

    // if (!req.body) return response.sendStatus(400);
    
    // // const list = await models.Students.findAll({
    // //   attributes: ["id"],
    // // });

    // var priceDynamics= list.map()
    
    // {
    //   data: ,
    //   value: ,
    //   type:
    // }
    
    // for (let i = 0; i < .length; i++) {
      
    // }
    // let new_prices = prices.map(price => price * 1.06);

    return res.json(courseCount);
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
