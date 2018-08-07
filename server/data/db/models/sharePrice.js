module.exports = (sequelize, DataTypes) => sequelize.define('sharePrice', {
  price: { // In USD
    type: DataTypes.DOUBLE,
  },
  isClosingPrice: {
    type: DataTypes.BOOLEAN,
  },
});
