const init = (db) => {
  const updateSummary = (request) => {
    db.MarketSummary.destroy({ where: {} }).then(() => { });
    return db.MarketSummary.bulkCreate(request);
  };

  const getAll = () => {
    return db.MarketSummary.findAll();
  };

  const getBase = () => {
    return db.Ticker.findAll({
      where: { pair: ['USD', 'EUR', 'JPY', 'ETH'] },
    });
  };

  // Bittrex variant
  // const getBase = () => {
  //   return db.MarketSummary.findAll({
  //     where: { MarketName: ['USDT-ETH', 'USDT-BTC'] },
  //   });
  // };
  return {
    updateSummary,
    getAll,
    getBase,
  };
};

module.exports = { init };
