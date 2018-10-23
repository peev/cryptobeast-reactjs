module.exports = (sequelize, DataTypes) => sequelize.define('portfolio', {
  userAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 150],
    },
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  portfolioName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalInvestmentETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  totalInvestmentUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
