module.exports = (sequelize, DataTypes) => sequelize.define('transaction', {
  investorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfEntry: {
    type: DataTypes.DATE,
  },
  // transactionDate: {
  //   type: DataTypes.DATE,
  // },
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
