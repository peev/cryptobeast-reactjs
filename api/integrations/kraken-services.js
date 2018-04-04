// const KrakenClient = require('kraken-api');

// const krakenServices = (key, secret) => {
//   const kraken = new KrakenClient(key, secret);

//   const getCurrencies = () => {
//     return kraken.api('Assets')
//       .then(response => response.result);
//   };

//   const getTickers = (request) => {
//     return kraken.api('Ticker', { pair: request }) // request = 'XXBTZUSD,DASHEUR' - comma separated
//       .then(response => response.result);
//   };

//   const getAllTickers = () => {
//     return kraken.api('AssetPairs')
//       .then((allPairs) => {
//         const pairs = Object.keys(allPairs.result).filter(p => !p.endsWith('.d')).join(',');

//         return kraken.api('Ticker', { pair: pairs })
//           .then(response => response.result)
//           .then((tickers) => {
//             const mappedTickers = [];
//             Object.keys(tickers).forEach((key2) => {
//               mappedTickers.push({ pair: key2, last: tickers[key2].c[0] });
//             });

//             return mappedTickers;
//           });
//       });
//   };

//   const getBalance = (account) => {
//     kraken.config.key = account.apiKey;
//     kraken.config.secret = account.apiSecret;
//     return new Promise((resolve, reject) => {
//       kraken.api('Balance', null, (err, data) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(Object.keys(data.result).map((k) => {
//           let convertedCurrency = k;
//           if (k.length === 4 && (k[0] === 'X' || k[0] === 'Z')) {
//             convertedCurrency = k.substring(1);
//             if (convertedCurrency === 'XBT') {
//               convertedCurrency = 'BTC';
//             }
//           }
//           return {
//             currency: convertedCurrency,
//             balance: data.result[k],
//             origin: 'Kraken',
//           };
//         }));
//       });
//     });
//   };

//   return {
//     getCurrencies,
//     getTickers,
//     getAllTickers,
//     getBalance,
//   };
// };

// module.exports = { krakenServices };

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
