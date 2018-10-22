const validator = require('validator');

const portfolioValidator = () => {
  const verifyCreatePortfolio = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    return next();
  };

  const verifyUpdatePortfolio = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    return next();
  };

  return {
    verifyCreatePortfolio,
    verifyUpdatePortfolio,
  };
};

module.exports = portfolioValidator;
