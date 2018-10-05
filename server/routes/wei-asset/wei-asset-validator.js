const validator = require('validator');

const assetValidator = () => {
  const verifyCreateWeiAsset = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.currency !== 'string' || !validator.isLength(payload.currency, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    if (!payload || !payload.hasOwnProperty('balance') || typeof payload.balance !== 'number' || payload.balance <= 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Specify currency quantity!' });
    }

    return next();
  };

  const verifyUpdateWeiAsset = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.currency !== 'string' || !validator.isLength(payload.currency, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolio address!' });
    }

    if (!payload || !payload.hasOwnProperty('balance') || typeof payload.balance !== 'number' || payload.balance <= 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Specify currency quantity!' });
    }

    return next();
  };

  return {
    verifyCreateWeiAsset,
    verifyUpdateWeiAsset,
  };
};

module.exports = assetValidator;
