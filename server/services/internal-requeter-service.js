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

  const getAllocationsByPortfolioIdAsc = async portfolioId => repository.find({
    modelName: 'Allocation',
    options: {
      where: {
        portfolioId,
      },
      order: [['timestamp', 'ASC']],
    },
  }).catch(err => console.log(err));

  const getCurrencies = async () => repository.find({
    modelName: 'Currency',
  }).catch(err => console.log(err));

  const getAssetByPortfolioIdAndTokenName = async (portfolioId, tokenName) => repository.findOne({
    modelName: 'Asset',
    options: {
      where: {
        tokenName,
        portfolioId,
      },
    },
  }).catch(err => console.log(err));

  const getPortfolioByIdIncludeAll = async id => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: { id },
      include: [{ all: true }],
    },
  }).catch(err => console.log(err));

  const getTransactionByTxHash = async txHash => repository.findOne({
    modelName: 'Transaction',
    options: {
      where: {
        txHash,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioByUserAddressIncludeAll = async userAddress => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress,
      },
      include: [{ all: true }],
    },
  }).catch(err => console.log(err));

  const getTradeByTxHash = txHash => repository.findOne({
    modelName: 'TradeHistory',
    options: {
      where: {
        txHash,
      },
    },
  }).catch(err => console.log(err));

  const getTransactionsByPortfolioIdAsc = portfolioId => repository.find({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId,
      },
      order: [['txTimestamp', 'ASC']],
    },
  }).catch(err => console.log(err));

  const getFirstDepositByPortfolioId = portfolioId => repository.findOne({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId,
        type: 'd',
        isFirstDeposit: true,
      },
    },
  }).catch(err => console.log(err));

  const getAllocationBeforeTimestampByPortfolioId = (portfolioId, timestamp) => repository.findOne({
    modelName: 'Allocation',
    options: {
      where: {
        portfolioId,
        timestamp: {
          [op.lte]: timestamp,
        },
      },
      order: [['timestamp', 'ASC']],
    },
  }).catch(err => console.log(err));

  const getTransactionByPortfolioIdAndTxHash = (portfolioId, txHash) => repository.findOne({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId,
        txHash,
      },
    },
  }).catch(err => console.log(err));

  return {
    getCurrencyByTokenName,
    getPortfolioByUserAddress,
    getLastAllocationByPortfolioId,
    getAssetsByPortfolioId,
    getTradesByPortfolioIdGreaterThanTimestampDesc,
    getTransactionsByPortfolioIdGreaterThanTimestampDesc,
    getAllocationsByPortfolioIdAsc,
    getCurrencies,
    getAssetByPortfolioIdAndTokenName,
    getPortfolioByIdIncludeAll,
    getTransactionByTxHash,
    getPortfolioByUserAddressIncludeAll,
    getTradeByTxHash,
    getTransactionsByPortfolioIdAsc,
    getFirstDepositByPortfolioId,
    getAllocationBeforeTimestampByPortfolioId,
    getTransactionByPortfolioIdAndTxHash,
  };
};

module.exports = internalRequesterService;