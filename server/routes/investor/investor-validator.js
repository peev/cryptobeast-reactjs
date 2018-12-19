const validator = require('validator');

const investorValidator = () => {
  const createInvestor = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || !payload.hasOwnProperty('name') || !validator.isLength(payload.name, { min: 1, max: 250 })) {
      isFormValid = false;
      errors.name = 'Investor must have a name!';
    }

    if (!payload || !payload.hasOwnProperty('email') || !validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Investor must have valid E-mail address!';
    }

    if (!payload || !payload.hasOwnProperty('phone') || !validator.isLength(payload.phone, { min: 1, max: 50 })) {
      isFormValid = false;
      errors.phone = 'Investor must have valid Telephone number!';
    }

    if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.phone = 'Investor must have valid user portfolio ID number!';
    }

    if (!payload || !payload.hasOwnProperty('fee') || !validator.isLength(payload.fee, { min: 1, max: 50 })) {
      isFormValid = false;
      errors.phone = 'Investor must have valid user portfolio ID number!';
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

  const updateInvestor = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (Object.keys(payload).length === 0) {
      isFormValid = false;
    } else {
      if (!payload || !payload.hasOwnProperty('name') || !validator.isLength(payload.name, { min: 1, max: 250 })) {
        isFormValid = false;
        errors.name = 'Investor must have a name!';
      }
      if (!payload || !payload.hasOwnProperty('email') || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Investor must have valid E-mail address!';
      }
      if (!payload || !payload.hasOwnProperty('phone') || !validator.isLength(payload.phone, { min: 1, max: 50 })) {
        isFormValid = false;
        errors.phone = 'Investor must have valid Telephone number!';
      }
      if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
        isFormValid = false;
        errors.phone = 'Investor must have valid user portfolio ID number!';
      }
      if (!payload || !payload.hasOwnProperty('fee') || !validator.isLength(payload.fee, { min: 1, max: 50 })) {
        isFormValid = false;
        errors.phone = 'Investor must have valid user portfolio ID number!';
      }
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

  const deleteInvestor = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (Object.keys(payload).length === 0) {
      isFormValid = false;
    } else if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.phone = 'Provide valid portfolio ID!';
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
    createInvestor,
    updateInvestor,
    deleteInvestor,
  };
};

module.exports = investorValidator;
