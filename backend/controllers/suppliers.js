const models = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const  { format, compareAsc } =require( 'date-fns');


class Suppliers {
  
  async getPriceDynamics(req, res) {

    if (!req.body) return response.sendStatus(400);
   
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
      where cte.category=? and d.name=?
      group by d.value
      order by 2 desc`,
    {
      replacements: [req.query.category,req.query.name],
      type: Sequelize.QueryTypes.SELECT,
    } 
  );
    return res.json(list);
  }


  async getPopularProducts(req, res) {

    if (!req.body) return response.sendStatus(400);

      ////////////////////////////////////////////переделать
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let f = new Date(year, month, 1).getDate();
      let l = new Date(year, month, 0).getDate();
  
      f = f < 10 ? '0'+f : f;
      l = l < 10 ? '0'+l : l;
      month = month < 10 ? '0'+month : month;
      const firstDay = new Date(`${year-1}-${month}-${f}`);
      const lastDay = new Date(`${year-1}-${month}-${l}`);
  
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
        replacements: [format(firstDay, 'dd.MM.yyyy'),format(lastDay, 'dd.MM.yyyy')],
        type: Sequelize.QueryTypes.SELECT,
      } 
    );

   
    return res.json(list);
  }
}
module.exports = new Suppliers();
