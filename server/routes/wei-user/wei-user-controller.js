const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiUser';

const weiUserController = (repository) => {
  const createWeiUser = (req, res) => {
    const weiUser = req.body;

    repository.create({ modelName, newObject: weiUser })
      .then((response) => { res.status(200).send(response); })
      .catch(error => res.json(error));
  };

  const updateWeiUser = async (req, res) => {
    const weiUser = req.body;
    repository.update({ modelName, updatedRecord: weiUser })
      .then((response) => { res.status(200).send(response); })
      .catch((error) => { res.json(error); });
  };

  const removeWeiUser = (req, res) => {
    const { id } = req.body;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const getWeiUser = (req, res) => {
    const { weiUserId } = req.body;

    repository.findById({ modelName, id: weiUserId })
      .then((response) => { res.status(200).send(response); })
      .catch(error => res.json(error));
  };

  return {
    createWeiUser,
    updateWeiUser,
    removeWeiUser,
    getWeiUser,
  };
};

module.exports = weiUserController;
