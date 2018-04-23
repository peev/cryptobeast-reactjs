const init = (db) => {

  const updateAssetBTCEquivalent = (request) => {
    let assetPair;
    let updatedAssetResult;
    switch (request.currency) {
      case 'BTC':
        updatedAssetResult = new Promise((resolve, reject) => {
          db.Asset
            .findById(request.id)
            .then((a) => {
              const price = a.balance;
              return a.update({ lastBTCEquivalent: price })
                .then(updatedAsset => resolve(updatedAsset));
            });
        });
        break;
      case 'USDT':
        assetPair = `${request.currency}-BTC`;
        updatedAssetResult = new Promise((resolve, reject) => {
          return db.Ticker
            .findById(assetPair)
            .then((ticker) => {
              db.Asset
                .findById(request.id)
                .then((a) => {
                  const price = a.balance / ticker.last;
                  return a.update({ lastBTCEquivalent: price })
                    .then(updatedAsset => resolve(updatedAsset));
                });
            });
        });
        break;
      case 'USD':
      case 'JPY':
      case 'EUR':
        assetPair = request.currency;
        updatedAssetResult = new Promise((resolve, reject) => {
          return db.Ticker
            .findById(assetPair)
            .then((ticker) => {
              db.Asset
                .findById(request.id)
                .then((a) => {
                  const price = a.balance / ticker.last;
                  return a.update({ lastBTCEquivalent: price })
                    .then(updatedAsset => resolve(updatedAsset));
                });
            });
        });
        break;
      default:
        assetPair = `BTC-${request.currency}`;
        updatedAssetResult = new Promise((resolve, reject) => {
          return db.Ticker
            .findById(assetPair)
            .then((ticker) => {
              db.Asset
                .findById(request.id)
                .then((a) => {
                  const price = a.balance * ticker.last;
                  return a.update({ lastBTCEquivalent: price })
                    .then(updatedAsset => resolve(updatedAsset));
                });
            });
        });
        break;
    }

    return updatedAssetResult;
  };

  const updatePortfolioBTCEquivalent = (request) => {
    return new Promise((resolve, reject) => {
      db.Portfolio.find({
        where: { id: request.id },
        include: [db.Asset],
      })
        .then((pf) => {
          if (pf.assets.length === 0) { // If there aren't any assets in the portfolio
            return pf;
          }

          return Promise.all(pf.assets.map((asset) => {
            return updateAssetBTCEquivalent(asset).then((updatedAsset) => {
              const newPfCost = +pf.cost + updatedAsset.lastBTCEquivalent;
              return pf.update({ cost: newPfCost });
            });
          }));
        }).then((result) => {
          const portfolioId = Array.isArray(result) ? result[0].id : result.id;
          db.Portfolio.find({
            where: { id: portfolioId },
            include: [db.Asset],
          }).then(finalResult => resolve(finalResult)); // Get updated pf with updated assets
        });
    });
  };

  const getSharePrice = (request) => {
    return new Promise((resolve, reject) => {
      db.Portfolio.findById(request.id)
        .then((pf) => {
          db.Ticker.findById('USD')
            .then((usdTicker) => {
              const sharePrice = pf.shares === 0 ? 1 : (pf.cost * usdTicker.last) / pf.shares;
              resolve({ sharePrice });
            });
        }).catch((error) => {
          console.log(error);
        });
    });
  };

  return {
    updateAssetBTCEquivalent,
    updatePortfolioBTCEquivalent,
    getSharePrice,
  };
};

module.exports = { init };
