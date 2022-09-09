const models = require("../models");
const { Sequelize } = require('sequelize');

class Categories {

  async get(req, res) {
    const list = await models.cte.findAll(
      {
        attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')) ,'category']
      }
      );
    return res.json(list);
  }

}
module.exports = new Categories();