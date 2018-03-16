const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const init = (data) => {
  const app = express();

  app.use(cors());

  // Logger
  app.use(morgan('dev', {
    skip: (req, res) => {
      return res.statusCode < 400;
    },
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // TODO: Here you can add new middleware
  // require('./passport').applyTo(app, data);

  // TODO: Create router for every new model and add it here
  require('../routes/portfolio/portfolio-router').attachTo(app, data);
  require('../routes/market/market-router').attachTo(app, data);
  require('../routes/account/account-router').attachTo(app, data);
  require('../routes/investor/investor-router').attachTo(app, data);

  return app;
};

module.exports = { init };
