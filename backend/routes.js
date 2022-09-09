const Router = require("express");
const router = new Router();
const suppliers = require("./controllers/suppliers");
const personal = require("./controllers/personal");
const categories=require("./controllers/categories")

//маршрут всех категорий
router.get("/categories", categories.get);

//по динамике количества по определенной категории 
router.get("/suppliers/categories/dynamics", suppliers.getDynamics);

//по проданным товарам выбранной категории ,разделенным по характеристикам
router.get("/suppliers/contractsSpecifications", suppliers.getContractsSpecifications);

//популярных за месяц 5 товаров у поставщиков по всей платформе
router.get("/suppliers/popularProducts", suppliers.getPopularProducts);

//топ поставщиков по выбранной категории
router.get("/suppliers/popularsuppliers", suppliers.getPopularSuppliers);


//по динамике количества по определенной категории 
router.get("/personal/dynamics", personal.getDynamics);

//по проданным товарам ,разделенным по характеристикам
router.get("/personal/contractsSpecifications", personal.getContractsSpecifications);

//популярных за месяц 5 товаров у поставщиков по всей платформе
router.get("/personal/popularProducts", personal.getPopularProducts);

module.exports = router;