// TODO: Create new model repository and add it here
const portfolioData = require('./portfolio-repository');
const accountData = require('./account-repository');
const marketData = require('./market-repository');

const init = (db) => {
  return {
    // TODO: Add model repository reference
    portfolio: portfolioData.init(db),
    account: accountData.init(db),
    market: marketData.init(db),
  };
};

module.exports = { init };
