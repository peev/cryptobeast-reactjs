const validator = require('validator');

const weiTransactionValidator = () => {
  const verifyCreateWeiTransaction = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.type !== 'string' || !validator.isLength(payload.type, { min: 1, max: 1 }) || !payload.type.matches(/^[d,w{1}]+$/)) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid valid type!' });
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

    if (!payload || typeof payload.date !== 'string' || !validator.isLength(payload.date, { min: 10, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid transaction date!' });
    }

    return next();
  };

  return {
    verifyCreateWeiTransaction,
  };
};

module.exports = weiTransactionValidator;
