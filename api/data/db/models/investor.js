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
      validate: {
        len: [3, 20],
      },
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
      type: DataTypes.INTEGER,
      // isInt: true,
      // min: 1
    },
  });
};