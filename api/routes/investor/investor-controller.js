const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Investor';

const investorController = (repository) => {
  const assetController = require('../asset/asset-controller')(repository);

  const createInvestor = (req, res) => {
    const { investor } = req.body;
    const { transaction } = req.body;

    assetController.createAsset({
      body:
        {
          currency: req.body.currency,
          balance: req.body.balance,
          origin: 'Manually Added',
          portfolioId: req.body.portfolioId,
        },
    });

    // TODO: Add transaction through repository

    repository.create({ modelName, newObject: investor })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
    // });
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
    createInvestor,
    updateInvestor,
    depositInvestor,
    withdrawalInvestor,
    removeInvestorFromPortfolio,
  };
};

module.exports = investorController;
