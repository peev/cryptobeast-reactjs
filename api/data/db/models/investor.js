module.exports = (sequelize, DataTypes) => {
  return sequelize.define('investor', {
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
      type: DataTypes.DATEONLY,
      validate: {
        len: [3, 20],
      },
    },
    isFounder: {
      type: DataTypes.BOOLEAN
    },
    managementFee: {
      type: DataTypes.DOUBLE,
    },
    purchasedShares: {
      type: DataTypes.DOUBLE,
      // isInt: true,
      // min: 1
    },
  });
};
