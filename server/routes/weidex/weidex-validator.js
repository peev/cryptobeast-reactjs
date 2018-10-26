const validator = require('validator');

const weidexValidator = () => {
  const verifySync = (req, res, next) => {
    const payload = req.body;

    if (!payload.length) {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a valid wallet!' });
    }

    return next();
  };

  return {
    verifySync,
  };
};

module.exports = weidexValidator;
