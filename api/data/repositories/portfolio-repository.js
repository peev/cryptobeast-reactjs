const init = (db) => {
  // TODO: Setup portfolio CRUD operations
  // const getAll = () => {
  //   return db.portfolio.findAll();
  // };

  // With Eager loading of assets, accounts and investors
  const getAll = () => {
    return db.Portfolio.findAll();
  };

  const create = (request) => {
    const portfolioName = { name: request.name };

    return db.Portfolio.create(portfolioName);
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

  // account CRUD operations =============================================================
  const addAccount = (request) => {
    const newAccount = {
      apiServiceName: request.apiServiceName,
      apiKey: request.apiKey,
      apiSecret: request.apiSecret,
    };
    const portfolioId = request.id;
    return db.Portfolio.findById(portfolioId)
      .then((selectedPortfolio) => {
        db.Account.create(newAccount)
          .then((result) => {
            selectedPortfolio.addAccount(result)
              .then((result2) => {
                // return Promise.resolve(result2.id);
              });
          })
      });
  };

  return {
    getAll,
    create,
    update,
    remove,
    addAccount,
  };
};

module.exports = { init };
