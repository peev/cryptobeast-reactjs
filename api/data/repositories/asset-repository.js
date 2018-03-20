const init = (db) => {
  const addNewAsset = (request) => {
    const newAsset = {
      currency: request.currency,
      balance: request.balance,
    };
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const createdAsset = db.Asset.create(newAsset)
      .then(result => result);

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        createdAsset,
      ]).then((values) => {
        resolve(values[0].addAsset(values[1]));
      }).catch((err) => {
        reject(err);
      });
    });

    return ret;
  };

  const update = (request) => {
    return db.Asset.update({
      currency: request.currency,
      balance: request.balance,
    }, {
      where: { id: request.assetId },
    });
  };

  const removeAsset = (request) => {
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const asset = db.Asset.findById(request.assetId);
    const deletedAsset = db.Asset.destroy({
      where: { id: request.assetId },
    });

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        asset,
      ]).then((values) => {
        resolve(values[0].removeAccount(values[1]));
      })
        .then(deletedAsset)
        .catch((err) => {
          reject(err);
        });
    });

    return ret;
  };

  return {
    addNewAsset,
    update,
    removeAsset,
  };
};

module.exports = { init };
