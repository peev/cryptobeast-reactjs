module.exports = (sequelize, DataTypes) => {
  return sequelize.define('setting', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
    },
  });
};
