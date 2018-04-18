const constants = require('./config/constants');

require('./data/db/db-context').init()
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
