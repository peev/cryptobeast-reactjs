const validator = require('validator');

const fiatFxValidator = () => {
  const verifyCreateFiatFx = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.fxName !== 'string' || !validator.isLength(payload.fxName, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid short name!' });
    }

    if (!payload || typeof payload.fxNameLong !== 'string' || !validator.isLength(payload.fxNameLong, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid long name!' });
    }

    return next();
  };

  return {
    verifyCreateFiatFx,
  };
};

module.exports = fiatFxValidator;
