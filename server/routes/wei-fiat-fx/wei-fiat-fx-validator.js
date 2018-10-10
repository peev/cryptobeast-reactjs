const validator = require('validator');

const weiFiatFxValidator = () => {
  const verifyCreateWeiFiatFx = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.id !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid id type!' });
    }

    if (!payload || typeof payload.fxName !== 'string' || !validator.isLength(payload.fxName, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid short name!' });
    }

    if (!payload || typeof payload.fxNameLong !== 'string' || !validator.isLength(payload.fxNameLong, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid long name!' });
    }

    return next();
  };

  return {
    verifyCreateWeiFiatFx,
  };
};

module.exports = weiFiatFxValidator;
