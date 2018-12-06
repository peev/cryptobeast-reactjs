const internalRequesterService = (repository) => {
  const Sequelize = require('sequelize');
  const op = Sequelize.Op;

  const getCurrencyByTokenName = async tokenName => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName,
      },
    },
  }).catch(err => console.log(err));

  const getPortfolioByUserAddress = async userAddress => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress,
      },
    },
  }).catch(err => console.log(err));

  const getLastAllocationByPortfolioId = async portfolioId => repository.findOne({
    modelName: 'Allocation',
    options: {
      where: {
        portfolioId,
      },
      order: [['timestamp', 'DESC']],
    },
  }).catch(err => console.log(err));

  const getAssetsByPortfolioId = async portfolioId => repository.find({
    modelName: 'Asset',
    options: {
      where: {
        portfolioId,
      },
    },
  }).catch(err => console.log(err));

  const getTradesByPortfolioIdGreaterThanTimestampDesc = async (portfolioId, timestamp) => repository.find({
    modelName: 'TradeHistory',
    options: {
      where: {
        portfolioId,
        status: 'FILLED',
        timestamp: {
          [op.gt]: timestamp,
        },
      },
      order: [['timestamp', 'DESC']],
      raw: true,
    },
  }).catch(err => console.log(err));

  const getTransactionsByPortfolioIdGreaterThanTimestampDesc = async (portfolioId, txTimestamp) => repository.find({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId,
        status: 'SUCCESS',
        txTimestamp: {
          [op.gt]: txTimestamp,
        },
      },
      order: [['txTimestamp', 'DESC']],
      raw: true,
    },
  }).catch(err => console.log(err));

  return {
    getCurrencyByTokenName,
    getPortfolioByUserAddress,
    getLastAllocationByPortfolioId,
    getAssetsByPortfolioId,
    getTradesByPortfolioIdGreaterThanTimestampDesc,
    getTransactionsByPortfolioIdGreaterThanTimestampDesc,
  };
};

module.exports = internalRequesterService;
