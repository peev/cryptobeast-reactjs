const bittrex = require('node-bittrex-api');

const bittrexServices = (key, secret) => {
  // bittrex.options({
  //   'apikey': API_KEY,
  //   'apisecret': API_SECRET,
  // });

  const getSummaries = () => {
    return new Promise((resolve, reject) => {
      bittrex.getmarketsummaries((data, err) => {
        if (err) {
          reject(err);
        }
        resolve(data.result);
      });
    });
  };

  const getTicker = (marketName) => {
    return new Promise((resolve, reject) => {
      bittrex.getticker({ market: marketName }, (ticker) => {
        resolve({ pair: marketName, last: (ticker.result ? ticker.result.Last : null) });
      });
    });
  };

  const getAllTickers = (repository) => {
    return new Promise((resolve, reject) => {
      getSummaries()
        .then((data) => {
          return Promise.all(data.map(d => getTicker(d.MarketName)));
        })
        .then((tickers) => {
          resolve(tickers);
        });
    });
  };


  // const getAllTickers = (repository) => {
  //   bittrex.getmarketsummaries((data, err) => {
  //     // Clear old records first - faster than update
  //     repository.ticker.deleteAll().then(() => {
  //       data.result.forEach((summary) => {
  //         bittrex.getticker({ market: summary.MarketName }, (ticker) => {
  //           const tickerResult = { pair: summary.MarketName, last: (ticker.result ? ticker.result.Last : null) };
  //           // fill db from here
  //           repository.ticker.saveTicker(tickerResult);
  //         });
  //       });
  //     });
  //   });
  // };


  return {
    getAllTickers,
  };
};

module.exports = { bittrexServices };
