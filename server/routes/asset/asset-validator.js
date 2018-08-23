const validator = require('validator');

const assetValidator = () => {
  const addAsset = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.portfolioId = 'Provide a portfolio ID as number!';
    }

    if (!payload || typeof payload.currency !== 'string' || !validator.isLength(payload.currency, { min: 1, max: 4 })) {
      isFormValid = false;
      errors.currency = 'Specify a valid currency!';
    }

    if (!payload || !payload.hasOwnProperty('balance') || typeof payload.balance !== 'number' || payload.balance <= 0) {
      isFormValid = false;
      errors.balance = 'Specify currency quantity!';
    }

    if (!payload || !payload.hasOwnProperty('origin') || typeof payload.origin !== 'string') {
      isFormValid = false;
      errors.origin = 'Specify asset origin!';
    }

    if (!isFormValid) {
      return res.status(400).json({
        isSuccessful: false,
        message: 'Fill all the required fields with valid input.',
        errors,
      });
    }
    return next();
  };

  const allocate = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.feeCurrency !== 'string' || !validator.isLength(payload.feeCurrency, { min: 3, max: 5 })) {
      isFormValid = false;
      errors.feeCurrency = 'Specify a valid fee currency!';
    }

    if (!payload || !payload.hasOwnProperty('feeAmount') || typeof payload.feeAmount !== 'number' || payload.feeAmount < 0 || payload.feeAmount > 99) {
      isFormValid = false;
      errors.feeAmount = 'Specify valid fee amount!';
    }

    if (!payload || typeof payload.fromCurrency !== 'string' || !validator.isLength(payload.fromCurrency, { min: 3, max: 5 })) {
      isFormValid = false;
      errors.fromCurrency = 'Specify a valid paid or sent currency!';
    }

    if (!payload || !payload.hasOwnProperty('fromAmount') || typeof payload.fromAmount !== 'string' || !validator.isFloat(payload.fromAmount, { min: 0, max: Number.MAX_SAFE_INTEGER })) {
      isFormValid = false;
      errors.fromAmount = 'Specify valid paid or sent amount!';
    }

    if (!payload || typeof payload.toCurrency !== 'string' || !validator.isLength(payload.toCurrency, { min: 3, max: 5 })) {
      isFormValid = false;
      errors.toCurrency = 'Specify a valid bought or received currency!';
    }

    if (!payload || !payload.hasOwnProperty('toAmount') || typeof payload.toAmount !== 'string' || !validator.isFloat(payload.toAmount, { min: 0, max: Number.MAX_SAFE_INTEGER })) {
      isFormValid = false;
      errors.toAmount = 'Specify valid bought or received  amount!';
    }

    // Optional
    if (payload.hasOwnProperty('selectedExchange') && (typeof payload.selectedExchange !== 'string' || !validator.isLength(payload.selectedExchange, { min: 1, max: 50 }))) {
      isFormValid = false;
      errors.selectedExchange = 'Specify a valid Exchange!';
    }

    // Provided by developer
    if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.portfolioId = 'Specify a portfolio ID as number!';
    }

    if (!payload || !payload.hasOwnProperty('selectedDate') || !validator.isLength(payload.selectedDate, { min: 10, max: 10 })) {
      isFormValid = false;
      errors.selectedDate = 'Specify a valid date!';
    }

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
    addAsset,
    allocate,
  };
};

module.exports = assetValidator;
