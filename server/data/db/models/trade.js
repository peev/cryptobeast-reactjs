module.exports = (sequelize, DataTypes) => {
  return sequelize.define('trade', {
    transactionDate: {
      type: DataTypes.DATEONLY,
    },
    entryDate: {
      type: DataTypes.DATEONLY,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pair: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DOUBLE,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
    },
    commission: {
      type: DataTypes.DOUBLE,
    },
  });
};
