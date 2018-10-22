const validator = require('validator');

const currencyValidator = () => {
  const verifyCreateCurrency = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.id !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a currency ID as number!' });
    }

    if (!payload || typeof payload.name !== 'string' || !validator.isLength(payload.name, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid currency name!' });
    }

    if (!payload || typeof payload.fullName !== 'string' || !validator.isLength(payload.fullName, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid currency full name!' });
    }

    return next();
  };

  return {
    verifyCreateCurrency,
  };
};

module.exports = currencyValidator;
