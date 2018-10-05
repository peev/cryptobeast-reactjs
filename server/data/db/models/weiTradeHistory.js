module.exports = (sequelize, DataTypes) => sequelize.define('weiTradeHistory', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  priceETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  priceUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  txFee: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  pair: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  tableName: 'weiTradeHistory',
});
