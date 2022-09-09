const sequelize = require("./db");
const { DataTypes } = require("sequelize");
//Тут лежат все модели данных для работы с БД
//Сначала написаны сущности, потом связи между ними

const cte = sequelize.define(
  "cte",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    title: { type: DataTypes.STRING() },
    category: { type: DataTypes.STRING() },
    code: { type: DataTypes.STRING()},
  },
  {
    tableName: "cte",
    createdAt: false,
    updatedAt: false,
  }
);

const cte_to_characteristics = sequelize.define(
  "cte_to_characteristics",
  {
    id: {  type: DataTypes.INTEGER , primaryKey: true},
    name: { type: DataTypes.STRING() },
    value: { type: DataTypes.STRING() },
    unit: { type: DataTypes.STRING() },
    cte_: { type: DataTypes.STRING()},
  },
  {
   
    createdAt: false,
    updatedAt: false,
  }
);

const contracts = sequelize.define(
  "contracts",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    contract_number:{ type: DataTypes.STRING()},
    publication_date_ks_on_pp: {  type: DataTypes.RANGE(DataTypes.DATEONLY)},
    contract_date:{ type: DataTypes.RANGE(DataTypes.DATEONLY)},
    customer_inn: { type: DataTypes.STRING()},
    customer_kpp:{ type: DataTypes.STRING()},
    customer_title: { type: DataTypes.STRING()},
    provider_inn:{ type: DataTypes.STRING()},
    provider_kpp:{ type: DataTypes.STRING()},
    provider_title: { type: DataTypes.STRING()},
    amount:{ type: DataTypes.INTEGER},
  },
  {
    tableName: "contracts",
    createdAt: false,
    updatedAt: false,
  }
);

const contract_to_cte = sequelize.define(
  "contract_to_cte",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    quantity: { type: DataTypes.DOUBLE},
    amount: { type: DataTypes.DOUBLE},

  },
  {
    createdAt: false,
    updatedAt: false,
  }
);


contracts.hasMany(contract_to_cte, {
  foreignKey: "contract_id",
});
contract_to_cte.belongsTo(contracts, {
  foreignKey: "datecontract_idid",
});

cte.hasMany(contract_to_cte, {
  foreignKey: "cte_id",
});
contract_to_cte.belongsTo(cte, {
  foreignKey: "cte_id",
});

cte.hasMany(cte_to_characteristics, {
  foreignKey: "cte_id",
});
cte_to_characteristics.belongsTo(cte, {
  foreignKey: "cte_id",
});


module.exports = {
  contracts,
  contract_to_cte,
  cte,
  cte_to_characteristics
};
