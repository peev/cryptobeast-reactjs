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
    repository.create({ modelName: 'Transaction', newObject: transaction });
    repository.create({ modelName, newObject: investor })
      .then((response) => {
        res.status(200).send(response);
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

  const transactionPromise = (transaction) => {
    return new Promise((resolve, reject) => {
      const createTransactioPromise = repository.create({ modelName: 'Transaction', newObject: transaction });
      const findInvestorPromise = repository.find({
        modelName: 'Investor',
        options: { where: { id: transaction.investorId } },
      });
      const findPortfolioPromise = repository.find({
        modelName: 'Portfolio',
        options: { where: { id: transaction.portfolioId } },
      });

      Promise.all([createTransactioPromise, findInvestorPromise, findPortfolioPromise])
        .then(([newTransaction, investor, portfolio]) => {
          const updatedInvestor = investor[0];
          updatedInvestor.purchasedShares += transaction.shares;

          const updatedPortfolio = portfolio[0];
          updatedPortfolio.shares += transaction.shares;

          // investor.purchasedShares += transaction.shares;
          // portfolio.shares += transaction.shares;
          repository.update({ modelName: 'Investor', updatedRecord: updatedInvestor });

          resolve(repository.update({ modelName: 'Portfolio', updatedRecord: updatedPortfolio }));
        });
    });
  };

  const depositInvestor = (req, res) => {
    // const depositData = req.body;

    const { transaction } = req.body;
    const transactionResult = transactionPromise(transaction);
    transactionResult.then(r => console.log('>>> from transactionResult: ', r))
      // console.log('>>> transactionResult: ', transactionResult);



      // repository.investor.moveShares(depositData, 'deposit')
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
