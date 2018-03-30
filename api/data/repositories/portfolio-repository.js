const init = (db) => {
  // TODO: Setup portfolio CRUD operations
  // const getAll = () => {
  //   return db.portfolio.findAll();
  // };
  const create = (request) => {
    const portfolioName = { name: request.name };

    return db.Portfolio.create(portfolioName);
  };

  // With Eager loading of assets, accounts and investors
  const getAll = () => {
    // return db.Portfolio.findAll();
    return db.Portfolio.findAll({ include: [db.Account, db.Asset, db.Investor] });
  };

  const update = (request) => {
    const updatedPortfolioName = { name: request.name };
    const portfolioId = request.id;

    return db.Portfolio.update(updatedPortfolioName, {
      where: { id: portfolioId },
    });
  };

  const remove = (request) => {
    const portfolioId = request.id;

    return db.Portfolio.destroy({
      where: { id: portfolioId },
    });
  };

  const updateAssetBTCEquivalent = (request) => {
    let assetPair;
    switch (request.currency) {
      case 'BTC':
        // TODO: 
        break;
      default:
        assetPair = `BTC_${request.currency}`;
        break;
    }

    db.Ticker.findById(assetPair)
      .then((ticker) => {
        const price = ticker.last;
        db.Asset.findById(request.body.id)
          .then(r => r.update({ lastBTCEquivalent: price }).then(() => { }));
      })

    // db.Asset.find({ where: { id: request.body.id } })
    //   .on('success', (asset) => {
    //     if (asset) {
    //       let assetPair;
    //       switch (asset.currency) {
    //         case 'BTC':
    //           // TODO: 
    //           break;
    //         default:
    //           assetPair = `BTC-${asset.currency}`;
    //           break;
    //       }
    //       db.Ticker.find({ where: { pair: assetPair } })
    //         .on('success', (ticker) => {
    //           if (ticker) {
    //             const assetBtcEquivalent = asset.balance * ticker.last;
    //             asset.updateAttributes({
    //               lastBTCEquivalent: assetBtcEquivalent,
    //             })
    //               .success((() => { }));
    //           }
    //         });
    //     }
    //   });
  };


  return {
    getAll,
    create,
    update,
    remove,
    updateAssetBTCEquivalent,
  };
};

module.exports = { init };
