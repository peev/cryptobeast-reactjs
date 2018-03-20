module.exports = (sequelize, DataTypes) => {
  return sequelize.define('asset', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    balance: {
      type: DataTypes.DOUBLE,
    },
    available: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    pending: {
      type: DataTypes.DOUBLE,
    },
    cryptoAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requested: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
