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
      modelName: 'MarketSummary',
      options: {
        where: {
          MarketName: 'USD-ETH',
        },
      },
    });

    return amountETH * summary.Last;
  };

  const calcPortfolioTotalInvestment = async (portfolio) => {
    let depositAmount = 0;
    let withdrawAmount = 0;
    await Promise.all(portfolio.weiTransactions.map(async (transaction) => {
      switch (transaction.type) {
        case 'w':
          withdrawAmount += await calculateEtherValueUSD(await calculateTokenValueETH(transaction.tokenName, transaction.amount));
          break;
        case 'd':
          depositAmount += await calculateEtherValueUSD(await calculateTokenValueETH(transaction.tokenName, transaction.amount));
          break;
        default:
          break;
      }
    }));
    return Number(depositAmount - withdrawAmount);
  };

  return {
    calculateTokenValueETH,
    calculateEtherValueUSD,
    calcPortfolioTotalInvestment,
  };
};

module.exports = weiPortfolioService;
