module.exports = (sequelize, DataTypes) => sequelize.define('currency', {
  tokenId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 4],
    },
  },
  tokenNameLong: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  decimals: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  bid: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  ask: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  lastPriceETH: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  volume24H: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  high24H: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  low24H: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  change24H: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  change7D: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
