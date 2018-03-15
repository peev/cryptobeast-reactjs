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
  db.portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
  // db.todo = sequelize.import(path.join(__dirname, '/models/todo.js'));

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // TODO: Configure model connections here (one-to-one/one-to-many etc.)
  // db.portfolio.hasMany(db.account);
  // db.todo.belongsTo(db.user);
  // db.user.hasMany(db.todo);

  // sync with 'force: true' will 'DROP TABLE IF EXISTS'
  db.sequelize.sync({ force: false });

  return Promise.resolve(db);
};

module.exports = { init };
