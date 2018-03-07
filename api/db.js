const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('CryptoBeast', null, null, {
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'DB', 'CryptoBeast.db'),
});

const db = {};

db.portfolio = sequelize.import(path.join(__dirname, '/models/portfolio.js'));
// db.todo = sequelize.import(path.join(__dirname, '/models/todo.js'));
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.portfolio.hasMany(db.account);
// db.todo.belongsTo(db.user);
// db.user.hasMany(db.todo);

module.exports = db;

