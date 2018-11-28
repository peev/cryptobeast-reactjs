const allocationsController = (repository) => {
  const modelName = 'Allocation';
  const Sequelize = require('sequelize');
  const bigNumberService = require('../../services/big-number-service');
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

  const sortByTimestampReverse = array => array.sort(((a, b) =>
    (new Date((b.timestamp !== undefined) ? b.timestamp.toString() : b.txTimestamp.toString()).getTime() -
    new Date((a.timestamp !== undefined) ? a.timestamp.toString() : a.txTimestamp.toString()).getTime())
  ));

  const sortByTimestamp = array => array.sort(((a, b) =>
    (new Date((a.timestamp !== undefined) ? a.timestamp.toString() : a.txTimestamp.toString()).getTime() -
    new Date((b.timestamp !== undefined) ? b.timestamp.toString() : b.txTimestamp.toString()).getTime())
  ));

  const getAllocations = (req, res) => {
    const { portfolioId } = req.params;
    repository.find({
      modelName,
      options: {
        where: {
          portfolioID: portfolioId,
        },
      },
    })
      .then((response) => {
        res.status(200).send(sortByTimestamp(response));
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createAllocationObject = (portfolioId, allocation, balanceArray) => {
    let allocationObject;
    try {
      allocationObject = {
        portfolioID: portfolioId,
        triggerType: allocation.type,
        timestamp: (allocation.timestamp !== undefined) ? allocation.timestamp : allocation.txTimestamp,
        txHash: allocation.txHash,
        tokenName: allocation.tokenName,
        balance: balanceArray,
      };
    } catch (error) {
      console.log(error);
    }
    return allocationObject;
  };

  const createAction = async (req, res, allocationObject, isSyncing) =>
    repository.create({ modelName, newObject: allocationObject })
      .then(response => (isSyncing ? response : res.status(200).send({
        status: 'success',
      })))
      .catch(error => (isSyncing ? console.log(error) : res.status(500).send({
        status: 'fail',
        error,
      })));

  const insertAllocation = async (req, res) => {
    const allocation = req.body;
    createAction(req, res, allocation, false);
  };

  const addToEth = (amount) => {
    valueToAddToEth = bigNumberService().sum(valueToAddToEth, amount);
  };

  const removeFromEth = (amount) => {
    valueToAddToEth = bigNumberService().difference(valueToAddToEth, amount);
  };

  const handleBuyTrade = (transaction, totalAssetObject) => {
    if (transaction.tokenName === 'ETH') {
      const transactionBalance = bigNumberService().sum(valueToAddToEth, transaction.priceTotalETH);
      return bigNumberService().difference(transactionBalance, totalAssetObject.balance);
    }
    addToEth(transaction.priceTotalETH);
    return bigNumberService().difference(totalAssetObject.balance, transaction.priceTotalETH);
  };

  const handleSellTrade = (transaction, totalAssetObject) => {
    if (transaction.tokenName === 'ETH') {
      const transactionBalance = bigNumberService().difference(valueToAddToEth, transaction.priceTotalETH);
      return bigNumberService().sum(totalAssetObject.balance, transactionBalance);
    }
    removeFromEth(transaction.priceTotalETH);
    return bigNumberService().sum(totalAssetObject.balance, transaction.priceTotalETH);
  };

  const handleBuyTradeNew = (transaction, totalAssetObject) => {
    if (transaction.tokenName === 'ETH') {
      const transactionBalance = bigNumberService().difference(valueToAddToEth, transaction.priceTotalETH);
      return bigNumberService().sum(transactionBalance, totalAssetObject.balance);
    }
    removeFromEth(transaction.priceTotalETH);
    return bigNumberService().sum(totalAssetObject.balance, transaction.priceTotalETH);
  };

  const handleSellTradeNew = (transaction, totalAssetObject) => {
    if (transaction.tokenName === 'ETH') {
      const transactionBalance = bigNumberService().sum(valueToAddToEth, transaction.priceTotalETH);
      return bigNumberService().difference(totalAssetObject.balance, transactionBalance);
    }
    addToEth(transaction.priceTotalETH);
    return bigNumberService().difference(totalAssetObject.balance, transaction.priceTotalETH);
  };

  const handleSameBalance = (totalAssetObject) => {
    if (totalAssetObject.tokenName === 'ETH') {
      return bigNumberService().sum(totalAssetObject.balance, valueToAddToEth);
    }
    return totalAssetObject.balance;
  };

  const handleSameAmount = (totalAssetObject) => {
    if (totalAssetObject.tokenName === 'ETH') {
      return bigNumberService().sum(totalAssetObject.amount, valueToAddToEth);
    }
    return totalAssetObject.amount;
  };

  const calculateCurrentAssetTotalETH = (transaction, totalAssetObject) => {
    if (totalAssetObject.tokenName === transaction.tokenName) {
      switch (transaction.type) {
        case 'd': return bigNumberService().difference(totalAssetObject.balance, transaction.totalValueETH);
        case 'w': return bigNumberService().sum(totalAssetObject.balance, transaction.totalValueETH);
        case 'BUY': return handleBuyTrade(transaction, totalAssetObject);
        case 'SELL': return handleSellTrade(transaction, totalAssetObject);
        default: return 0;
      }
    } else {
      return handleSameBalance(totalAssetObject);
    }
  };

  const calculateCurrentAssetTotalETHNew = (transaction, totalAssetObject) => {
    if (totalAssetObject.tokenName === transaction.tokenName) {
      switch (transaction.type) {
        case 'd': return bigNumberService().sum(totalAssetObject.balance, transaction.totalValueETH);
        case 'w': return bigNumberService().difference(totalAssetObject.balance, transaction.totalValueETH);
        case 'BUY': return handleBuyTradeNew(transaction, totalAssetObject);
        case 'SELL': return handleSellTradeNew(transaction, totalAssetObject);
        default: return 0;
      }
    } else {
      return handleSameBalance(totalAssetObject);
    }
  };

  const calculateCurrentAssetAmount = (transaction, totalAssetObject) => {
    if (totalAssetObject.tokenName === transaction.tokenName) {
      switch (transaction.type) {
        case 'd': return bigNumberService().sum(totalAssetObject.amount, transaction.amount);
        case 'w': return bigNumberService().difference(totalAssetObject.amount, transaction.amount);
        case 'BUY': return bigNumberService().sum(totalAssetObject.amount, transaction.amount);
        case 'SELL': return bigNumberService().difference(totalAssetObject.amount, transaction.amount);
        default: return 0;
      }
    } else {
      return handleSameAmount(totalAssetObject);
    }
  };

  const fillCurrentAssetBalanceArray = (currentAssetBalanceArray, assets) => {
    assets.forEach((asset) => {
      currentAssetBalanceArray.push({
        tokenName: asset.tokenName,
        balance: asset.totalETH,
      });
    });
    return currentAssetBalanceArray;
  };

  const fillCurrentAssetBalanceArrayNew = (currentAssetBalanceArray, assets) => {
    assets.forEach((asset) => {
      currentAssetBalanceArray.push({
        tokenName: asset.tokenName,
        balance: 0,
        amount: 0,
      });
    });
    return currentAssetBalanceArray;
  };


  const syncAllocations = async (req, res, resultArray) => {
    try {
      await Promise.all(resultArray.map(async (allocation) => {
        await createAction(req, res, allocation, true);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const newSync = async (req, res) => {
    const address = req.body;
    console.log('------------------------------------');
    console.log(address);
    console.log('------------------------------------');
    const portfolio = await getPortfolioObject(address);
    const lastAllocation = await getLastAllocation(portfolio.id);
    const lastAllocationTimestamp = (lastAllocation !== null && lastAllocation !== undefined) ? lastAllocation.timestamp : 0;
    const assets = await getPortfolioAssets(portfolio.id);
    const trades = await getTrades(portfolio.id, 0);
    const transactions = await getTransactions(portfolio.id, 0);
    const transactionsAndTrades = await trades.concat(transactions);
    const transactionsAndTradesSorted = await sortByTimestamp(transactionsAndTrades);
    let currentAssetBalanceArray = [];
    currentAssetBalanceArray = fillCurrentAssetBalanceArrayNew(currentAssetBalanceArray, assets);

    const resultArray = [];
    transactionsAndTradesSorted.map((transaction, index) => {
      const currentAssetBalanceArrayNoEth = currentAssetBalanceArray.filter(item => item.tokenName !== 'ETH');
      const currentAssetBalanceArrayOnlyEth = currentAssetBalanceArray.filter(item => item.tokenName === 'ETH');
      let assetBalanceArray = [];
      if (index === transactionsAndTradesSorted.length - 1) {
        assetBalanceArray = currentAssetBalanceArray;
      } else {
        currentAssetBalanceArrayNoEth.forEach((item) => {
          assetBalanceArray.push({
            tokenName: item.tokenName,
            balance: calculateCurrentAssetTotalETHNew(transactionsAndTradesSorted[index], item),
            amount: calculateCurrentAssetAmount(transactionsAndTradesSorted[index], item),
          });
        });
        currentAssetBalanceArrayOnlyEth.forEach((item) => {
          assetBalanceArray.push({
            tokenName: item.tokenName,
            balance: calculateCurrentAssetTotalETHNew(transactionsAndTradesSorted[index], item),
            amount: calculateCurrentAssetAmount(transactionsAndTradesSorted[index], item),
          });
        });
      }
      valueToAddToEth = 0;
      currentAssetBalanceArray = assetBalanceArray;
      const allocation = createAllocationObject(portfolio.id, transaction, assetBalanceArray);
      resultArray.push(allocation);
    });
    res.status(200).send(resultArray);
  };

  const sync = async (req, res, addresses) => {
    const allocationsArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObject(address);
        const lastAllocation = await getLastAllocation(portfolio.id);
        const lastAllocationTimestamp = (lastAllocation !== null && lastAllocation !== undefined) ? lastAllocation.timestamp : 0;
        const assets = await getPortfolioAssets(portfolio.id);
        const trades = await getTrades(portfolio.id, lastAllocationTimestamp);
        const transactions = await getTransactions(portfolio.id, lastAllocationTimestamp);
        const transactionsAndTrades = trades.concat(transactions);
        const transactionsAndTradesSorted = sortByTimestampReverse(transactionsAndTrades);
        let currentAssetBalanceArray = [];
        currentAssetBalanceArray = fillCurrentAssetBalanceArray(currentAssetBalanceArray, assets);

        // console.log('------------------------------------');
        // console.log('Starting:');
        // console.log(currentAssetBalanceArray);
        // console.log(`Total ETH: ${Object.keys(currentAssetBalanceArray).reduce((previous, key) => previous + currentAssetBalanceArray[key].balance, 0)}`);
        // console.log('------------------------------------');

        const resultArray = [];
        await transactionsAndTradesSorted.map(async (transaction, index) => {
          const currentAssetBalanceArrayNoEth = currentAssetBalanceArray.filter(item => item.tokenName !== 'ETH');
          const currentAssetBalanceArrayOnlyEth = currentAssetBalanceArray.filter(item => item.tokenName === 'ETH');
          let assetBalanceArray = [];
          if (index === 0) {
            assetBalanceArray = currentAssetBalanceArray;
          } else {
            currentAssetBalanceArrayNoEth.forEach((item) => {
              assetBalanceArray.push({
                tokenName: item.tokenName,
                balance: calculateCurrentAssetTotalETH(transactionsAndTradesSorted[index - 1], item),
              });
            });
            currentAssetBalanceArrayOnlyEth.forEach((item) => {
              assetBalanceArray.push({
                tokenName: item.tokenName,
                balance: calculateCurrentAssetTotalETH(transactionsAndTradesSorted[index - 1], item),
              });
            });
          }
          valueToAddToEth = 0;
          currentAssetBalanceArray = assetBalanceArray;
          // console.log('------------------------------------');
          // console.log(`Transaction type: ${transaction.type}`);
          // console.log(`Transaction type: ${transaction.timestamp} ${transaction.txTimestamp}`);
          // console.log(assetBalanceArray);
          // console.log(`Total ETH: ${Object.keys(assetBalanceArray).reduce((previous, key) => previous + assetBalanceArray[key].balance, 0)}`);
          // console.log('------------------------------------');
          const allocation = createAllocationObject(portfolio.id, transaction, assetBalanceArray);
          resultArray.push(allocation);
        });

        await syncAllocations(req, res, sortByTimestamp(resultArray));
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    });
    await Promise.all(allocationsArray).then(() => {
      console.log('================== END ALLOCATIONS =========================================');
    })
      .catch(err => res.status(500).send(err));
  };

  return {
    insertAllocation,
    getAllocations,
    sync,
    newSync,
  };
};

module.exports = allocationsController;
