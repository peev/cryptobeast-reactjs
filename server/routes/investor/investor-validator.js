const validator = require('validator');

const investorValidator = () => {
  const createInvestor = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || !payload.hasOwnProperty('email') || !validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Investor must have valid E-mail address!';
    }

    // This field is optional
    // if (payload && payload.hasOwnProperty('telephone')) {
    //   if (!validator.isMobilePhone(payload.telephone, 'any', { strictMode: true })) {
    //     isFormValid = false;
    //     errors.telephone = 'Investor must have valid Telephone number!';
    //   }
    // }

    if (!payload || !payload.hasOwnProperty('fullName') || !validator.isLength(payload.fullName, { min: 1, max: 50 })) {
      isFormValid = false;
      errors.fullName = 'Investor must have a name!';
    }

    if (!payload || !payload.hasOwnProperty('managementFee') || typeof payload.managementFee !== 'string' || !validator.isFloat(payload.managementFee, { min: 0, max: 100 })) {
      isFormValid = false;
      errors.managementFee = 'Investor must have a management fee!';
    }

    // Provided by developer
    if (!payload || !payload.hasOwnProperty('dateOfEntry') || !validator.isLength(payload.dateOfEntry, { min: 10, max: 23 })) {
      isFormValid = false;
      errors.dateOfEntry = 'Provide a date of entry!';
    }

    if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.portfolioId = 'Provide a portfolio ID as number!';
    }

    if (!payload || !payload.hasOwnProperty('isFounder') || typeof payload.isFounder !== 'boolean') {
      isFormValid = false;
      errors.isFounder = 'Provide isFounder key!';
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

  const investorTransaction = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (!payload || !payload.hasOwnProperty('balance') || typeof payload.balance !== 'number') {
      isFormValid = false;
      errors.balance = 'Specify deposit amount!';
    }

    if (!payload || typeof payload.currency !== 'string' || !validator.isLength(payload.currency, { min: 1, max: 4 })) {
      isFormValid = false;
      errors.currency = 'Specify a valid currency!';
    }

    if (!payload || !payload.hasOwnProperty('portfolioId') || typeof payload.portfolioId !== 'number') {
      isFormValid = false;
      errors.portfolioId = 'Specify a portfolio ID as number!';
    }

    // Provided by developer
    // VALIDATE TRANSACTION RECORD
    if (!payload || !payload.hasOwnProperty('transaction') || typeof payload.transaction !== 'object') {
      isFormValid = false;
      errors.transaction = 'Deposit must have associated transaction record!';
    }

    if (payload && payload.hasOwnProperty('transaction') && typeof payload.transaction === 'object') {
      const { transaction } = payload;

      if (!transaction.hasOwnProperty('amountInUSD') || typeof transaction.amountInUSD !== 'number') {
        isFormValid = false;
        errors.amountInUSD = 'Specify transaction amount in USD!';
      }

      if (!transaction.hasOwnProperty('dateOfEntry') || typeof transaction.dateOfEntry !== 'string') {
        isFormValid = false;
        errors.dateOfEntry = 'Specify transaction date of entry!';
      }

      if (!transaction.hasOwnProperty('investorId') || typeof transaction.investorId !== 'number') {
        isFormValid = false;
        errors.investorId = 'Specify investor ID!';
      }

      if (!transaction.hasOwnProperty('investorName') || typeof transaction.investorName !== 'string') {
        isFormValid = false;
        errors.investorName = "Specify investor's name!";
      }

      if (!transaction.hasOwnProperty('portfolioId') || typeof transaction.portfolioId !== 'number') {
        isFormValid = false;
        errors.portfolioIdTransaction = 'Specify portfolio ID for transaction!';
      }

      if (!transaction.hasOwnProperty('sharePrice') || typeof transaction.sharePrice !== 'number') {
        isFormValid = false;
        errors.sharePrice = 'Specify transaction share price!';
      }

      if (!transaction.hasOwnProperty('shares') || typeof transaction.shares !== 'number') {
        isFormValid = false;
        errors.shares = 'Specify transaction total number of shares!';
      }

      if (!transaction.hasOwnProperty('transactionDate') || typeof transaction.transactionDate !== 'string' || !validator.isLength(transaction.transactionDate, { min: 10, max: 10 })) {
        isFormValid = false;
        errors.transactionDate = 'Specify transaction date!';
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

  const updateInvestor = (req, res, next) => {
    const payload = req.body;
    const errors = {};
    let isFormValid = true;

    if (Object.keys(payload).length === 0) {
      isFormValid = false;
    } else {
      if (!payload.hasOwnProperty('email') || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Investor must have valid E-mail address!';
      }

      if (!payload.hasOwnProperty('fullName') || !validator.isLength(payload.fullName, { min: 1, max: 50 })) {
        isFormValid = false;
        errors.fullName = 'Investor must have a name!';
      }

      if (payload.hasOwnProperty('managementFee') && (typeof payload.managementFee !== 'string' || !validator.isFloat(payload.managementFee, { min: 0, max: 100 }))) {
        isFormValid = false;
        errors.managementFee = 'Investor must have a valid management fee amount!';
      }

      // eslint-disable-next-line
      // if (payload.hasOwnProperty('telephone') && (typeof payload.telephone !== 'string' || !validator.isMobilePhone(payload.telephone, 'any', { strictMode: true }))) {
      //   isFormValid = false;
      //   errors.telephone = 'Investor must have valid Telephone number!';
      // }
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

    if (!payload || !payload.hasOwnProperty('id')) {
      isFormValid = false;
      errors.id = 'Specify a valid Investor ID!';
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
    investorTransaction,
    updateInvestor,
    deleteInvestor,
  };
};

module.exports = investorValidator;
