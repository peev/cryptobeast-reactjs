const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const express = require('express');
const jwt = require('express-jwt');

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');



const init = async (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const marketService = require('../../services/market-service')(repository);

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

  // #region Middleware
  // TODO: Here you can add new middleware
  // require('./passport').applyTo(app, data);

  // Initialize market summaries, base tickers and their sync jobs
  const currencies = await repository.find({ modelName: 'Currency' });
  if (!currencies) {
    marketService.syncCurrenciesFromApi();
    marketService.syncSummaries();
    marketService.syncTickersFromKraken();
  }
  // Market jobs
  marketService.createMarketJob(marketService.syncCurrenciesFromApi, { hour: 23, minute: 59, second: '*' });
  marketService.createMarketJob(marketService.syncSummaries, { minute: 0, second: '*' }); // sync every hour
  marketService.createMarketJob(marketService.syncTickersFromKraken, { minute: 0, second: '*' }); // sync every hour

  // Initialize all portfolio jobs and pass them to portfolio-controller
  let jobs = {
    closingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingSharePriceJob),
    openingSharePriceJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveOpeningSharePriceJob),
    closingPortfolioCostJobs: await portfolioService.initializeAllJobs(portfolioService.createSaveClosingPortfolioCostJob),
  };
  // Test if jobs is singleton
  // const printSharePriceJobs = () => console.log('>>> express jobs: ', jobs);
  // setInterval(printSharePriceJobs, 5000);
  // #endregion


  // Middleware for checking the JWT
  const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://cryptobeast.eu.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer
    audience: 'ro3TfD3x5qWYVH7EhI7IlpoHPK330NeQ', //replace with your API's audience, available at Dashboard > APIs
    issuer: 'https://cryptobeast.eu.auth0.com/',
    algorithms: ['RS256']
  });

  // Create timesheets API endpoint
  app.post('/timesheets', checkJwt, function(req, res){

    res.status(201).send(req.user);
  })

  // app.use(checkJwt);

  // TODO: Create router for every new model and add it here
  require('./../../routes/portfolio/portfolio-router').attachTo(app, repository, jobs);
  require('./../../routes/user/user-router').attachTo(app, repository, jobs);
  require('./../../routes/asset/asset-router').attachTo(app, repository);
  require('./../../routes/market/market-router').attachTo(app, repository);
  require('./../../routes/account/account-router').attachTo(app, repository);
  require('./../../routes/investor/investor-router').attachTo(app, repository);

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
    res.status(err.status || 500).send(err);
  });

  return app;
};

module.exports = { init };
