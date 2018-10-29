const validator = require('validator');

const mainValidator = () => {
  const verifySync = (req, res, next) => {
    const payload = req.body;

    if (!payload.length) {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    return next();
  };

  return {
    verifySync,
  };
};

module.exports = mainValidator;
