module.exports = (sequelize, DataTypes) => {
  return sequelize.define('currency', {
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
    timestamps: false,
  }, {
    freezeTableName: true,
    tableName: 'currencies',
  });
};
