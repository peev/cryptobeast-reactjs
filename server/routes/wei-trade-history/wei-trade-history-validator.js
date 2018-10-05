const validator = require('validator');

const weiTradeHistoryValidator = () => {
  const verifyCreateWeiTradeHistory = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('amount') || typeof payload.amount !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a valid amount!' });
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

    if (!payload || typeof payload.pair !== 'string' || !validator.isLength(payload.pair, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid pair!' });
    }

    return next();
  };

  const verifyUpdateWeiTradeHistory = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.amount !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid amount type!' });
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

    if (!payload || typeof payload.pair !== 'string' || !validator.isLength(payload.pair, { min: 1, max: 10 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid pair!' });
    }

    return next();
  };

  return {
    verifyCreateWeiTradeHistory,
    verifyUpdateWeiTradeHistory,
  };
};

module.exports = weiTradeHistoryValidator;
