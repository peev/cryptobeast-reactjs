const assetController = (repository) => {
  const addAssetToPortfolio = (req, res) => {
    const assetData = req.body;
    repository.asset.addNewAsset(assetData)
      .then(() => {
        console.log('\naddNewAsset response: ', assetData);
        res.status(200).send(assetData);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateAsset = (req, res) => {
    // const id = req.params.id;
    const assetData = req.body;

    repository.asset.update(assetData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removeAssetFromPortfolio = (req, res) => {
    const requestData = req.body;
    repository.asset.removeAsset(requestData)
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    addAssetToPortfolio,
    updateAsset,
    removeAssetFromPortfolio,
  };
};

module.exports = assetController;
