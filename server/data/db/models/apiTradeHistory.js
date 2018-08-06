module.exports = (sequelize, DataTypes) => {
  return sequelize.define('apiTradeHistory', {
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sourceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pair: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
    },
    entryDate: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    volume: {
      type: DataTypes.DOUBLE,
    },
  }, {
      freezeTableName: true,
      tableName: 'api_trade_history',
    });
};
