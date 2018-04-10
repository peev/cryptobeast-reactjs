module.exports = (sequelize, DataTypes) => {
  return sequelize.define('transaction', {
    investorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfEntry: {
      type: DataTypes.DATEONLY,
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
    },
    amountInUSD: {
      type: DataTypes.DOUBLE,
    },
    sharePrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    shares: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  });
};
