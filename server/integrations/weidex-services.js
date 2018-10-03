const crossStorageClient = require('cross-storage').CrossStorageClient;

const baseURL = 'http://localhost:8080/hub.html';

const weidexServices = () => {
  console.log('weee');
  const getUserAddresses = new Promise((resolve) => {
    const storage = crossStorageClient({ baseURL });
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
