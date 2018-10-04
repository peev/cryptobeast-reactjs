module.exports = (sequelize, DataTypes) => sequelize.define('weiUser', {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  portfolioId: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});
