/* globals window */
import axios from 'axios';

let API_ROOT;
if (process.env.NODE_ENV === 'development') {
  API_ROOT = 'http://localhost:3200';
} else {
  API_ROOT = 'https://cryptobeast.motion-software.com/api';
}
const idToken = window.localStorage.getItem('id_token'); // eslint-disable-line
const options = { headers: { 
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept'
                  } 
                };

const requests = {
  get: url => axios.get(`${API_ROOT}${url}`, options),
  post: (url, body) => axios.post(`${API_ROOT}${url}`, body, options),
  put: (url, body) => axios.put(`${API_ROOT}${url}`, body, options),
  patch: (url, body) => axios.patch(`${API_ROOT}${url}`, body, options),
  delete: url => axios.delete(`${API_ROOT}${url}`, options), // axios.delete doesn't support body in requests !!!
};

const Asset = {
  add: data => requests.post('/asset/add', data),
  update: requestParams => requests.put('/asset/update', requestParams),
  delete: id => requests.delete(`/asset/delete/${id}`, id),
  allocate: data => requests.post('/asset/allocate', data),
  getAssetsValueHistory: id => requests.get(`/asset/assets-history/${id}`),
  getAssetHistory: (tokenId, period) => requests.get(`/asset/history/${tokenId}/${period}`),
  sync: data => requests.get('/asset/sync/'),
};

const User = {
  updateClosingTime: data => requests.post('/user/updateClosingTime', data),
  verifiedPatchUserMetadata: (id, data) => requests.patch(`/user/verifiedPatch/${id}`, data),
  patchUserMetadata: (id, data) => requests.patch(`/user/patch/${id}`, data),
  deleteUserMetadata: (id, data) => requests.patch(`/user/delete/${id}`, data),
  syncUserApiData: id => requests.put(`/user/syncApiData/${id}`),
  sync: data => requests.get(`/weidex/sync/${data.id}`),
};

const Transaction = {
  updateTrade: requestParams => requests.put('/account/updateTrade', requestParams),
  getAllTrades: () => requests.get('/account/allTrades'),
  getAllTransactions: portfolioId => requests.get(`/transaction/all/${portfolioId}`),
  setInvestor: (transactionId, investorId) => requests.put(`/transaction/setInvestor/${transactionId}/${investorId}`),
  sync: data => requests.get(`/weidex/sync/${data.id}`),
};

const Portfolio = {
  getAll: () => requests.get('/portfolio/getAllPortfolios'),
  getPortfoliosByUserAddresses: addresses => requests.post('/portfolio/getPortfoliosByAddresses', addresses),
  getPortfolioAssetsByPortfolioId: id => requests.get(`/portfolio/getPortfolioAssetsByPortfolioId/${id}`),
  getPortfolioTradesByPortfolioId: id => requests.get(`/trade/all/${id}`),
  getPortfolioValueHistory: id => requests.get(`/portfolio/history/${id}`),
  getPortfolioValueHistoryByPeriod: (id, period) => requests.get(`/portfolio/historyByPeriod/${id}/${period}`),
  getShareHistory: id => requests.get(`/portfolio/shareHistory/${id}`),
  setName: (requestParams, id) => requests.put(`/portfolio/setName/${id}`, requestParams), // id + newName
  getPortfoliosStats: addresses => requests.post('/portfolio/all/stats', addresses),
};

const Investor = {
  add: investorData => requests.post('/investor/add', investorData),
  getAllInvestors: portfolioId => requests.get(`/investor/all/${portfolioId}`),
  update: (id, requestParams) => requests.put(`/investor/update/${id}`, requestParams),
  sync: data => requests.get(`/weidex/sync/${data.id}`),
};

const Market = {
  getTickersFromCoinMarketCap: () => requests.get('/market/tickersFromCoinMarketCap'),
  getEthToUsd: () => requests.get('/market/getEthToUsd'),
  getEthHistory: portfolioId => requests.get(`/market/ethHistory/${portfolioId}`),
};

const Currency = {
  getAllCurrencies: () => requests.get('/currency/all'),
};

const Allocations = {
  getAllocations: id => requests.get(`/allocations/fetchInfo/${id}`),
};

const Weidex = {
  sync: requestParams => requests.post('/weidex/sync', requestParams),
  validateAddresses: requestParams => requests.post('/weidex/validateAddresses', requestParams),
};

export default {
  Asset,
  Currency,
  User,
  Transaction,
  Portfolio,
  Investor,
  Market,
  Weidex,
  Allocations,
};
