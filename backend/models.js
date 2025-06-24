const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import sequelize yang sudah dikonfigurasi

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  keyword: { type: DataTypes.STRING, allowNull: false }
});

const Analysis = sequelize.define('Analysis', {
  video_id: { type: DataTypes.STRING },
  positive: { type: DataTypes.INTEGER },
  negative: { type: DataTypes.INTEGER },
  neutral: { type: DataTypes.INTEGER }
});

// Setup relasi
Product.hasMany(Analysis);
Analysis.belongsTo(Product);

// Ekspor model DAN sequelize
module.exports = { 
  Product, 
  Analysis,
  sequelize // Tambahkan ini
};