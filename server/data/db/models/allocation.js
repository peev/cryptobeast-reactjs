module.exports = (sequelize, DataTypes) => sequelize.define('allocation', {
  portfolioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  triggerType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 4],
    },
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 4],
    },
  },
  balance: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});
