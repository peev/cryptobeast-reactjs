const constants = require('./config/constants');
const dbConfig = require('./config/db');

require('./data/db/db-context').init(dbConfig)
  .then((dbContext) => {
    return require('./data/repository').init(dbContext);
  })
  .then((data) => {
    return require('./config/express').init(data);
  })
  .then((server) => {
    server.listen(constants.port, () => {
      console.log(`Server is running on port :${constants.port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
