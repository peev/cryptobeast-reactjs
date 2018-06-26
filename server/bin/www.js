const debug = require('debug')('server:server');
const http = require('http');
const env = require('dotenv').config(); // eslint-disable-line
const config = require('./config');

(async () => {
  const dbContext = await require('./../data/db/db-context').init(config.database);
  const repository = await require('./../data/repository').init(dbContext);
  const app = await require('./config/express').init(repository, config);
  const port = parseInt(config.api.port, 10);

  app.set('port', port);


  const server = http.createServer(app)
    .listen(port)
    .on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      debug(`Listening on ${bind}`);
    })
    .on('error', (error) => {
      if (error.syscall !== 'listen') throw error;

      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`); // eslint-disable-line
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`); // eslint-disable-line
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
})();
