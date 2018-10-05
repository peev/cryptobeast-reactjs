const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiTransaction';

const weiTransactionController = (repository) => {
  const createWeiTransaction = (req, res) => {
    const weiTransaction = req.body;
    repository.create({ modelName, newObject: weiTransaction })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getWeiTransaction = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeWeiTransaction = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  return {
    createWeiTransaction,
    getWeiTransaction,
    removeWeiTransaction,
  };
};

module.exports = weiTransactionController;
