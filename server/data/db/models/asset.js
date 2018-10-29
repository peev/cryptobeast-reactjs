module.exports = (sequelize, DataTypes) => sequelize.define('asset', {
  tokenName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 4],
    },
  },
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  available: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  inOrder: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  lastPriceETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  lastPriceUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  totalUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  totalETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  weight: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
