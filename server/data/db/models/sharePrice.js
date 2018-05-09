module.exports = (sequelize, DataTypes) => {
  return sequelize.define('sharePrice', {
    price: { // In USD
      type: DataTypes.DOUBLE,
    },
    isClosingPrice: {
      type: DataTypes.BOOLEAN,
    },
  });
};
