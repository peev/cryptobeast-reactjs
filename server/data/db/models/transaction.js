module.exports = (sequelize, DataTypes) => sequelize.define('transaction', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 1],
    },
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
  txTimestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tokenPriceETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  tokenPriceUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  totalValueETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  totalValueUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  ETHUSD: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
