import axios from 'axios';

const API_ROOT = 'http://localhost:3200';

// const responseBody = res => res.body;

const requests = {
  get: url =>
    axios
      .get(`${API_ROOT}${url}`),
  // .then(responseBody),
  post: (url, body) =>
    axios
      .post(`${API_ROOT}${url}`, body),
  put: (url, body) =>
    axios
      .put(`${API_ROOT}${url}`, body),
  delete: (url, body) =>
    axios
      .delete(`${API_ROOT}${url}`, body),
};

// TODO: Add model http requests and create model store (mobx)
const Portfolio = {
  getAll: () =>
    requests.get('/portfolio/all'),
  create: portfolioName =>
    requests.post('/portfolio/create', portfolioName),
  update: requestParams =>
    requests.put('/portfolio/update', requestParams), // id + newName
  delete: id =>
    requests.delete('/portfolio/delete', id),
};

const Investor = {
  add: investorData =>
    requests.post('/investor/add', investorData),
  addDeposit: (id, requestParams) =>
    requests.put(`/investor/deposit/${id}`, requestParams),
  withdrawal: (id, requestParams) =>
    requests.put(`/investor/withdrawal/${id}`, requestParams),
  update: (id, requestParams) =>
    requests.put(`/investor/update/${id}`, requestParams),
};

const Market = {
  getSummaries: () =>
    requests.get('/market/syncSummaries'),
  getBaseCurrencies: () =>
    requests.get('/market/baseCurrencies'),
  getBaseTickers: searchedCurrencies =>
    requests.post('/market/syncBaseTickers', searchedCurrencies),
};

const ApiAccount = {
  addAccount: data =>
    requests.post('/account/add', data),
  update: requestParams =>
    requests.put('/account/update', requestParams),
  delete: id =>
    requests.delete(`/account/delete${id}`, id),
};

export default {
  Portfolio,
  Investor,
  Market,
  ApiAccount,
};
