const portfolioService = (repository) => {
  const calculateTokenValueETH = async (name, amount) => {
    const currency = await repository.findOne({
      modelName: 'Currency',
      options: {
        where: {
          tokenName: name,
        },
      },
    });

    return amount * currency.lastPriceETH;
  };

  const getPortfolioInvestmentSum = async (portfolio, type) => {
    if (portfolio.transactions !== 0) {
      return Promise.all(portfolio.transactions
        .map(async (transaction) => {
          if (transaction.type === type) {
            // Calculates investment in eth
            await calculateTokenValueETH(transaction.tokenName, transaction.balance);
          }
        }))
        .then(transactions => transactions.reduce((acc, a) => acc + a, 0));
    }
    return Promise.resolve();
  };

  const calcPortfolioTotalInvestmentETH = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSum(portfolio, 'w');
    return Number(depositAmount - withdrawAmount);
  };

  const calcPortfolioTotalValueETH = async (portfolio) => {
    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets
        .map(async asset => calculateTokenValueETH(asset.tokenName, asset.balance)))
        .then(assets => assets.reduce((acc, a) => acc + a, 0));
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
