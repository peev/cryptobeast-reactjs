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

  const getPortfolioInvestmentSum = async (address, fetchDeposits) => {
    let items = [];
    const user = await weidexService().getUserHttp(address);
    if (fetchDeposits) {
      items = await weidexService().getUserDepositHttp(user.id);
    } else {
      items = await weidexService().getUserWithdrawHttp(user.id);
    }
    const transactionsArray = await items.map(async (transaction) => {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(transaction.txHash);
      const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const ethToUsd = await weidexFiatMsService().getEtherValueByTimestamp(Number(etherScanTrBlock.timestamp) * 1000).then(data => data.priceUSD);
      return (etherScanTransaction !== null && etherScanTransaction !== undefined) ?
        {
          eth: transaction.amount,
          usd: bigNumberService().product(bigNumberService().gweiToEth(transaction.amount), ethToUsd),
        } : 0;
    });
    return Promise.all(transactionsArray).then((transactions) => {
      const eth = transactions.reduce((acc, obj) => ((bigNumberService().sum(acc, obj.eth))), 0);
      const usd = transactions.reduce((acc, obj) => ((bigNumberService().sum(acc, obj.usd))), 0);
      return { eth, usd };
    });
  };

  const calcPortfolioTotalInvestment = async (portfolioAddress) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolioAddress, true);
    const withdrawAmount = await getPortfolioInvestmentSum(portfolioAddress, false);
    return Promise.resolve({
      eth: bigNumberService().difference(depositAmount.eth, withdrawAmount.eth),
      usd: bigNumberService().difference(depositAmount.usd, withdrawAmount.usd),
    });
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
    calcPortfolioTotalInvestment,
    calcPortfolioTotalValueETH,
  };
};

module.exports = portfolioService;
