const validator = require('validator');

const weiCurrencyValidator = () => {
  const verifyCreateWeiCurrency = (req, res, next) => {
    const payload = req.body;

    if (!payload || !payload.hasOwnProperty('weiPortfolioId') || typeof payload.weiPortfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Provide a portfolio ID as number!' });
    }

    return next();
  };

  return {
    verifyCreateWeiCurrency,
  };
};

module.exports = weiCurrencyValidator;
