const bittrex = require('node-bittrex-api');


const bittrexServices = () => {
  const setOptions = (key, secret) => {
    bittrex.options({
      apikey: key,
      apisecret: secret,
    });
  };

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

  const getOderHistory = (account, portfolioId) => {
    setOptions(account.apiKey, account.apiSecret);
    return new Promise((resolve, reject) => {
      bittrex.getorderhistory(null, (data, err) => {
        if (err) {
          reject(err);
        } else {
          console.log('getOderHistory --->', data, data.result);
          if (data.result.length === 0) {
            resolve([]);
          }

          resolve(data.result.map((order) => {
            const orderTypeUnderscore = order.Exchange.indexOf('_');
            return {
              source: 'Bittrex',
              pair: order.Exchange,
              time: order.TimeStamp,
              type: order.OrderType.slice(orderTypeUnderscore),
              orderType: order.OrderType.slice(0, orderTypeUnderscore),
              price: order.Price,
              fee: order.Commission,
              volume: order.Quantity,
              portfolioId,
            };
          }));
        }
      });
    });
  };

  return {
    getSummaries,
    getTicker,
    getAllTickers,
    getCurrencies,
    getBalance,
    getOderHistory,
  };
};

module.exports = { bittrexServices };


// Test
// bittrexServices('c7c9827ac4194744b46b96ef1c758b13', 'aacf6e4658ed4995bc216d66922a5e3e')
//   .getOderHistory()
//   .then(b => console.log('--->', b));
