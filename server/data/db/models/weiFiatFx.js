module.exports = (sequelize, DataTypes) => sequelize.define('weiFiatFx', {
  type: {
    id: DataTypes.DOUBLE,
    allowNull: false,
  },
  amount: {
    fxName: DataTypes.STRING,
    allowNull: false,
  },
  priceETH: {
    fxNameLong: DataTypes.STRING,
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
