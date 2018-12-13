module.exports = (sequelize, DataTypes) => sequelize.define('coinMarketCapCurrency', {
  convertCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currencyLong: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  percentChangeFor1h: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  percentChangeFor7d: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  percentChangeFor24h: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  rank: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  volumeFor24h: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});
