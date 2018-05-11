const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');


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
  app.use(cookieParser());


  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // TODO: Here you can add new middleware
  // require('./passport').applyTo(app, data);

  // TODO: Create router for every new model and add it here
  require('./../../routes/portfolio/portfolio-router').attachTo(app, data);
  require('./../../routes/asset/asset-router').attachTo(app, data);
  require('./../../routes/market/market-router').attachTo(app, data);
  require('./../../routes/account/account-router').attachTo(app, data);
  require('./../../routes/investor/investor-router').attachTo(app, data);
  require('./../../routes/user/user-router').attachTo(app, data);


  /// Handle Errors
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};

module.exports = { init };
