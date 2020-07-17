const SequelizeImport = require("sequelize");
require("dotenv").config();

const sequelize = new SequelizeImport(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;