const constants = require('./config/constants');

require('./db/db').init()
  .then((db) => {
    return require('./data/data').init(db);
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
