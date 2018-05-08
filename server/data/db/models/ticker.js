module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ticker', {
    pair: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    last: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });
};
