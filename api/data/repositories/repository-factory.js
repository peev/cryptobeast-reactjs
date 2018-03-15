// TODO: Create new model repository and add it here
const portfolioData = require('./portfolio-repository');

const init = (db) => {
  return {
    // TODO: Add model repository reference
    portfolio: portfolioData.init(db),
  };
};

module.exports = { init };
