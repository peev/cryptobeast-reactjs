const init = (db) => {
  // TODO: Setup market CRUD operations

  const getBase = () => {
    // Dummy base currencies
    const dummyBaseCurrencies = [
      {
        MarketName: 'USDT-ETH',
        High: 621.94377347,
        Low: 585,
        Volume: 5061.67328974,
        Last: 600.1,
        BaseVolume: 3060983.78033753,
        TimeStamp: '2018-03-16T10:12:49.06',
        Bid: 599.00000001,
        Ask: 600.1,
        OpenBuyOrders: 736,
        OpenSellOrders: 1904,
        PrevDay: 616.68069999,
        Created: '2017-04-20T17:26:37.647',
      }, {
        MarketName: 'USDT-BTC',
        High: 8410.59499999,
        Low: 7913,
        Volume: 4655.64725942,
        Last: 8141.00000004,
        BaseVolume: 38054434.57483403,
        TimeStamp: '2018-03-16T10:12:48.5',
        Bid: 8141,
        Ask: 8180.99996356,
        OpenBuyOrders: 5673,
        OpenSellOrders: 5079,
        PrevDay: 8220,
        Created: '2015-12-11T06:31:40.633',
      },
    ];

    // return db.Portfolio.findAll({ include: [db.Account] });
    return Promise.resolve(dummyBaseCurrencies);
  };


  return {
    getBase,
  };
};

module.exports = { init };
