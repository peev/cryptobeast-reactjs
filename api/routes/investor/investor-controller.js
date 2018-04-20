const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Investor';

const investorController = (repository) => {
  // Update or insert new asset
  const upsertAsset = (depositData) => {
    const assetController = require('../asset/asset-controller')(repository);
    const assetData = {
      currency: depositData.currency,
      balance: depositData.balance,
      origin: 'Manually Added',
      portfolioId: depositData.portfolioId,
    };
    assetController.createAsset({
      body: assetData,
    });
  };

  const updateShares = (transaction) => {
    const findInvestor = repository.find({
      modelName: 'Investor',
      options: { where: { id: transaction.investorId } },
    });
    const findPortfolio = repository.find({
      modelName: 'Portfolio',
      options: { where: { id: transaction.portfolioId } },
    });

    Promise.all([findInvestor, findPortfolio])
      .then(([foundInvestors, foundPortfolios]) => {
        const purchasedShares = foundInvestors[0].purchasedShares + transaction.shares;
        const shares = foundPortfolios[0].shares + transaction.shares;

        repository.update({
          modelName: 'Investor',
          updatedRecord: {
            id: foundInvestors[0].id,
            purchasedShares,
          },
        });

        repository.update({
          modelName: 'Portfolio',
          updatedRecord: {
            id: foundPortfolios[0].id,
            shares,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createInvestor = (req, res) => {
    const { investor } = req.body;
    const { transaction } = req.body;
    const depositData = req.body;

    upsertAsset(depositData);

    repository.create({ modelName, newObject: investor })
      .then((newInvestor) => {
        Object.assign(transaction, { investorId: newInvestor.id });
        updateShares(transaction);
        repository.create({ modelName: 'Transaction', newObject: transaction })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            return res.json(error);
          });
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateInvestor = (req, res) => {
    const { id } = req.params;
    const investorData = req.body;
    Object.assign(investorData, { id });
    repository.update({ modelName, updatedRecord: investorData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const depositInvestor = (req, res) => {
    const { transaction } = req.body;
    upsertAsset(transaction);
    updateShares(transaction);
    repository.create({ modelName: 'Transaction', newObject: transaction })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
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

  const removeInvestor = (req, res) => {
    const { id } = req.body;
    repository.remove({ modelName, id })
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
    removeInvestor,
  };
};

module.exports = investorController;
