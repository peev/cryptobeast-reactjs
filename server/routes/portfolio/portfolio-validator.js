const validator = require('validator');

const portfolioValidator = () => {
  const createPortfolio = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.name !== 'string' || !validator.isLength(payload.name, { min: 1, max: 50 })) {
      isFormValid = false;
      errors.name = 'Enter valid portfolio name!';
    }

    // if (!payload || typeof payload.baseCurrency !== 'string' || !validator.isLength(payload.baseCurrency, { min: 1, max: 5 })) {
    //   isFormValid = false;
    //   errors.baseCurrency = 'Choose a valid base currency!';
    // }

    // if (!payload || typeof payload.cost !== 'string' || !validator.isFloat(payload.cost)) {
    //   isFormValid = false;
    //   errors.cost = 'Portfolio must have a default cost!';
    // }

    if (!isFormValid) {
      return res.status(400).json({
        isSuccessful: false,
        message: 'Fill all the required fields with valid input.',
        errors,
      });
    }
    return next();
  };

  return {
    createPortfolio,
  };
};

module.exports = portfolioValidator;
