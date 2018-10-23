module.exports = (sequelize, DataTypes) => sequelize.define('fiatFx', {
  fxName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  priceUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  tableName: 'weiFiatFX',
});
