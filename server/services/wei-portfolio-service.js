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

  const calcPortfolioTotalValue = async (portfolio) => {
    if (portfolio.weiAssets !== 0) {
      return Promise.all(portfolio.weiAssets.map(async asset => calculateEtherValueUSD(await calculateTokenValueETH(asset.tokenName, asset.balance))))
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
