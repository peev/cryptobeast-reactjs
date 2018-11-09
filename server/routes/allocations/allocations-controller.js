

const allocationsController = (repository) => {
  const modelName = 'Allocation';
  const Sequelize = require('sequelize');
  const op = Sequelize.Op;

  const getPortfolioObject = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getLastAllocation = async portfolioIdParam => repository.findOne({
    modelName,
    options: {
      where: {
        portfolioID: portfolioIdParam,
      },
      order: [['timestamp', 'DESC']],
    },
  })
    .catch(err => console.log(err));

  const getTrades = async (portfolioIdParam, timestampParam) => repository.find({
    modelName: 'TradeHistory',
    options: {
      where: {
        portfolioId: portfolioIdParam,
        timestamp: {
          [op.gt]: timestampParam,
        },
        status: 'FILLED',
      },
    },
  })
    .catch(err => console.log(err));

  const getTransactions = async (portfolioIdParam, timestampParam) => repository.find({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId: portfolioIdParam,
        txTimestamp: {
          [op.gt]: timestampParam,
        },
        status: 'SUCCESS',
      },
    },
  })
    .catch(err => console.log(err));

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

  const insertAllocation = async (req, res) => {
    const allocation = req.body;
    return repository.create({ modelName, newObject: allocation })
      .then(() => {
        res.status(200).send({
          status: 'success',
        });
      })
      .catch((error) => {
        res.status(500).send({
          status: 'fail',
          error,
        });
      });
  };

  const sync = async (req, res, addresses) => {
    const allocationsArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObject(address);
        const lastAllocation = await getLastAllocation(portfolio.id);
        const trades = await getTrades(portfolio.id, lastAllocation.timestamp);
        const transactions = await getTransactions(portfolio.id, lastAllocation.timestamp);
        console.log('------------------------------------');
        console.log(lastAllocation.timestamp);
        console.log(trades);
        console.log(transactions);
        console.log('------------------------------------');
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(allocationsArray).then(() => {
      console.log('================== END ALLOCATIONS =========================================');
    });
  };

  return {
    insertAllocation,
    getAllocations,
    sync,
  };
};

module.exports = allocationsController;
