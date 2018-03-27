const init = (db) => {
  const syncCurrencies = (request) => {
    db.Currency.destroy({ where: {} }).then(() => { }); // Clear old records first (kraken)
    return db.Currency.bulkCreate(request)
      .then(() => db.Currency.findAll());
  };

  const getAll = () => {
    return db.Currency.findAll();
  };

  return {
    syncCurrencies,
    getAll,
  };
};

module.exports = { init };
