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
      db.Allocation = sequelize.import(path.join(__dirname, '/models/allocation.js'));
      db.Asset = sequelize.import(path.join(__dirname, '/models/asset.js'));
      db.Investor = sequelize.import(path.join(__dirname, '/models/investor.js'));
      db.TradeHistory = sequelize.import(path.join(__dirname, '/models/tradeHistory.js'));
      db.Currency = sequelize.import(path.join(__dirname, '/models/currency.js'));
      db.Transaction = sequelize.import(path.join(__dirname, '/models/transaction.js'));
      db.Portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
      db.CoinMarketCapCurrency = sequelize.import(path.join(__dirname, '/models/CoinMarketCapCurrency.js'));

      db.Portfolio.hasMany(db.TradeHistory);
      db.TradeHistory.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Transaction);
      db.Transaction.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Asset);
      db.Asset.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Investor);

      db.Portfolio.hasMany(db.Transaction);
      db.Transaction.belongsTo(db.Portfolio);

      db.Investor.hasMany(db.Transaction);
      db.Transaction.belongsTo(db.Investor);

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
