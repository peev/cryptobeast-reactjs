// TODO: Create new model repository and add it here
const portfolioData = require('./portfolio-repository');
const investorData = require('./investor-repository');

const init = (db) => {
  return {
    // TODO: Add model repository reference
    portfolio: portfolioData.init(db),
    investor: investorData.init(db),
  };
};

module.exports = { init };
