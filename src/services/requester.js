import axios from 'axios';

const API_ROOT = 'http://localhost:3200';

const responseBody = res => res.body;

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
const Portfolios = {
  getAll: () =>
    requests.get('/portfolio/all'),
  create: portfolioName =>
    requests.post('/portfolio/create', portfolioName),
  update: (requestParams) =>
    requests.put('/portfolio/update', requestParams), // id + newName
  delete: id =>
    requests.delete('/portfolio/delete', id)
  // unfollow: username =>
  //   requests.del(`/portfolio/${username}/follow`)
};

export default {
  Portfolios,
};
