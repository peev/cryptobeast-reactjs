const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Investor';

const investorController = (repository) => {
  // TODO: delete upsertAsset + the check in the asset-controller -> do the check in the MarketStore
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

  const updatePortfolioShares = (transaction) => {
    const findPortfolio = repository.findOne({
      modelName: 'Portfolio',
      options: { where: { id: transaction.portfolioId } },
    });

    Promise.all([findPortfolio])
      .then(([foundPortfolio]) => {
        const shares = foundPortfolio.shares + transaction.shares;
        repository.update({
          modelName: 'Portfolio',
          updatedRecord: {
            id: foundPortfolio.id,
            shares,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateInvestorShares = (transaction) => {
    const findInvestor = repository.findOne({
      modelName: 'Investor',
      options: { where: { id: transaction.investorId } },
    });

    Promise.all([findInvestor])
      .then(([foundInvestor]) => {
        const purchasedShares = foundInvestor.purchasedShares + transaction.shares;

        repository.update({
          modelName: 'Investor',
          updatedRecord: {
            id: foundInvestor.id,
            purchasedShares,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createInvestor = (req, res) => {
    const investor = req.body;

    repository.create({ modelName, newObject: investor })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const updateInvestor = (req, res) => {
    const { id } = req.params;
    const investorData = req.body;
    Object.assign(investorData, { id });
    repository.update({ modelName, updatedRecord: investorData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const depositInvestor = (req, res) => {
    const depositData = req.body;
    const { transaction } = req.body;
    upsertAsset(depositData);
    updateInvestorShares(transaction);
    updatePortfolioShares(transaction);
    transaction.dateOfEntry = transaction.transactionDate;
    repository.create({ modelName: 'Transaction', newObject: transaction })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const withdrawalInvestor = (req, res) => {
    const { transaction } = req.body;
    transaction.shares *= (-1);
    transaction.amountInUSD *= (-1);
    updateInvestorShares(transaction);
    updatePortfolioShares(transaction);

    const withdrawalData = req.body;
    withdrawalData.balance *= (-1);
    upsertAsset(withdrawalData);

    repository.create({ modelName: 'Transaction', newObject: transaction })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeInvestor = (req, res) => {
    const { id } = req.body;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
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
