module.exports = (sequelize, DataTypes) => {
  return sequelize.define('marketSummary', {
    MarketName: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    tableName: 'market_summaries',
  });
};
