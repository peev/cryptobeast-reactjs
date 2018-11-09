module.exports = (sequelize, DataTypes) => sequelize.define('allocation', {
  portfolioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  triggerType: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50],
    },
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tokenID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tokenName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 4],
    },
  },
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  tableName: 'allocations',
});
