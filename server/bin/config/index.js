
module.exports = {
  api: {
    port: process.env.PORT || 3200,
  },
  database: {
    host: process.env.DBHOST || '127.0.0.1',
    port: process.env.DBPORT || 5432,
    name: process.env.DBNAME || 'cryptobeast',
    user: process.env.DBUSER || 'postgres',
    password: process.env.DBPASS || 'postgres',
  },
};
