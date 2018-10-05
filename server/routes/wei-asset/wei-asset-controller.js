const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiAsset';

const weiAssetController = (repository) => {
  const createWeiAsset = (req, res) => {
    const weiAsset = req.body;
    repository.create({ modelName, newObject: weiAsset })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiAsset = (req, res) => {
    const weiAsset = req.body;
    repository.update({ modelName, updatedRecord: weiAsset })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeWeiAsset = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  return {
    createWeiAsset,
    updateWeiAsset,
    removeWeiAsset,
  };
};

module.exports = weiAssetController;
