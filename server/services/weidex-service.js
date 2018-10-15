const fetch = require('node-fetch');
const request = require('requestretry');

const url = 'https://core.weidex.market/';
const staging = 'http://staging-core-java.herokuapp.com';
const dataFeeder = 'https://production-datafeeder.herokuapp.com';

const WeidexService = (repository) => {
  const getUser = async (address) => {
    return fetch(url + `/user/${address}`, {
      method: 'GET',
    })
  };

  const getAllTokens = async () => {
    return fetch(url + `/token/all`, {
      method: 'GET',
    })
  };

  const getBalanceByUser = async (address) => {
    return fetch(url + `/balance/user/${address}`, {
      method: 'GET',
    })
  };

  const getUserDeposit = async (id) => {
    return fetch(url + `/deposit/user/${id}`, {
      method: 'GET',
    })
  };

  const getUserWithdraw = async (id) => {
    return fetch(url + `withdraw/user/${id}`, {
      method: 'GET',
    })
  };

  const getUserOpenOrders = async (userId, tokenId) => {
    return fetch(url + `/order/user/${userId}/token/${tokenId}`, {
      method: 'GET',
    })
  };

  const getUserOpenOrdersByOrderType = async (tokenId, type) => {
    return fetch(url + `/order/open/token/${tokenId}/type/${type}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByToken = async (userId, tokenId) => {
    return fetch(url + `/orderHistory/user/${userId}/token/${tokenId}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByUser = async (userId) => {
    return fetch(url + `/orderHistory/user/${userId}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByUserAndToken = async (tokenId) => {
    return fetch(url + `/orderHistory/token/${tokenId}`, {
      method: 'GET',
    })
  };

  const getTokenTicker = tokenId => new Promise((resolve, reject) => {
    request({
      url: `${staging}/token/ticker/${tokenId}`,
      json: true,
      maxAttempts: 3,
      retryDelay: 3100,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    }, (err, response, body) => {
      if (err) return reject(err);
      if (body) {
        if (body.error) return reject(body.error); // Probably invalid API call
        return resolve(body);
      }
      return resolve([]); // eslint rule of consistent returns. Function must return value in every case;
    });
  });

  const getCurrencyStats = (currencyId, from, to) => new Promise((resolve, reject) => {
    request({
      url: `${dataFeeder}/get/${currencyId}/${from}/${to}/1d`,
      json: true,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    }, (err, response, body) => {
      if (err) return reject(err);
      if (body) {
        return resolve(body);
      }
      return resolve([]); // eslint rule of consistent returns. Function must return value in every case;
    });
  });

  return {
    getUser,
    getBalanceByUser,
    getUserDeposit,
    getUserWithdraw,
    getUserOpenOrders,
    getUserOpenOrdersByOrderType,
    getUserOrderHistoryByToken,
    getUserOrderHistoryByUser,
    getUserOrderHistoryByUserAndToken,
    getTokenTicker,
    getCurrencyStats,
  };
};

module.exports = WeidexService;
