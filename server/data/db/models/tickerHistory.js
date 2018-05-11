module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tickerHistory', {
    pair: {
      type: DataTypes.STRING,
    },
    last: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  }, {
      freezeTableName: true,
      tableName: 'ticker_history',
    });
};
