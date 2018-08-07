// TODO: REMOVE IF IT IS NOT USED. IT IS PROBABLY NOT.
module.exports = (sequelize, DataTypes) => sequelize.define('currency', {
  currency: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  currencyLong: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  minConfirmation: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  txFee: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  coinType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  baseAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  freezeTableName: true,
  tableName: 'currencies',
});
