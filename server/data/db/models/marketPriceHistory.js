module.exports = (sequelize, DataTypes) => {
  return sequelize.define('marketPriceHistory', {
    currency: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    currencyLong: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    convertCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    volumeFor24h: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    percentChangeFor1h: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    percentChangeFor24h: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    percentChangeFor7d: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'market_price_history',
    }
  );
};
