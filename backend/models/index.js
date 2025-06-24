const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URI || 'sqlite:database.sqlite');

// Contoh model Product
const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  keyword: DataTypes.STRING,
});

// Contoh model Analysis (tambahkan sesuai kebutuhan Anda)
const Analysis = sequelize.define('Analysis', {
  // definisi kolom
});

// Export instance sequelize dan model-model
module.exports = {
  sequelize,
  Product,
  Analysis
};