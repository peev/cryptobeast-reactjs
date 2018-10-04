const validator = require('validator');

const weiUserValidator = () => {
  const verifyCreateWeiUser = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid user address!' });
    }

    if (!payload.portfolioId || payload.portfolioId === '' || typeof payload.portfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolioId' });
    }
    return next();
  };

  const verifyUpdateWeiUser = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.address !== 'string' || !validator.isLength(payload.address, { min: 1, max: 50 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid user address!' });
    }

    if (!payload.portfolioId || payload.portfolioId === '' || typeof payload.portfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolioId' });
    }
    return next();
  };

  return {
    verifyCreateWeiUser,
    verifyUpdateWeiUser,
  };
};

module.exports = weiUserValidator;
