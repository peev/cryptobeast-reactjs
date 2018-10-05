module.exports = (sequelize, DataTypes) => sequelize.define('weiTransaction', {
  type: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 1],
    },
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  txHash: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 150],
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 10],
    },
    allowNull: false,
  },
  tokenName: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 4],
    },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tokenPriceETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  tokenPriceUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  ETHUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
