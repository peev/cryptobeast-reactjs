

const allocationsController = (repository) => {
  const modelName = 'Allocation';
  const Sequelize = require('sequelize');
  const bigNumberService = require('../../services/big-number-service');
  const portfolioService = require('../../services/portfolio-service')(repository);
  const op = Sequelize.Op;
  let valueToAddToEth = 0;

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
      raw: true,
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
      raw: true,
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

  const addToEth = (amount) => {
    valueToAddToEth = bigNumberService().sum(valueToAddToEth, amount);
  };

  const removeFromEth = (amount) => {
    valueToAddToEth = bigNumberService().difference(valueToAddToEth, amount);
  };

  const calculateCurrentAssetTotalETH = (transaction, totalAssetObject) => {
    if (totalAssetObject.tokenName === transaction.tokenName) {
      switch (transaction.type) {
        case 'd': return bigNumberService().difference(totalAssetObject.balance, transaction.totalValueETH);
        case 'w': return bigNumberService().sum(totalAssetObject.balance, transaction.totalValueETH);
        case 'BUY':
          if (transaction.tokenName === 'ETH') {
            const transactionBalance = bigNumberService().sum(valueToAddToEth, transaction.priceTotalETH);
            return bigNumberService().difference(transactionBalance, totalAssetObject.balance);
          }
          addToEth(transaction.priceTotalETH);
          return bigNumberService().difference(totalAssetObject.balance, transaction.priceTotalETH);
        case 'SELL':
          if (transaction.tokenName === 'ETH') {
            const transactionBalance = bigNumberService().difference(valueToAddToEth, transaction.priceTotalETH);
            return bigNumberService().sum(totalAssetObject.balance, transactionBalance);
          }
          removeFromEth(transaction.priceTotalETH);
          return bigNumberService().sum(totalAssetObject.balance, transaction.priceTotalETH);
        default: return 0;
      }
    } else {
      if (totalAssetObject.tokenName === 'ETH') {
        return bigNumberService().sum(totalAssetObject.balance, valueToAddToEth);
      }
      return totalAssetObject.balance;
    }
  };

  const sync = async (req, res, addresses) => {
    const allocationsArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObject(address);
        const lastAllocation = await getLastAllocation(portfolio.id);
        const assets = await getPortfolioAssets(portfolio.id);
        const trades = await getTrades(portfolio.id, lastAllocation.timestamp);
        const transactions = await getTransactions(portfolio.id, lastAllocation.timestamp);
        const concat = trades.concat(transactions).sort(((a, b) =>
          (new Date((b.timestamp !== undefined) ? a.timestamp.toString() : b.txTimestamp.toString()).getTime() -
            new Date((a.timestamp !== undefined) ? a.timestamp.toString() : a.txTimestamp.toString()).getTime()
          )
        ));

        let currentAssetBalanceArray = [];
        assets.forEach((asset) => {
          currentAssetBalanceArray.push({
            tokenName: asset.tokenName,
            balance: asset.totalETH,
          });
        });
        console.log('------------------------------------');
        console.log('Starting:');
        console.log(currentAssetBalanceArray);
        console.log(`Total ETH: ${Object.keys(currentAssetBalanceArray).reduce((previous, key) => previous + currentAssetBalanceArray[key].balance, 0)}`);
        console.log('------------------------------------');

        concat.forEach((transaction) => {
          const assetBalanceArray = [];
          currentAssetBalanceArray.forEach((item) => {
            if (item.tokenName !== 'ETH') {
              assetBalanceArray.push({
                tokenName: item.tokenName,
                balance: calculateCurrentAssetTotalETH(transaction, item),
              });
            }
          });
          currentAssetBalanceArray.forEach((item) => {
            if (item.tokenName === 'ETH') {
              assetBalanceArray.push({
                tokenName: item.tokenName,
                balance: calculateCurrentAssetTotalETH(transaction, item),
              });
            }
          });
          valueToAddToEth = 0;
          currentAssetBalanceArray = assetBalanceArray;
          console.log('------------------------------------');
          console.log(`Transaction type: ${transaction.type}`);
          console.log(`Transaction type: ${transaction.timestamp} ${transaction.txTimestamp}`);
          console.log(assetBalanceArray);
          console.log(`Total ETH: ${Object.keys(assetBalanceArray).reduce((previous, key) => previous + assetBalanceArray[key].balance, 0)}`);
          console.log('------------------------------------');
        });
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
