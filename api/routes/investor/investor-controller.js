const { responseHandler } = require('../utilities/response-handler');

const investorController = (repository) => {
  const addInvestorToPortfolio = (req, res) => {
    const investorData = req.body;
    repository.investor.addInvestor(investorData)
      .then(() => {
        res.status(200).send(investorData);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateInvestor = (req, res) => {
    const id = req.params.id;
    const investorData = req.body;

    repository.investor.update(id, investorData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const depositInvestor = (req, res) => {
    repository.investor.moveShares(req.body, 'deposit')
      .then((deposit) => {
        res.status(200).send(deposit);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const withdrawalInvestor = (req, res) => {
    repository.investor.moveShares(req.body, 'withdrawal')
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removeInvestorFromPortfolio = (req, res) => {
    const requestData = req.body;
    repository.investor.removeInvestor(requestData)
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    addInvestorToPortfolio,
    updateInvestor,
    depositInvestor,
    withdrawalInvestor,
    removeInvestorFromPortfolio,
  };
};

module.exports = investorController;
