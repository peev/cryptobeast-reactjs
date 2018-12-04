const portfolioService = (repository) => {
  const bigNumberService = require('./big-number-service');
  const weidexService = require('./weidex-service');
  const weidexFiatMsService = require('./weidex-fiat-ms-service');
  const { etherScanServices } = require('../integrations/etherScan-services');

  const calculateTokenValueETH = async (name, amount) => {
    const currency = await repository.findOne({
      modelName: 'Currency',
      options: {
        where: {
          tokenName: name,
        },
      },
    });

    return bigNumberService().product(amount, currency.lastPriceETH);
  };

  const getPortfolioInvestmentSum = async (portfolio, type) => {
    const transactionsArray = portfolio.transactions.map(async (transaction) => {
      if (transaction.type === type) {
        // Calculates investment in eth
        // return calculateTokenValueETH(transaction.tokenName, transaction.amount);
        return transaction.totalValueETH;
      }
      return 0;
    });
    return Promise.all(transactionsArray).then(transactions =>
      transactions.reduce((acc, a) => ((acc !== undefined) ? bigNumberService().sum(acc, a) : 0)));
  };

  const getPortfolioInvestmentSumUSD = async (portfolio, type) => {
    const transactionsArray = portfolio.transactions.map(async (transaction) => {
      if (transaction.type === type) {
        const etherScanTransaction = await etherScanServices().getTransactionByHash(transaction.txHash);
        const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
        const ethValue = await weidexFiatMsService.getEtherValueByTimestamp(etherScanTrBlock.timestamp);
        console.log('------------------------------------');
        console.log(bigNumberService.product(transaction.totalValueETH, ethValue));
        console.log('------------------------------------');
        return bigNumberService.product(transaction.totalValueETH, ethValue);
      }
      return 0;
    });
    return Promise.all(transactionsArray).then(transactions =>
      transactions.reduce((acc, a) => ((acc !== undefined) ? bigNumberService().sum(acc, a) : 0)));
  };

  const getPortfolioInvestmentSumExternal = async (address, fetchDeposits) => {
    let items = [];
    const user = await weidexService().getUserHttp(address);
    if (fetchDeposits) {
      items = await weidexService().getUserDepositHttp(user.id);
    } else {
      items = await weidexService().getUserWithdrawHttp(user.id);
    }
    const transactionsArray = await items.map(async (transaction) => {
      // Calculates investment in eth
      // calculateTokenValueETH(transaction.tokenName, transaction.amount));
      const etherScanTransaction = await etherScanServices().getTransactionByHash(transaction.txHash);
      return (etherScanTransaction !== null && etherScanTransaction !== undefined) ? etherScanTransaction.value : 0;
    });
    return Promise.all(transactionsArray).then(transactions =>
      transactions.reduce((acc, a) => (bigNumberService().sum(acc, a)), 0));
  };

  const calcPortfolioTotalInvestmentETH = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSum(portfolio, 'w');
    return bigNumberService().difference(depositAmount, withdrawAmount);
  };

  const calcPortfolioTotalInvestmentEthExternal = async (portfolioAddress) => {
    const depositAmount = await getPortfolioInvestmentSumExternal(portfolioAddress, true);
    const withdrawAmount = await getPortfolioInvestmentSumExternal(portfolioAddress, false);
    return bigNumberService().difference(depositAmount, withdrawAmount);
  };

  const calcPortfolioTotalInvestmentUSD = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSumUSD(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSumUSD(portfolio, 'w');
    return bigNumberService().difference(depositAmount, withdrawAmount);
  };

  const calcPortfolioTotalInvestmentUSDExternal = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSumUSD(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSumUSD(portfolio, 'w');
    return bigNumberService().difference(depositAmount, withdrawAmount);
  };

  const calcPortfolioTotalValueETH = async (portfolio) => {
    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets
        .map(async asset => calculateTokenValueETH(asset.tokenName, asset.balance)))
        .then(assets => assets.reduce((acc, a) => (bigNumberService().sum(acc, a)), 0));
    }
    return Promise.resolve();
  };

  return {
    calculateTokenValueETH,
    calcPortfolioTotalInvestmentETH,
    calcPortfolioTotalInvestmentEthExternal,
    calcPortfolioTotalInvestmentUSD,
    calcPortfolioTotalInvestmentUSDExternal,
    calcPortfolioTotalValueETH,
  };
};

module.exports = portfolioService;
