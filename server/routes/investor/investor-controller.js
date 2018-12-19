const modelName = 'Investor';

const investorController = (repository) => {
  const intReqService = require('../../services/internal-requeter-service')(repository);

  const createInvestor = async (req, res) => {
    const investor = req.body;

    const portfolio = await intReqService.getPortfolioById(investor.portfolioId);

    if (portfolio !== null && portfolio !== undefined) {
      await repository.create({ modelName, newObject: investor })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => res.status(500).send(error));
    } else {
      res.status(400).send('Invalid portfolio address!');
    }
  };

  const getInvestors = async (req, res) => {
    const { portfolioId } = req.params;
    repository.find({
      modelName,
      options: {
        where: {
          portfolioId,
        },
      },
    })
      .then(response => res.status(200).send(response))
      .catch(error => res.status(400).send(error));
  };


  const updateInvestor = async (req, res) => {
    const { id } = req.params;
    const investor = req.body;
    const investorData = Object.assign({}, investor, { id });
    await repository.update({ modelName, updatedRecord: investorData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.status(400).send(error));
  };

  const removeInvestor = async (req, res) => {
    const { id } = req.params;
    const investor = req.body;
    const investorData = Object.assign({}, investor, { id, active: false });
    await repository.update({ modelName, updatedRecord: investorData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.status(500).send(error));
  };

  return {
    createInvestor,
    updateInvestor,
    removeInvestor,
    getInvestors,
  };
};

module.exports = investorController;
