const portfolioService = (repository) => {
  const bigNumberService = require('./big-number-service');

  const calculateTokenValueETH = async (name, amount) => {
    const currency = await repository.findOne({
      modelName: 'Currency',
      options: {
        where: {
          tokenName: name,
        },
      },
    });

    return bigNumberService().bigNum(amount).multipliedBy(bigNumberService().bigNum(currency.lastPriceETH));
  };

  const getPortfolioInvestmentSum = async (portfolio, type) => {
    const transactionsArray = portfolio.transactions.map(async (transaction) => {
      if (transaction.type === type) {
        // Calculates investment in eth
        await calculateTokenValueETH(transaction.tokenName, transaction.amount);
      }
    });
    await Promise.all(transactionsArray).then(transactions =>
      transactions.reduce((acc, a) => bigNumberService().bigNum(acc).plus(bigNumberService().bigNum(a)), 0));
  };

  const calcPortfolioTotalInvestmentETH = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSum(portfolio, 'w');
    return Number(bigNumberService().bigNum(depositAmount).minus(bigNumberService().bigNum(withdrawAmount)));
  };

  const calcPortfolioTotalValueETH = async (portfolio) => {
    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets
        .map(async asset => calculateTokenValueETH(asset.tokenName, asset.balance)))
        .then(assets => assets.reduce((acc, a) => bigNumberService().bigNum(acc).plus(bigNumberService().bigNum(a)), 0));
    }
    return Promise.resolve();
  };

  return {
    calculateTokenValueETH,
    calcPortfolioTotalInvestmentETH,
    calcPortfolioTotalValueETH,
  };
};

module.exports = portfolioService;
