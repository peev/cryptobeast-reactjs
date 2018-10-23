const allocationsController = (repository) => {
  const marketService = require('../../services/market-service')(repository);
  const modelName = 'Allocation';

  const getAllocations = (req, res) => {
    const { portfolioId } = req.params;
    repository.find({ modelName, portfolioId })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createAllocation = async (allocationData) => {
    return repository.create({ modelName, newObject: allocationData })
      .then((response) => {
        console.log(response);
      })
      .catch(error => console.log(error));
  };

  const insertAllocation = async (req, res) => {
    this.createAllocation.then((res) => {
      res.status(200).send({
        status: 'success'
      });
    })
    .catch(error => {
      res.status(500).send({
        status: 'fail',
        error: error
      });
    });
  };

  return {
    insertAllocation,
    getAllocations
  };
};

module.exports = allocationsController;
