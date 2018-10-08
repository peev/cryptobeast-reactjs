const fetch = require('node-fetch');
const url = ''

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

  return {
    getUser,
    getBalanceByUser,
    getUserDeposit,
    getUserWithdraw,
    getUserOpenOrders,
    getUserOpenOrdersByOrderType,
    getUserOrderHistoryByToken,
    getUserOrderHistoryByUser,
    getUserOrderHistoryByUserAndToken
  };
};

module.exports = WeidexService;