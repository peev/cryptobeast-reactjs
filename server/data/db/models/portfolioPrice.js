module.exports = (sequelize, DataTypes) => {
  return sequelize.define('portfolioPrice', {
    price: { // In USD
      type: DataTypes.DOUBLE,
    },
  });
};
