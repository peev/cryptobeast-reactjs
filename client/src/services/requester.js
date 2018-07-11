/* globals window */
import axios from 'axios';

let API_ROOT;
if (process.env.NODE_ENV === 'development') {
  API_ROOT = 'http://localhost:3200';
} else {
  API_ROOT = 'https://cryptobeast.motiontest.eu/api';
}
const idToken = window.localStorage.getItem('id_token'); // eslint-disable-line
const options = { headers: { Authorization: `Bearer ${idToken}` } };

const requests = {
  get: url => axios.get(`${API_ROOT}${url}`, options),
  post: (url, body) => axios.post(`${API_ROOT}${url}`, body, options),
  put: (url, body) => axios.put(`${API_ROOT}${url}`, body, options),
  patch: (url, body) => axios.patch(`${API_ROOT}${url}`, body, options),
  delete: url => axios.delete(`${API_ROOT}${url}`, options), // axios.delete doesn't support body in requests !!!
};

// TODO: Add model http requests and create model store (mobx)
const Portfolio = {
  getAll: () => requests.get('/portfolio/all'),
  create: portfolioName => requests.post('/portfolio/create', portfolioName),
  searchItemsInCurrentPortfolio: requestParams => requests.get(`/portfolio/${requestParams.portfolioId}/${requestParams.item}`),
  getSharePrice: id => requests.post('/portfolio/getPortfolioSharePrice', id),
  getSharePriceHistory: requestParams => requests.post('/portfolio/sharePriceHistory', requestParams),
  getPriceHistory: requestParams => requests.post('/portfolio/priceHistory', requestParams),
  getPriceHistoryForPeriod: requestParams => requests.post('/portfolio/periodPriceHistory', requestParams),
  update: (requestParams, id) => requests.put(`/portfolio/update/${id}`, requestParams), // id + newName
  delete: id => requests.delete(`/portfolio/delete/${id}`),
};

const Investor = {
  add: investorData => requests.post('/investor/add', investorData),
  addDeposit: requestParams => requests.put('/investor/deposit', requestParams),
  withdrawal: requestParams => requests.put('/investor/withdrawal', requestParams),
  update: (id, requestParams) => requests.put(`/investor/update/${id}`, requestParams),
};

const Market = {
  getSummaries: () => requests.get('/market/summaries'),
  getSyncedSummaries: () => requests.get('/market/syncSummaries'),
  getBaseCurrencies: () => requests.get('/market/baseCurrencies'),
  getAllTickers: () => requests.get('/market/allTickers'),
  syncCurrencies: () => requests.get('/market/syncCurrencies'),
  getAllCurrencies: () => requests.get('/market/allCurrencies'),
  getBaseTickers: searchedCurrencies => requests.post('/market/syncBaseTickers', searchedCurrencies),
  syncMarketPriceHistory: convertCurrency => requests.post('/market/syncMarketPriceHistory', convertCurrency),
  getMarketPriceHistory: () => requests.get('/market/getMarketPriceHistory'),
  getBaseTickerHistory: requestParams => requests.post('/market/periodPriceHistory', requestParams),
};

// not used
const ApiAccount = {
  addAccount: data => requests.post('/account/add', data),
  update: requestParams => requests.put('/account/update', requestParams),
  delete: id => requests.delete(`/account/delete/${id}`, id),
  getBalance: data => requests.post('/account/getBalance', data),
};

const Trade = {
  addTrade: data => requests.post('/account/createTrade', data),
  updateTrade: requestParams => requests.put('/account/updateTrade', requestParams),
  deleteTrade: id => requests.delete(`/account/deleteTrade/${id}`, id),
  getAllTrades: () => requests.get('/account/allTrades'),
};

const Asset = {
  add: data => requests.post('/asset/add', data),
  update: requestParams => requests.put('/asset/update', requestParams),
  delete: id => requests.delete(`/asset/delete/${id}`, id),
  allocate: data => requests.post('/asset/allocate', data),
  // Trades
  // addTrade: data => requests.post('/asset/createTrade', data),
  updateTrade: requestParams => requests.put('/asset/updateTrade', requestParams),
  deleteTrade: id => requests.delete(`/asset/delete${id}`, id),
  getAllTrades: () => requests.get('/asset/allTrades'),
};

const User = {
  updateClosingTime: data => requests.post('/user/updateClosingTime', data),
  verifiedPatchUserMetadata: (id, data) => requests.patch(`/user/verifiedPatch/${id}`, data),
  patchUserMetadata: (id, data) => requests.patch(`/user/patch/${id}`, data),
  deleteUserMetadata: (id, data) => requests.patch(`/user/delete/${id}`, data),
};

export default {
  Portfolio,
  Investor,
  Market,
  ApiAccount,
  Asset,
  User,
  Trade,
};
