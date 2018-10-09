const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiTransaction';

const weiTransactionController = (repository) => {
  const createWeiTransaction = (req, res) => {
    const weiTransactionData = req.body;
    repository.create({ modelName, newObject: weiTransactionData })
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

  const updateWeiTransaction = (req, res) => {
    const { id } = req.params;
    const weiTransactionData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiTransactionData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
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
    updateWeiTransaction,
    removeWeiTransaction,
  };
};

module.exports = weiTransactionController;