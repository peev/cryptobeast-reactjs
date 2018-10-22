const validator = require('validator');

const tradeHistoryValidator = () => {
  const verifyCreateTradeHistory = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    if (!payload || typeof payload.token.name !== 'string' || !validator.isLength(payload.token.name, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid type!' });
    }

    if (!payload || typeof payload.amount !== 'number' || payload.amount < 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid amount!' });
    }

    if (!payload || typeof payload.price !== 'number' || payload.price < 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid price!' });
    }

    if (!payload || typeof payload.type !== 'string' || !validator.isLength(payload.type, { min: 1, max: 4 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid type!' });
    }

    if (!payload || typeof payload.txHash !== 'string' || !validator.isLength(payload.txHash, { min: 1, max: 150 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid txHash!' });
    }

    if (!payload || typeof payload.status !== 'string' || !validator.isLength(payload.status, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid status!' });
    }

    return next();
  };

  return {
    verifyCreateTradeHistory,
  };
};

module.exports = tradeHistoryValidator;
