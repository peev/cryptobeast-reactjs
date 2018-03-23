const init = (db) => {
  const syncTickers = (request) => {
    db.Ticker.destroy({ where: {} }).then(() => { }); // Clear old records first

    return db.Ticker.bulkCreate(request)
      .then(() => db.Ticker.findAll());
  };

  return {
    syncTickers,
  };
};

module.exports = { init };
