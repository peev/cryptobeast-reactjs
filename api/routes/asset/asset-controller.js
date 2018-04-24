const assetController = (repository) => {
  const modelName = 'Asset';

  const createAsset = (req, res) => {
    const asset = req.body;
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

    Promise.resolve(findAssetPromise)
      .then((assets) => {
        if (assets !== undefined) {
          const foundAsset = assets.dataValues;
          foundAsset.balance += asset.balance;
          return repository.update({ modelName, updatedRecord: foundAsset });
        }

        return repository.create({ modelName, newObject: asset });
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
    removeAsset,
  };
};

module.exports = assetController;
