const fetch = require('node-fetch');
const request = require('requestretry');
const requester = require('../services/requester-service');
const http = require('../services/http');

const url = 'https://core.weidex.market';
const staging = 'http://staging-core-java.herokuapp.com';
const dataFeeder = 'https://production-datafeeder.herokuapp.com';

const WeidexService = (repository) => {
  const getUser = async (address) => {
    return fetch(staging + `/user/${address}`, {
      method: 'GET',
    })
  };

  const getAllTokens = async () => {
    return fetch(staging + `/token/all`, {
      method: 'GET',
    })
  };

  const getBalanceByUser = async (address) => {
    return fetch(staging + `/balance/user/${address}`, {
      method: 'GET',
    })
  };

  const getUserDeposit = async (id) => {
    return fetch(staging + `/deposit/user/${id}`, {
      method: 'GET',
    })
  };

  const getUserWithdraw = async (id) => {
    return fetch(staging + `/withdraw/user/${id}`, {
      method: 'GET',
    })
  };

  const getUserOpenOrders = async (userId, tokenId) => {
    return fetch(staging + `/order/user/${userId}/token/${tokenId}`, {
      method: 'GET',
    })
  };

  const getUserOpenOrdersByOrderType = async (tokenId, type) => {
    return fetch(staging + `/order/open/token/${tokenId}/type/${type}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByToken = async (userId, tokenId) => {
    return fetch(staging + `/orderHistory/user/${userId}/token/${tokenId}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByUser = async (userId) => {
    return fetch(staging + `/orderHistory/user/${userId}`, {
      method: 'GET',
    })
  };

  const getUserOrderHistoryByUserAndToken = async (tokenId) => {
    return fetch(staging + `/orderHistory/token/${tokenId}`, {
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
    requester.get(`${dataFeeder}/get/${currencyId}/${from}/${to}/1d`)
      .then((response) => {
        const parsedResult = JSON.parse(response.replace(/\\n/g, '').replace(/ /g, ''));
        return resolve(parsedResult);
      })
      .catch(err => reject(err)); // eslint-disable-line
  });

  const getTokenPriceByTimestamp = async (tokenId, timestamp) => fetch(
    `${staging}/token/${tokenId}/price/${timestamp}`,
    { method: 'GET' },
  );

  const getUserDepositHttp = id => new Promise((resolve, reject) => {
    http.get(`${staging}/deposit/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      }); // eslint-disable-line
  });

  const getUserWithdrawHttp = id => new Promise((resolve, reject) => {
    http.get(`${staging}/withdraw/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      }); // eslint-disable-line
  });

  const getUserOrderHistoryByUserHttp = userId => new Promise((resolve, reject) => {
    http.get(`${staging}/orderHistory/user/${userId}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      }); // eslint-disable-line
  });

  return {
    getUser,
    getBalanceByUser,
    getUserDeposit,
    getUserDepositHttp,
    getUserWithdrawHttp,
    getUserOrderHistoryByUserHttp,
    getUserWithdraw,
    getUserOpenOrders,
    getUserOpenOrdersByOrderType,
    getUserOrderHistoryByToken,
    getUserOrderHistoryByUser,
    getUserOrderHistoryByUserAndToken,
    getTokenTicker,
    getCurrencyStats,
    getAllTokens,
    getTokenPriceByTimestamp,
  };
};

module.exports = WeidexService;
