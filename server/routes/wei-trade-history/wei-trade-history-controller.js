const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiTradeHistory';

const weiTradeController = (repository) => {
  const createWeiTrade = (req, res) => {
    const weiTrade = req.body;
    repository.create({ modelName, newObject: weiTrade })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getWeiTrade = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiTrade = (req, res) => {
    const { id } = req.params;
    const weiTradeData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiTradeData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiTrade = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = (data) => {
    
  };

  return {
    createWeiTrade,
    getWeiTrade,
    updateWeiTrade,
    removeWeiTrade,
  };
};

module.exports = weiTradeController;
