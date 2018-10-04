const validator = require('validator');

const weiPortfolioValidator = () => {
  const verifyCreateWeiPortfolio = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    if (!payload || typeof payload.name !== 'string' || !validator.isLength(payload.name, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio name!' });
    }
    return next();
  };

  const verifyUpdateWeiPortfolio = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    if (!payload || typeof payload.name !== 'string' || !validator.isLength(payload.name, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio name!' });
    }

    return next();
  };

  return {
    verifyCreateWeiPortfolio,
    verifyUpdateWeiPortfolio,
  };
};

module.exports = weiPortfolioValidator;
