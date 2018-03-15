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
  delete: url =>
    axios
      .delete(`${API_ROOT}${url}`),
};

const Portfolios = {
  getAll: () =>
    requests.get('/portfolio/all'),
  create: portfolioName =>
    requests.post('/portfolio/create', portfolioName),
  // unfollow: username =>
  //   requests.del(`/portfolio/${username}/follow`)
};

export default {
  Portfolios,
};
