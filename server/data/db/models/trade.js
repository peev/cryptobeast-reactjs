module.exports = (sequelize, DataTypes) => sequelize.define('trade', {
  // transactionDate: {
  //   type: DataTypes.DATE,
  //   defaultValue: DataTypes.NOW,
  // },
  dateOfEntry: {
    type: DataTypes.DATE,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pair: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fromAssetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fromCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fromAmount: {
    type: DataTypes.DOUBLE,
  },
  toAssetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toAmount: {
    type: DataTypes.DOUBLE,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  filled: {
    type: DataTypes.DOUBLE,
  },
  fee: {
    type: DataTypes.DOUBLE,
  },
  feeCurrency: {
    type: DataTypes.STRING,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
  },
  market: {
    type: DataTypes.STRING,
  },
});
