const portfolioData = require('./portfolio-data');

const init = (db) => {
  return {
    portfolio: portfolioData.init(db),
  };
};

module.exports = { init };
