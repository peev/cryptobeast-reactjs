const init = (db) => {
  const getAllPortfolios = () => {
    return db.portfolio.findAll();
  };

  const createPortfolio = (data) => {
    const portfolioName = { name: data.name };

    return db.portfolio.create(portfolioName);
  };

  const updatePortfolio = (data) => {
    const updatedPortfolioName = { name: data.updatedName };
    const portfolioName = data.name;

    return db.portfolio.update(updatedPortfolioName, {
      where: { name: portfolioName },
    });
  };

  const deletePortfolio = (data) => {
    const portfolioName = data.name;

    return db.portfolio.destroy({
      where: { name: portfolioName },
    });
  };

  return {
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
};

module.exports = { init };
