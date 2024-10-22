module.exports = (sequelize, DataTypes) => {
  return sequelize.define('portfolio', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    cost: {
      type: DataTypes.DOUBLE,
      // min: 0.000001,
    },
    baseCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 50],
      },
    },
    shares: {
      type: DataTypes.DOUBLE,
      validate: {
        min: 0,
      },
    },
  });
};
