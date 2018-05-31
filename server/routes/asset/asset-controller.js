const { responseHandler } = require('../utilities/response-handler');

const assetController = (repository) => {
  const modelName = 'Asset';

  const createAsset = (req, res) => {
    new Promise((resolve) => {
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
            foundAsset.balance += Number(asset.balance);
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
        res.json(error);
      });
  };

  const updateAsset = (req, res) => {
    const asset = req.body;
    repository.update({ modelName, updatedRecord: asset })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeAsset = (req, res) => {
    const { assetId } = req.body;
    repository.remove({ modelName, id: assetId })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        res.json(error);
      });
  };


  const allocateAsset = async (req, res) => {
    try {
      const allocationParams = req.body;
      const fromAsset = await repository.findOne({
        modelName,
        options: {
          where: {
            currency: allocationParams.fromCurrency,
            origin: allocationParams.selectedExchange,
            portfolioId: allocationParams.portfolioId,
          },
        },
      });

      let toAsset = await repository.findOne({
        modelName,
        options: {
          where: {
            currency: allocationParams.toCurrency,
            origin: allocationParams.selectedExchange,
            portfolioId: allocationParams.portfolioId,
          },
        },
      });

      const currencyAmountFrom = +allocationParams.fromAmount;
      if (fromAsset.balance === currencyAmountFrom) {
        // if max value is given => delete
        await repository.remove({ modelName, id: fromAsset.id });
      } else {
        // else => update
        const changedBalance = fromAsset.balance - currencyAmountFrom;
        const updatedAsset = {
          id: fromAsset.id,
          balance: changedBalance,
          currency: allocationParams.fromCurrency,
        };
        await repository.update({ modelName, updatedRecord: updatedAsset });
      }

      const currencyAmountTo = +allocationParams.toAmount;
      const appliedFee = +allocationParams.feeAmount;
      if (toAsset === null) {
        // create new asset
        const newAsset = {
          origin: allocationParams.selectedExchange,
          portfolioId: allocationParams.portfolioId,
          balance: currencyAmountTo - appliedFee,
          currency: allocationParams.toCurrency,
        };
        toAsset = await repository.create({ modelName, newObject: newAsset });
      } else {
        // update selected asset with applied fee
        const changedBalance = (toAsset.balance + currencyAmountTo) - appliedFee;
        const updatedAsset = {
          id: toAsset.id,
          balance: changedBalance,
          currency: allocationParams.toCurrency,
        };
        await repository.update({ modelName, updatedRecord: updatedAsset });
      }
      // const trade = await recordTrade(allocationParams, fromAsset, toAsset);
      const assets = await repository.find({
        modelName,
        options: { where: { portfolioId: allocationParams.portfolioId } },
      });

      return res.status(200).send({
        // trade,
        fromAsset,
        toAsset,
        assets,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };

  // #region Trades
  const createTrade = (req, res) => {
    const trade = req.body;
    repository.create({ modelName: 'Trade', newObject: trade })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateTrade = (req, res) => {
    const trade = req.body;
    repository.update({ modelName: 'Trade', updatedRecord: trade })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeTrade = (req, res) => {
    const { tradeId } = req.body;
    repository.remove({ modelName: 'Trade', id: tradeId })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllTrades = (req, res) => {
    repository.find({ modelName: 'Trade' })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };
  // #endregion

  return {
    createAsset,
    updateAsset,
    removeAsset,
    allocateAsset,
    createTrade,
    updateTrade,
    removeTrade,
    getAllTrades,
  };
};

module.exports = assetController;
