const init = (db) => {
  const addNewAsset = (request) => {
    return new Promise((resolve, reject) => {
      console.log('>>> addNewAsset requst: ', request);
      db.Asset.findAll({
        where: {
          currency: request.currency,
          origin: 'Manually Added',
          portfolioId: request.portfolioId,
        },
      })
        .then((assets) => {
          if (assets.length === 0) {
            db.Asset.create({
              currency: request.currency,
              balance: request.balance,
              origin: 'Manually Added',
              portfolioId: request.portfolioId,
            })
              .then(r => resolve(r))
              .catch((err) => {
                reject(err);
              });
          } else {
            assets[0].increment('balance', { by: request.balance })
              .then(r => resolve(r))
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const update = (request) => {
    return db.Asset.update({
      balance: request.balance,
    }, {
        where: { id: request.assetId },
      });
  };

  const addAssetsFromApi = (assets, account) => {
    const portfolio = db.Portfolio.findById(account.portfolioId);
    const addedAssets = db.Asset.bulkCreate(assets).then(result => result);

    return new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        addedAssets,
      ]).then((values) => {
        values[1].forEach((asset) => {
          values[0].addAsset(asset);
        });
      })
        .then(() => resolve(addedAssets))
        .catch((err) => {
          reject(err);
        });
    });
    // return db.Asset.bulkCreate(assets);
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
    addAssetsFromApi,
    removeAsset,
  };
};

module.exports = { init };
