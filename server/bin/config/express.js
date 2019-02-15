const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const init = async (repository) => {
  const marketService = require('../../services/market-service')(repository);

  const app = express();

  app.use(cors());

  // Logger
  app.use(morgan('dev', {
    skip: (req, res) => res.statusCode < 400,
  }));

  // static folder for testing
  // app.use('/static', express.static(path.join(__dirname, '..', '..', '..', 'client/build')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Market jobs
  marketService.createNodeCron(marketService.syncTickersFromCoinMarketCap, '0,10,20,30,40,50 * * * *'); // sync every 10 minutes

  // Initialize all portfolio jobs and pass them to portfolio-controller
  const jobs = {
    // closingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingSharePriceJob),
    // openingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveOpeningSharePriceJob),
    // closingPortfolioCostJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingPortfolioCostJob),
  };
  // #endregion

  // TODO: Create router for every new model and add it here
  require('./../../routes/investor/investor-router').attachTo(app, repository);
  require('./../../routes/asset/asset-router').attachTo(app, repository, jobs);
  require('./../../routes/currency/currency-router').attachTo(app, repository, jobs);
  require('./../../routes/allocations/allocations-router').attachTo(app, repository);
  require('./../../routes/portfolio/portfolio-router').attachTo(app, repository, jobs);
  require('./../../routes/transaction/transaction-router').attachTo(app, repository, jobs);
  require('./../../routes/trade-history/trade-history-router').attachTo(app, repository, jobs);
  require('./../../routes/market/market-router').attachTo(app, repository);
  require('./../../routes/weidex/weidex-router').attachTo(app, repository, jobs);
  require('./../../routes/utilities/health-check-router').attachTo(app, repository);

  // Handle Errors
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    next();
  });

  return app;
};

module.exports = { init };
