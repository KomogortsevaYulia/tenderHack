const Router = require("express");
const router = new Router();
const suppliers = require("./controllers/suppliers");
const personal = require("./controllers/personal");
const opponent=require("./controllers/opponent")
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
router.get("/suppliers/popularsuppliers", opponent.getPopularSuppliers);

// сопутсвующие товары
router.get("/suppliers/associatedCte", suppliers.getAssociatedCte);

// востребованные категории
router.get("/suppliers/popularCategory", suppliers.getPopularCategory);

///////////////////////////////////////////////////////////////////////////////////

//по динамике количества по категориям продавца
router.get("/personal/dynamics", personal.getDynamics);

//популярных за месяц 5 товаров у поставщика
router.get("/personal/popularProducts", personal.getPopularProducts);

//пкатегории поставщика с его продажами
router.get("/personal/category", personal.getCategories);

//распределение типов закупок
router.get("/personal/getTypesContracts",personal.getTypesContracts);

// похожие провайдеры
router.get("/personal/getAnalogProviders",personal.getAnalogProviders);

//сопутсвующие товары данного поставщика
router.get("/personal/getAssociatedCte",personal.getAssociatedCte);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//выдает клиентов конкурентов
router.get("/opponent/getClientByOpponent",opponent.getClientByOpponent);

router.get("/personal/getCteForRecommendations",personal.getCteForRecommendations)


module.exports = router;