module.exports = (sequelize, DataTypes) => sequelize.define('marketSummaryHistory', {
  MarketName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  High: {
    type: DataTypes.DOUBLE,
  },
  Low: {
    type: DataTypes.DOUBLE,
  },
  Volume: {
    type: DataTypes.DOUBLE,
  },
  Last: {
    type: DataTypes.DOUBLE,
  },
  BaseVolume: {
    type: DataTypes.DOUBLE,
  },
  TimeStamp: {
    type: DataTypes.DATE,
  },
  Bid: {
    type: DataTypes.DOUBLE,
  },
  Ask: {
    type: DataTypes.DOUBLE,
  },
  OpenBuyOrders: {
    type: DataTypes.INTEGER,
  },
  OpenSellOrders: {
    type: DataTypes.INTEGER,
  },
  PrevDay: {
    type: DataTypes.DOUBLE,
  },
  Created: {
    type: DataTypes.DATE,
  },
}, {
  freezeTableName: true,
  tableName: 'market_summary_history',
});
