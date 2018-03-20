// TODO: Create new model repository and add it here
const portfolioData = require('./portfolio-repository');
const assetData = require('./asset-repository');
const accountData = require('./account-repository');
const marketData = require('./market-repository');
const investorData = require('./investor-repository');

const init = (db) => {
  return {
    // TODO: Add model repository reference
    portfolio: portfolioData.init(db),
    asset: assetData.init(db),
    account: accountData.init(db),
    market: marketData.init(db),
    investor: investorData.init(db),
    // marketHistoryPrice: marketHistoryPriceData.init(db),
  };
};

module.exports = { init };
