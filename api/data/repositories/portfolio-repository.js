const init = (db) => {
  // TODO: Setup portfolio CRUD operations
  const getAll = () => {
    return db.portfolio.findAll();
  };

  const create = (request) => {
    const portfolioName = { name: request.name };

    return db.portfolio.create(portfolioName);
  };

  const update = (request) => {
    const updatedPortfolioName = { name: request.name };
    const portfolioId = request.id;

    return db.portfolio.update(updatedPortfolioName, {
      where: { id: portfolioId },
    });
  };

  const remove = (request) => {
    const portfolioId = request.id;

    return db.portfolio.destroy({
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
