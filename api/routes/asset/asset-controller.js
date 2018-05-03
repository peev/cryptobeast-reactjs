const assetController = (repository) => {
  const modelName = 'Asset';

  const createAsset = (req, res) => {
    return new Promise((resolve, reject) => {
      const asset = req.body;
      // TODO: delete this check -> check the assets in the MarketStore
      const findAssetPromise = repository.findOne({
        modelName,
        options: {
          where: {
            currency: asset.currency,
            origin: asset.origin,
            portfolioId: asset.portfolioId,
          },
        },
      });

      findAssetPromise
        .then((assets) => {
          if (assets !== null) {
            const foundAsset = assets.dataValues;
            foundAsset.balance += asset.balance;
            repository.update({ modelName, updatedRecord: foundAsset })
              .then(() => {
                findAssetPromise
                  .then(updatedAsset => resolve(updatedAsset));
              });
          } else {
            resolve(repository.create({ modelName, newObject: asset }));
          }
        });
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateAsset = (req, res) => {
    const asset = req.body;
    repository.update({ modelName, updatedRecord: asset })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const allocateAsset = (req, res) => {
    const allocationParams = req.body;
    const updateAssetFrom = new Promise((resolve, reject) => {
      repository.findOne({
        modelName,
        options: {
          where: {
            currency: allocationParams.fromCurrency,
            portfolioId: allocationParams.portfolioId,
          },
        },
      })
        .then((asset) => {
          const currencyAmountFrom = +allocationParams.fromAmount;
          if (asset.balance === currencyAmountFrom) {
            // if max value is given => delete
            resolve(repository.remove({ modelName, id: asset.id }));
          } else {
            // else => update
            const changedBalance = asset.balance - currencyAmountFrom;
            const updatedAsset = {
              id: asset.id,
              balance: changedBalance,
              currency: allocationParams.fromCurrency,
            };
            resolve(repository.update({ modelName, updatedRecord: updatedAsset }));
          }
        })
        .catch((error) => {
          return res.json(error);
        });
    })
      .catch((error) => {
        return res.json(error);
      });

    const updateAssetTo = new Promise((resolve, reject) => {
      // NOTE: doesn't take into account origin
      repository.findOne({
        modelName,
        options: {
          where: {
            currency: allocationParams.toCurrency,
            portfolioId: allocationParams.portfolioId,
          },
        },
      })
        .then((asset) => {
          const currencyAmountTo = +allocationParams.toAmount;
          const appliedFee = +allocationParams.feeAmount;
          if (asset === null) {
            // create new asset
            const newAsset = {
              origin: allocationParams.selectedExchange,
              portfolioId: allocationParams.portfolioId,
              balance: currencyAmountTo - appliedFee,
              currency: allocationParams.toCurrency,
            };

            resolve(repository.create({ modelName, newObject: newAsset }));
          } else {
            // update selected asset with applied fee
            const changedBalance = (asset.balance + currencyAmountTo) - appliedFee;
            const updatedAsset = {
              id: asset.id,
              balance: changedBalance,
              currency: allocationParams.toCurrency,
            };

            resolve(repository.update({ modelName, updatedRecord: updatedAsset }));
          }
        })
        .catch((error) => {
          return res.json(error);
        });
    })
      .catch((error) => {
        return res.json(error);
      });

    Promise.all([updateAssetFrom, updateAssetTo])
      .then(([updatedAssetFrom, updatedAssetTo]) => {
        repository.find({
          modelName,
          options: { where: { portfolioId: allocationParams.portfolioId } }
        })
          .then((assets) => {
            res.status(200).send(assets);
          });
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removeAsset = (req, res) => {
    const { assetId } = req.body;
    repository.remove({ modelName, id: assetId })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    createAsset,
    updateAsset,
    allocateAsset,
    removeAsset,
  };
};

module.exports = assetController;
