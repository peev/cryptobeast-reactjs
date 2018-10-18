/* globals __dirname */
const Sequelize = require('sequelize');
const path = require('path');
require('colors');

const createConnection = conf => new Sequelize(`postgres://${conf.user}:${conf.password}@${conf.host}:${conf.port}/${conf.name}`);

const init = databaseConfig => new Promise((resolve) => {
  const dbName = databaseConfig.name;
  const dbUser = databaseConfig.user;
  // const dbPass = databaseConfig.password;
  const testConnection = createConnection(databaseConfig);

  testConnection.query(`CREATE DATABASE ${dbName} WITH OWNER = ${dbUser}`)
    .then(() => {
      console.log('Database created.'.green);
    })
    .catch(() => {
      console.log('Database already exists.'.grey);
    }).then(() => {
      testConnection.close();
      const sequelize = createConnection(databaseConfig);
      const db = {};

      // TODO: Add new models here
      db.Portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
      // db.Account = sequelize.import(path.join(__dirname, '/models/account.js'));
      db.Asset = sequelize.import(path.join(__dirname, '/models/asset.js'));
      db.Investor = sequelize.import(path.join(__dirname, '/models/investor.js'));
      db.MarketSummary = sequelize.import(path.join(__dirname, '/models/marketSummary.js'));
      db.MarketSummaryHistory = sequelize.import(path.join(__dirname, '/models/marketSummaryHistory.js'));
      db.MarketPriceHistory = sequelize.import(path.join(__dirname, '/models/marketPriceHistory.js'));
      db.Ticker = sequelize.import(path.join(__dirname, '/models/ticker.js'));
      db.TickerHistory = sequelize.import(path.join(__dirname, '/models/tickerHistory.js'));
      db.Currency = sequelize.import(path.join(__dirname, '/models/currency.js'));
      db.Transaction = sequelize.import(path.join(__dirname, '/models/transaction.js'));
      db.Trade = sequelize.import(path.join(__dirname, '/models/trade.js'));
      db.ApiTradeHistory = sequelize.import(path.join(__dirname, '/models/apiTradeHistory.js'));
      db.SharePrice = sequelize.import(path.join(__dirname, '/models/sharePrice.js'));
      db.PortfolioPrice = sequelize.import(path.join(__dirname, '/models/portfolioPrice.js'));

      db.WeiPortfolio = sequelize.import(path.join(__dirname, '/models/weiPortfolio.js'));
      db.WeiAsset = sequelize.import(path.join(__dirname, '/models/weiAsset.js'));
      db.WeiTransaction = sequelize.import(path.join(__dirname, '/models/weiTransaction.js'));
      db.WeiTradeHistory = sequelize.import(path.join(__dirname, '/models/weiTradeHistory.js'));
      db.WeiCurrency = sequelize.import(path.join(__dirname, '/models/weiCurrency.js'));
      db.WeiFiatFx = sequelize.import(path.join(__dirname, '/models/weiFiatFx.js'));
      // db.User = sequelize.import(path.join(__dirname, '/models/user.js'));
      // db.Setting = sequelize.import(path.join(__dirname, '/models/setting.js'));
      // TODO: Configure model connections here (one-to-one/one-to-many etc.)

      // db.User.hasMany(db.Portfolio);
      // db.Portfolio.belongsTo(db.User);

      // db.User.hasMany(db.Setting);
      // db.Setting.belongsTo(db.User);

      // db.Portfolio.hasMany(db.Account);
      // db.Account.belongsTo(db.Portfolio);

      db.WeiPortfolio.hasMany(db.WeiTradeHistory);
      db.WeiTradeHistory.belongsTo(db.WeiPortfolio);

      db.WeiPortfolio.hasMany(db.WeiTransaction);
      db.WeiTransaction.belongsTo(db.WeiPortfolio);

      db.WeiPortfolio.hasMany(db.WeiAsset);
      db.WeiAsset.belongsTo(db.WeiPortfolio);

      db.Portfolio.hasMany(db.Asset);
      db.Asset.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Investor);

      db.Portfolio.hasMany(db.Transaction);
      db.Transaction.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Trade);
      db.Trade.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.ApiTradeHistory);
      db.ApiTradeHistory.belongsTo(db.Portfolio);

      db.Investor.hasMany(db.Transaction);
      db.Transaction.belongsTo(db.Investor);

      db.Portfolio.hasMany(db.SharePrice);
      db.SharePrice.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.PortfolioPrice);
      db.PortfolioPrice.belongsTo(db.Portfolio);

      db.Sequelize = Sequelize;
      db.sequelize = sequelize;
      // sync with 'force: true' will 'DROP TABLE IF EXISTS'
      db.sequelize.sync({
        force: false,
      });

      resolve(db);
    });
});

module.exports = {
  init,
};
