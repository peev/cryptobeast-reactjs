module.exports = (sequelize, DataTypes) => sequelize.define('investor', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  telephone: {
    type: DataTypes.STRING,
  },
  dateOfEntry: {
    type: DataTypes.DATE,
  },
  isFounder: {
    type: DataTypes.BOOLEAN,
  },
  managementFee: {
    type: DataTypes.DOUBLE,
  },
  purchasedShares: {
    type: DataTypes.DOUBLE,
    validate: {
      min: 0,
    },
  },
});
