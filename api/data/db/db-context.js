/* globals __dirname */
const Sequelize = require('sequelize');
const path = require('path');


const init = () => {
  const sequelize = new Sequelize('CryptoBeast', null, null, {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'CryptoBeast.db'),
  });

  const db = {};

  // TODO: Add new models here
  db.Portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
  db.Account = sequelize.import(path.join(__dirname, '/models/account.js'));
  db.Asset = sequelize.import(path.join(__dirname, '/models/asset.js'));
  db.Investor = sequelize.import(path.join(__dirname, '/models/investor.js'));
  db.MarketSummary = sequelize.import(path.join(__dirname, '/models/marketSummary.js'));

  // TODO: Configure model connections here (one-to-one/one-to-many etc.)
  db.Portfolio.hasMany(db.Account);
  db.Account.belongsTo(db.Portfolio);

  db.Portfolio.hasMany(db.Asset);
  db.Asset.belongsTo(db.Portfolio);

  db.Portfolio.hasMany(db.Investor);
  // db.todo.belongsTo(db.user);
  // db.user.hasMany(db.todo);

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  // sync with 'force: true' will 'DROP TABLE IF EXISTS'
  db.sequelize.sync({ force: false });

  return Promise.resolve(db);
};

module.exports = { init };
