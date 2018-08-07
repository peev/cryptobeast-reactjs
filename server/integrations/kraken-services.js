const KrakenClient = require('kraken-api');
const request = require('requestretry');


const krakenServices = (key, secret) => {
  const kraken = new KrakenClient(key, secret);
  const URL = 'https://api.kraken.com/0/public';

  const getCurrencies = () => kraken.api('Assets')
    .then(response => response.result)
    .catch(err => console.log(err)); // eslint-disable-line

  const getTickers = currencyPairs => new Promise((resolve, reject) => {
    request({
      url: `${URL}/Ticker?pair=${currencyPairs}`,
      json: true,
      maxAttempts: 3,
      retryDelay: 3100,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    }, (err, response, body) => {
      if (err) return reject(err);
      if (body) {
        if (body.error.length > 0) return reject(body.error); // Probably invalid API call
        return resolve(body.result);
      }
      return resolve([]); // eslint rule of consistent returns. Function must return value in every case;
    });
  });

  const getAllTickers = () => new Promise((resolve, reject) => {
    request({
      url: `${URL}/AssetPairs`,
      json: true,
      maxAttempts: 3,
      retryDelay: 3100,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    }, (err, response, body) => {
      if (err) return reject(err);
      if (body) {
        if (body.error.length > 0) return reject(body.error); // Probably invalid API call
        const pairs = Object.keys(body.result).filter(p => !p.endsWith('.d')).join(',');
        return request({
          url: `${URL}/Ticker?pair=${pairs}`,
          json: true,
          maxAttempts: 3,
          retryDelay: 3100,
          retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
        }, (error, res, data) => {
          if (error) return reject(error);
          if (data) {
            if (data.error.length > 0) return reject(data.error); // Probably invalid API call
            const tickers = data.result;
            const mappedTickers = [];
            Object.keys(tickers).forEach((key2) => {
              mappedTickers.push({ pair: key2, last: tickers[key2].c[0] });
            });
            return resolve(mappedTickers);
          }
          return resolve([]);
        });
      }
      return resolve([]);
    });
  });

  const getBalance = (account) => {
    kraken.config.key = account.apiKey;
    kraken.config.secret = account.apiSecret;
    return new Promise((resolve, reject) => {
      kraken.api('Balance', null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(Object.keys(data.result).map((k) => {
            let convertedCurrency = k;
            if (k.length === 4 && (k[0] === 'X' || k[0] === 'Z')) {
              convertedCurrency = k.substring(1);
              if (convertedCurrency === 'XBT') {
                convertedCurrency = 'BTC';
              }
            }
            return {
              currency: convertedCurrency,
              balance: data.result[k],
              origin: 'Kraken',
            };
          }));
        }
      });
    });
  };

  const getOderHistory = (account, portfolioId) => {
    kraken.config.key = account.apiKey;
    kraken.config.secret = account.apiSecret;
    return new Promise((resolve, reject) => {
      kraken.api('TradesHistory', null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const ordersHistory = data.result;

          if (ordersHistory.count === 0) {
            resolve([]);
          }

          resolve(Object.keys(ordersHistory.trades).map((property, i) => ({
            source: 'Kraken',
            sourceId: Object.keys(ordersHistory.trades)[i],
            pair: ordersHistory.trades[property].pair,
            time: new Date(ordersHistory.trades[property].time * 1000).toISOString(), // converted from unix time stamp
            dateOfEntry: Date.now(),
            type: ordersHistory.trades[property].type.toUpperCase(),
            orderType: ordersHistory.trades[property].ordertype.toUpperCase(),
            price: ordersHistory.trades[property].cost,
            fee: ordersHistory.trades[property].fee,
            volume: ordersHistory.trades[property].vol,
            portfolioId,
          })));
        }
      });
    });
  };

  return {
    getCurrencies,
    getTickers,
    getAllTickers,
    getBalance,
    getOderHistory,
  };
};

module.exports = { krakenServices };

// Tests
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

// const testAccount = {
//   apiServiceName: 'Kraken',
//   apiKey: 'ejPP9CfIr3dYWlbUoJNMGdnwtKfkLTllb96TwezXrJYx2NzZZjqPtjJX',
//   apiSecret: '0bmPxUH5ISdssYjcu1NVslWUpuz21gv5jH9MlEhP3TkKYJ9d6Ji0n18Bj2jv7op07WlCepFyA/vc6q5ZB92Hnw==',
// };

// const getBalanceTest = krakenServices().getBalance(testAccount);
// getBalanceTest.then(result => console.log('>>> result from getBalanceTest:', result));
