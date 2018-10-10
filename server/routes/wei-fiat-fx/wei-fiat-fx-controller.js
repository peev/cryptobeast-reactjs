const { responseHandler } = require('../utilities/response-handler');

const modelName = 'weiFiatFx';

const weiFiatFxController = (repository) => {
  const createWeiFiatFx = (req, res) => {
    const weiFiatFxData = req.body;
    repository.create({ modelName, newObject: weiFiatFxData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getWeiFiatFx = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiFiatFx = (req, res) => {
    const { id } = req.params;
    const weiFiatFxData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiFiatFxData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiFiatFx = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  return {
    createWeiFiatFx,
    getWeiFiatFx,
    updateWeiFiatFx,
    removeWeiFiatFx,
  };
};

module.exports = weiFiatFxController;
