const KrakenClient = require('kraken-api');

const krakenServices = (key, secret) => {
  const kraken = new KrakenClient(key, secret);

  const getCurrencies = () => {
    return kraken.api('Assets')
      .then(response => response.result);
  };

  const getTickers = (request) => {
    return kraken.api('Ticker', { pair: request }) // request = 'XXBTZUSD,DASHEUR' - comma separated
      .then(response => response.result);
  };

  const getAllTickers = () => {
    return kraken.api('AssetPairs')
      .then((allPairs) => {
        const pairs = Object.keys(allPairs.result).filter(p => !p.endsWith('.d')).join(',');

        return kraken.api('Ticker', { pair: pairs })
          .then(response => response.result)
          .then((tickers) => {
            const mappedTickers = [];
            Object.keys(tickers).forEach((key2) => {
              mappedTickers.push({ pair: key2, last: tickers[key2].c[0] });
            });
            // console.log(mappedTickers);

            return mappedTickers;
          });
      });
  };


  return {
    getCurrencies,
    getTickers,
    getAllTickers,
  };
};

module.exports = { krakenServices };

// Testing
// const testCurrencies = krakenServices().getCurrencies();
// testCurrencies.then(result => console.log(result));

// const testTickers = krakenServices().getTickers('XXBTZUSD,DASHEUR');
// testTickers.then(result => console.log(result));

// const getAllTickersTest = krakenServices().getAllTickers();
// getAllTickersTest.then(result => console.log(result));

// (async () => {
//   // Display user's balance
//   console.log(await kraken.api('Balance'));

//   // Get Ticker Info
//   console.log(await kraken.api('Ticker', { pair: 'XXBTZUSD' }));
// })();

const kraken = new KrakenClient('ejPP9CfIr3dYWlbUoJNMGdnwtKfkLTllb96TwezXrJYx2NzZZjqPtjJX', '0bmPxUH5ISdssYjcu1NVslWUpuz21gv5jH9MlEhP3TkKYJ9d6Ji0n18Bj2jv7op07WlCepFyA/vc6q5ZB92Hnw==');
// console.log(await kraken.api('Balance'));
kraken.api('Balance').then(b => console.log(b));
