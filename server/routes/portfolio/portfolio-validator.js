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

  const verifyUpdatePortfolioName = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.portfolioName !== 'string' || !validator.isLength(payload.portfolioName, { min: 1, max: 150 }) ||
       !validator.matches(payload.portfolioName, /^[a-zA-Z0-9 _.-]*$/)) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio name format!' });
    }

    return next();
  };

  return {
    verifyCreatePortfolio,
    verifyUpdatePortfolio,
    verifyUpdatePortfolioName,
  };
};

module.exports = portfolioValidator;
