
module.exports = {
  api: {
    port: process.env.PORT || 3200,
  },
  authManagementApi: {
    domain: process.env.AUTH_DOMAIN || 'cryptobeast.eu.auth0.com',
    client_id: process.env.AUTH_CLIENT_ID || 'EoQ627oyrZoV85omGjkZkfFjtSDwOYLt',
    client_secret: process.env.AUTH_CLIENT_SECRET || '2kof6xTX-lhEOXsD_w00rovVOtQFyo3VrBMOeAOwIa1TQGB3O9lMk3Dw8tRhIiJ0',
  },
  database: {
    host: process.env.DBHOST || '127.0.0.1',
    port: process.env.DBPORT || 5432,
    name: process.env.DBNAME || 'weibeast',
    user: process.env.DBUSER || 'postgres',
    password: process.env.DBPASS || 'postgres',
  },
};
