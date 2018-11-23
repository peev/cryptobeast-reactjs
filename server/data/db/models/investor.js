module.exports = (sequelize, DataTypes) => sequelize.define('investor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 250],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 250],
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  fee: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
