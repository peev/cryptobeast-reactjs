const validator = require('validator');

const assetValidator = () => {
  const verifyCreateWeiAsset = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.tokenName !== 'string' || !validator.isLength(payload.tokenName, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid asset token name!' });
    }

    if (!payload || typeof payload.fullAmount !== 'number' || payload.fullAmounts <= 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid asset balance!' });
    }

    return next();
  };

  const verifyUpdateWeiAsset = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.tokenName !== 'string' || !validator.isLength(payload.tokenName, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid asset token name!' });
    }

    if (!payload || typeof payload.fullAmount !== 'number' || payload.fullAmount <= 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid asset balance!' });
    }

    return next();
  };

  return {
    verifyCreateWeiAsset,
    verifyUpdateWeiAsset,
  };
};

module.exports = assetValidator;
