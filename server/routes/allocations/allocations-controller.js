

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

  const getPortfolioAssets = async idParam => repository.find({
    modelName: 'Asset',
    options: {
      where: {
        portfolioId: idParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getTrades = async (portfolioIdParam, timestampParam) => repository.find({
    modelName: 'TradeHistory',
    options: {
      where: {
        portfolioId: portfolioIdParam,
        status: 'FILLED',
        timestamp: {
          [op.gt]: timestampParam,
        },
      },
      order: [['timestamp', 'DESC']],
    },
  })
    .catch(err => console.log(err));

  const getTransactions = async (portfolioIdParam, timestampParam) => repository.find({
    modelName: 'Transaction',
    options: {
      where: {
        portfolioId: portfolioIdParam,
        status: 'SUCCESS',
        txTimestamp: {
          [op.gt]: timestampParam,
        },
      },
      order: [['txTimestamp', 'DESC']],
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
        const assets = await getPortfolioAssets(portfolio.id);
        const trades = await getTrades(portfolio.id, lastAllocation.timestamp);
        const transactions = await getTransactions(portfolio.id, lastAllocation.timestamp);

        // const deposits = transactions.filter(transaction => transaction.type === 'd');
        // const withdraws = transactions.filter(transaction => transaction.type === 'w');
        // const buys = trades.filter(trade => trade.type === 'BUY');
        // const sells = trades.filter(trade => trade.type === 'SELL');

        // const tradesTimestamps = trades.map(trade => trade.timestamp);
        // const transactionsTimestamps = transactions.map(transaction => transaction.txTimestamp);
        // const timestamps = trades.concat(transactions).sort((a, b) => a.getTime() - b.getTime());

        // TODO concat trades and transactions, sort by timestamp (unify txTampstamp),
        // TODO foreact item
        // TODO foreach asset from last (assets) add or remove transaction quantity value (get from weidex by tampstamp)
        transactions.forEach((transaction) => {
          const assetsBreakdownArr = [];
          assets.forEach((asset) => {
            const assetBreakdown = {
              tokenName: asset.tokenName,
              totalETH: asset.totalETH,
              totalUSD: asset.totalUSD,
            };
            assetsBreakdownArr.push(assetBreakdown);
            // calculate current one and add others
            const allocation = {
              portfolioID: portfolio.id,
              triggerType: transaction.type, // SELL BUY d w
              timestamp: transaction.timestamp, // unify
              tokenID: 55, // not needed
              tokenName: transaction.tokenName,
              balance: 234, // { "ETH", asset.totalValueETH +/- transaction.totalValueETH, asset.totalValueUSD +/- transaction.totalValueUSD  
              // !!! if trade calculate both pairs}
            };
          });
        });
        console.log('------------------------------------');
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
