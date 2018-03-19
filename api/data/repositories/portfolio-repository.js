const init = (db) => {
  // TODO: Setup portfolio CRUD operations
  // const getAll = () => {
  //   return db.portfolio.findAll();
  // };
  const create = (request) => {
    const portfolioName = { name: request.name };

    return db.Portfolio.create(portfolioName);
  };

  // With Eager loading of assets, accounts and investors
  const getAll = () => {
    return db.Portfolio.findAll({ include: [db.Account] });
  };

  const update = (request) => {
    const updatedPortfolioName = { name: request.name };
    const portfolioId = request.id;

    return db.Portfolio.update(updatedPortfolioName, {
      where: { id: portfolioId },
    });
  };

  const remove = (request) => {
    const portfolioId = request.id;

    return db.Portfolio.destroy({
      where: { id: portfolioId },
    });
  };

  return {
    getAll,
    create,
    update,
    remove,
  };
};

module.exports = { init };
