module.exports = (sequelize, DataTypes) => {
  return sequelize.define('account', {
    apiServiceName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 32],
      },
    },
    apiSecret: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 32],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
  });
};
