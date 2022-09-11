const models = require("../models");
const {Sequelize} = require('sequelize');
const {cache, cacheWrapper} = require("../cache")

class Categories {
    async get(req, res) {
        const list = await cacheWrapper("all_categories2", async () => {
            let result = await models.cte.findAll(
                {
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
                }
            );
            return result
        });
        return res.json(list);
    }
}

module.exports = new Categories();