const weiPortfolioService = (repository) => {
  const calculateTokenValueETH = async (name, amount) => {
    const currency = await repository.findOne({
      modelName: 'WeiCurrency',
      options: {
        where: {
          tokenName: name,
        },
      },
    });

    return amount * currency.lastPriceETH;
  };

  const calculateEtherValueUSD = async (amountETH) => {
    const summary = await repository.findOne({
      modelName: 'WeiFiatFx',
      options: {
        where: {
          fxName: 'ETH',
        },
      },
    });

    return amountETH * summary.priceUSD;
  };

  const getPortfolioInvestmentSum = async (portfolio, type) => {
    if (portfolio.weiTransactions !== 0) {
      return Promise.all(portfolio.weiTransactions
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

  const calcPortfolioTotalInvestment = async (portfolio) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolio, 'd');
    const withdrawAmount = await getPortfolioInvestmentSum(portfolio, 'w');
    return Number(depositAmount - withdrawAmount);
  };

  const calcPortfolioTotalValue = async (portfolio) => {
    if (portfolio.weiAssets !== 0) {
      return Promise.all(portfolio.weiAssets
        .map(async asset => calculateEtherValueUSD(await calculateTokenValueETH(asset.tokenName, asset.balance))))
        .then(assets => assets.reduce((acc, a) => acc + a, 0));
    }
    return Promise.resolve();
  };

  return {
    calculateTokenValueETH,
    calculateEtherValueUSD,
    calcPortfolioTotalInvestment,
    calcPortfolioTotalValue,
  };
};

module.exports = weiPortfolioService;
