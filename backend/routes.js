const Router = require("express");
const router = new Router();
const suppliers = require("./controllers/suppliers");
const categories=require("./controllers/categories")

//маршрут всех категорий
router.get("/categories", categories.get);

//по динамике количества по определенной категории 
router.get("/suppliers/categories/dynamics", suppliers.getPriceDynamics);

//по проданным товарам выбранной категории ,разделенным по характеристикам
router.get("/suppliers/contractsSpecifications", suppliers.getContractsSpecifications);

//популярных за месяц 5 товаров у поставщиков по всей платформе
router.get("/suppliers/popularProducts", suppliers.getPopularProducts);

module.exports = router;