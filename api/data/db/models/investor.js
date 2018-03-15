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
    isFounder: {
      type: DataTypes.BOOLEAN
    },
    agreedFee: {
      type: DataTypes.DOUBLE,
    },
    shares: {
      type: DataTypes.INTEGER,
      // isInt: true,
      // min: 1
    },
  });
};
