/* globals __dirname */
const Sequelize = require('sequelize');
const path = require('path');
require('colors');

const createConnection = (dbToConnect, dbUser, dbPassword) => new Sequelize(dbToConnect, dbUser, dbPassword, {
  dialect: 'postgres',
});

const init = ({ dbName, dbUser, dbPassword }) => new Promise((resolve, reject) => {
  const defaultDbName = 'postgres';
  const testconnection = createConnection(defaultDbName, dbUser, dbPassword);

  testconnection.query(`CREATE DATABASE ${dbName} WITH OWNER = ${dbUser}`)
    .then(() => {
      console.log('Database created.'.green);
    })
    .catch((err) => {
      console.log('Database already exists.'.grey);
      console.log(err);
    }).then(() => {
      testconnection.close();
      const sequelize = createConnection(dbName, dbUser, dbPassword);
      const db = {};

      // TODO: Add new models here
      db.Portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
      db.Account = sequelize.import(path.join(__dirname, '/models/account.js'));
      db.Asset = sequelize.import(path.join(__dirname, '/models/asset.js'));
      db.Investor = sequelize.import(path.join(__dirname, '/models/investor.js'));
      db.MarketSummary = sequelize.import(path.join(__dirname, '/models/marketSummary.js'));
      db.Ticker = sequelize.import(path.join(__dirname, '/models/ticker.js'));
      db.Currency = sequelize.import(path.join(__dirname, '/models/currency.js'));
      db.Transaction = sequelize.import(path.join(__dirname, '/models/transaction.js'));
      // TODO: Configure model connections here (one-to-one/one-to-many etc.)
      db.Portfolio.hasMany(db.Account);
      db.Account.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Asset);
      db.Asset.belongsTo(db.Portfolio);

      db.Portfolio.hasMany(db.Investor);
      // db.todo.belongsTo(db.user);
      // db.user.hasMany(db.todo);

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
