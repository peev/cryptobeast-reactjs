module.exports = (sequelize, DataTypes) => sequelize.define('weiPortfolio', {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 150],
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalInvestment: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
