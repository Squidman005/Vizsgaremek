const { Sequelize } = require("sequelize");
const { DbError } = require("../../errors");

const sequelize = new Sequelize("sqlite::memory:", 
{
    logging: false,
});

const models = require("../../models")(sequelize);

const db = 
{
    Sequelize,
    sequelize,
    ...models,
};

module.exports = db;