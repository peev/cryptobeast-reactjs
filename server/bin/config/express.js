const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const jwksRsa = require('jwks-rsa');
// const jwt = require('express-jwt');
// const path = require('path');


const init = async (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
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

  // Middleware for checking the JWT
  // const checkJwt = jwt({
  //   // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint
  //   secret: jwksRsa.expressJwtSecret({
  //     cache: true,
  //     rateLimit: true,
  //     jwksRequestsPerMinute: 5,
  //     jwksUri: 'https://cryptobeast.eu.auth0.com/.well-known/jwks.json',
  //   }),

  //   // Validate the audience and the issuer
  //   audience: 'ro3TfD3x5qWYVH7EhI7IlpoHPK330NeQ',
  //   issuer: 'https://cryptobeast.eu.auth0.com/',
  //   algorithms: ['RS256'],
  // });

  // Enable Authentication on all API Endpoints
  // app.use(checkJwt);


  // Initialize market summaries, base tickers and their sync jobs
  // const currencies = await repository.find({ modelName: 'Currency' });
  // if (!currencies) {
  //   marketService.syncCurrenciesFromApi();
  //   marketService.syncSummaries();
  //   marketService.syncTickersFromKraken();
  //   marketService.syncTickersFromCoinMarketCap();
  // }

  // Market jobs
  marketService.createMarketJob(marketService.syncCurrenciesFromApi, { hour: 23, minute: 59 });
  marketService.createMarketJob(marketService.syncSummaries, { second: 0 }); // sync every minute
  marketService.createMarketJob(marketService.syncTickersFromKraken, { second: 0 }); // sync every minute
  marketService.createMarketJob(marketService.syncTickersFromCoinMarketCap, { minute: 0 }); // sync every hour
  // Save to history
  marketService.createMarketJob(marketService.saveSummariesToHistory, { minute: 0 }); // sync every hour
  marketService.createMarketJob(marketService.saveTickersFromKrakenToHistory, { minute: 0 }); // sync every hour


  // Initialize all portfolio jobs and pass them to portfolio-controller
  const jobs = {
    closingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingSharePriceJob),
    openingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveOpeningSharePriceJob),
    closingPortfolioCostJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingPortfolioCostJob),
  };
  // #endregion

  // TODO: Create router for every new model and add it here
  require('./../../routes/portfolio/portfolio-router').attachTo(app, repository, jobs);
  require('./../../routes/user/user-router').attachTo(app, repository, jobs);
  require('./../../routes/asset/asset-router').attachTo(app, repository);
  require('./../../routes/market/market-router').attachTo(app, repository);
  require('./../../routes/account/account-router').attachTo(app, repository);
  require('./../../routes/investor/investor-router').attachTo(app, repository);
  require('./../../routes/wei-portfolio/wei-portfolio-router').attachTo(app, repository, jobs);
  require('./../../routes/wei-asset/wei-asset-router').attachTo(app, repository, jobs);
  require('./../../routes/wei-transaction/wei-transaction-router').attachTo(app, repository, jobs);
  require('./../../routes/wei-trade-history/wei-trade-history-router').attachTo(app, repository, jobs);
  require('./../../routes/wei-currency/wei-currency-router').attachTo(app, repository, jobs);
  require('./../../routes/wei-fiat-fx/wei-fiat-fx-router').attachTo(app, repository, jobs);

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
