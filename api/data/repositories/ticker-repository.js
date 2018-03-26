const init = (db) => {
  const saveTicker = (request) => {
    return db.Ticker.create(request);
  };

  const saveManyTickers = (request) => {
    return db.Ticker.bulkCreate(request)
      .then(() => db.Ticker.findAll());
  };

  const syncTickers = (request) => {
    db.Ticker.destroy({ where: {} }).then(() => { }); // Clear old records first (kraken)

    return db.Ticker.bulkCreate(request)
      .then(() => db.Ticker.findAll());
  };

  const getAll = () => {
    return db.Ticker.findAll();
  };

  const deleteAll = () => {
    return db.Ticker.destroy({ where: {} }).then(() => { });
  };

  return {
    saveTicker,
    syncTickers,
    saveManyTickers,
    getAll,
    deleteAll,
  };
};

module.exports = { init };
