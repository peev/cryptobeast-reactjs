const { responseHandler } = require('../utilities/response-handler');

const investorController = (repository) => {
  const addInvestorToPortfolio = (req, res) => {
    const investorData = req.body;
    repository.investor.addInvestor(investorData)
      .then(() => {
        repository.asset.addNewAsset({
          currency: investorData.currency,
          balance: investorData.balance,
          origin: 'Manually Added',
          portfolioId: investorData.portfolioId,
        })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            return res.json(error);
          });
      });
  };

  const updateInvestor = (req, res) => {
    const { id } = req.params;
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
    const depositData = req.body;
    repository.investor.moveShares(depositData, 'deposit')
      .then(() => {
        repository.asset.addNewAsset({
          currency: depositData.currency,
          balance: depositData.balance,
          origin: 'Manually Added',
          portfolioId: depositData.portfolioId,
        })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            return res.json(error);
          });
      });
  };

  const withdrawalInvestor = (req, res) => {
    const withdrawalData = req.body;
    repository.investor.moveShares(withdrawalData, 'withdrawal')
      .then(() => {
        repository.asset.addNewAsset({
          currency: withdrawalData.currency,
          balance: withdrawalData.balance,
          origin: 'Manually Added',
          portfolioId: withdrawalData.portfolioId,
        })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            return res.json(error);
          });
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
