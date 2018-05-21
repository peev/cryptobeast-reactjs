const bittrex = require('node-bittrex-api');

// const bittrexServices = (key, secret) => {
const bittrexServices = () => {
  const setOptions = (key, secret) => {
    bittrex.options({
      apikey: key,
      apisecret: secret,
    });
  };

  // const setOptions = () => {
  //   bittrex.options({
  //     apikey: key,
  //     apisecret: secret,
  //   });
  // };

  const getSummaries = () => {
    return new Promise((resolve, reject) => {
      bittrex.getmarketsummaries((data, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.result);
        }
      });
    });
  };

  const getTicker = (marketName) => {
    return new Promise((resolve, reject) => {
      bittrex.getticker({ market: marketName }, (ticker) => {
        resolve({ pair: marketName, last: (ticker ? ticker.result.Last : null) });
      });
    });
  };

  const getAllTickers = () => {
    return new Promise((resolve, reject) => {
      getSummaries()
        .then((data) => {
          return Promise.all(data.map(d => getTicker(d.MarketName)));
        })
        .then((tickers) => {
          resolve(tickers);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const getCurrencies = () => {
    return new Promise((resolve, reject) => {
      bittrex.getcurrencies((data, err) => {
        if (err) {
          reject(err);
        }
        resolve(data.result.map((c) => {
          return {
            currency: c.Currency,
            currencyLong: c.CurrencyLong,
            minConfirmation: c.MinConfirmation,
            txFee: c.TxFee,
            isActive: c.IsActive,
            coinType: c.CoinType,
            baseAddress: c.BaseAddress,
            timestamps: c.Timestamps,
          };
        }));
      });
    });
  };

  const getBalance = (account) => {
    setOptions(account.apiKey, account.apiSecret);
    return new Promise((resolve, reject) => {
      bittrex.getbalances((data, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.result.map((c) => {
            return {
              currency: c.Currency,
              balance: c.Balance,
              available: c.Available,
              pending: c.Pending,
              cryptoAddress: c.CryptoAddress,
              origin: 'Bittrex',
            };
          }));
        }
      });
    });
  };

  // const getBalance = () => {
  //   setOptions();
  //   return new Promise((resolve, reject) => {
  //     bittrex.getbalances((data, err) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(data.result.map((c) => {
  //         return {
  //           currency: c.Currency,
  //           balance: c.Balance,
  //           available: c.Available,
  //           pending: c.Pending,
  //           cryptoAddress: c.CryptoAddress,
  //           origin: 'Bittrex',
  //         };
  //       }));
  //     });
  //   });
  // };

  return {
    getSummaries,
    getTicker,
    getAllTickers,
    getCurrencies,
    getBalance,
  };
};

module.exports = { bittrexServices };


// Test
// bittrexServices('c7c9827ac4194744b46b96ef1c758b13', 'aacf6e4658ed4995bc216d66922a5e3e')
//   .getBalance()
//   .then(b => console.log(b));
