module.exports = (sequelize, DataTypes) => sequelize.define('weiFiatFx', {
  fxName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fxNameLong: {
    type: DataTypes.STRING,
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
