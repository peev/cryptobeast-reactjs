module.exports = (sequelize, DataTypes) => sequelize.define('portfolioPrice', {
  price: { // In USD
    type: DataTypes.DOUBLE,
  },
});
