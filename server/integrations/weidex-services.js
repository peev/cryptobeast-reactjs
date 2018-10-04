const CrossStorageClient = require('cross-storage');

const baseURL = 'http://localhost:8080/hub.html';

const weidexServices = () => {
  const getUserAddresses = new Promise((resolve) => {
    const storage = new CrossStorageClient.CrossStorageClient({ baseURL });
    storage.onConnect()
      .then(() => storage.get('WALLETS_INFO'))
      .then((res) => {
        console.log(res);
        resolve(Object.keys(res).map(el => ({
          res: res[el],
        })));
      })
      .catch(err => console.log(err))
      .then(() => storage.close());
  });

  return {
    getUserAddresses,
  };
};

module.exports = { weidexServices };
