const validator = require('validator');

const transactionValidator = () => {
  const verifyCreateTransaction = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.type !== 'string' || !validator.isLength(payload.type, { min: 1, max: 1 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid type!' });
    }

    if (!payload || typeof payload.amount !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid amount type!' });
    }

    if (!payload || typeof payload.txHash !== 'string' || !validator.isLength(payload.txHash, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction hash!' });
    }

    if (!payload || typeof payload.status !== 'string' || !validator.isLength(payload.status, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction status!' });
    }

    if (!payload || typeof payload.tokenName !== 'string' || !validator.isLength(payload.tokenName, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction token name!' });
    }

    return next();
  };

  const verifyUpdateTransaction = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.type !== 'string' || !validator.isLength(payload.type, { min: 1, max: 1 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid type!' });
    }

    if (!payload || typeof payload.amount !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid amount type!' });
    }

    if (!payload || typeof payload.txHash !== 'string' || !validator.isLength(payload.txHash, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction hash!' });
    }

    if (!payload || typeof payload.status !== 'string' || !validator.isLength(payload.status, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction status!' });
    }

    if (!payload || typeof payload.tokenName !== 'string' || !validator.isLength(payload.tokenName, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction token name!' });
    }

    return next();
  };

  return {
    verifyCreateTransaction,
    verifyUpdateTransaction,
  };
};

module.exports = transactionValidator;
