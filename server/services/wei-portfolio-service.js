const weiPortfolioService = (repository) => {
  const modelName = 'WeiPortfolio';

  const updateWeiPortfolioTotalInvestment = async (portfolioId) => {
    const portfolio = await repository.findOne({
      modelName,
      options: {
        where: { id: portfolioId },
      },
    });

    if (portfolio.WeiTransactions !== 0) {
      return Promise.all(portfolio.weiTransactions.map((transaction) => {
        console.log(transaction.amount);
      }));
    }
    return Promise.resolve(); // just for the sake of eslint rule consistent-returns
  };

  return {
    updateWeiPortfolioTotalInvestment,
  };
};

module.exports = weiPortfolioService;
