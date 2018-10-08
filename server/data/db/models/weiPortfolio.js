module.exports = (sequelize, DataTypes) => sequelize.define('weiPortfolio', {
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
  totalInvestment: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
