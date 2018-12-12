const allocationsController = (repository) => {
  const modelName = 'Allocation';
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  let valueToAddToEth = 0;

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
          portfolioId,
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
        portfolioId,
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

  const addToEth = (amount) => {
    valueToAddToEth = bigNumberService.sum(valueToAddToEth, amount);
  };

  const removeFromEth = (amount) => {
    valueToAddToEth = bigNumberService.difference(valueToAddToEth, amount);
  };

  const handleBuyTradeAmount = (transaction, totalAssetObject) => {
    if (transaction.isMaker) {
      const fee = bigNumberService.quotient(transaction.priceTotalETH, 1000);
      const totalPlusFee = bigNumberService.sum(transaction.priceTotalETH, fee);
      removeFromEth(totalPlusFee);
      return bigNumberService.sum(totalAssetObject.amount, transaction.amount);
    }
    const fee = bigNumberService.quotient(transaction.amount, 1000);
    const totalMinusFee = bigNumberService.difference(transaction.amount, fee);
    removeFromEth(transaction.priceTotalETH);
    return bigNumberService.sum(totalAssetObject.amount, totalMinusFee);
  };

  const handleSellTradeAmount = (transaction, totalAssetObject) => {
    if (transaction.isMaker) {
      const fee = bigNumberService.quotient(transaction.priceTotalETH, 1000);
      const totalMinusFee = bigNumberService.difference(transaction.priceTotalETH, fee);
      addToEth(totalMinusFee);
      return bigNumberService.difference(totalAssetObject.amount, transaction.amount);
    }
    const fee = bigNumberService.quotient(transaction.amount, 1000);
    const totalPlusFee = bigNumberService.sum(transaction.amount, fee);
    addToEth(transaction.priceTotalETH);
    return bigNumberService.difference(totalAssetObject.amount, totalPlusFee);
  };

  const handleSameAmount = (totalAssetObject) => {
    if (totalAssetObject.tokenName === 'ETH') {
      return bigNumberService.sum(totalAssetObject.amount, valueToAddToEth);
    }
    return totalAssetObject.amount;
  };

  const calculateCurrentAssetAmount = (transaction, totalAssetObject) => {
    if (totalAssetObject.tokenName === transaction.tokenName) {
      switch (transaction.type) {
        case 'd': return bigNumberService.sum(totalAssetObject.amount, transaction.amount);
        case 'w': return bigNumberService.difference(totalAssetObject.amount, transaction.amount);
        case 'BUY': return handleBuyTradeAmount(transaction, totalAssetObject);
        case 'SELL': return handleSellTradeAmount(transaction, totalAssetObject);
        default: return 0;
      }
    } else {
      return handleSameAmount(totalAssetObject);
    }
  };

  const fillCurrentAssetBalanceArray = (assets, lastAllocation) => {
    const result = [];
    if (lastAllocation !== null && lastAllocation !== undefined) {
      assets.forEach((asset) => {
        lastAllocation.balance.forEach((balanceItem) => {
          if (asset.tokenName === balanceItem.tokenName) {
            result.push({
              tokenName: balanceItem.tokenName,
              amount: balanceItem.amount,
            });
          }
        });
      });
    } else {
      assets.forEach((asset) => {
        result.push({
          tokenName: asset.tokenName,
          amount: 0,
        });
      });
    }
    return result;
  };

    /**
   * Creates balance amounts arr object. Add eth at the end in order to calculate properly.
   * @param {*} transactionsAndTradesSorted
   * @param {*} currentAssetBalanceArrayNoEth
   * @param {*} currentAssetBalanceArrayOnlyEth
   * @param {*} index
   */
  const defineAssetsBalanceArr = (
    transactionsAndTradesSorted, currentAssetBalanceArrayNoEth,
    currentAssetBalanceArrayOnlyEth, index,
  ) => {
    const result = [];
    currentAssetBalanceArrayNoEth.forEach((item) => {
      result.push({
        tokenName: item.tokenName,
        amount: calculateCurrentAssetAmount(transactionsAndTradesSorted[index], item),
      });
    });
    currentAssetBalanceArrayOnlyEth.forEach((item) => {
      result.push({
        tokenName: item.tokenName,
        amount: calculateCurrentAssetAmount(transactionsAndTradesSorted[index], item),
      });
    });
    return result;
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

  const sync = async (req, res, addresses) => {
    const allocationsArray = addresses.map(async (address) => {
      try {
        const portfolio = await intReqService.getPortfolioByUserAddress(address);
        const lastAllocation = await intReqService.getLastAllocationByPortfolioId(portfolio.id);
        const lastAllocationTimestamp = (lastAllocation !== null && lastAllocation !== undefined) ? lastAllocation.timestamp : 0;
        const assets = await intReqService.getAssetsByPortfolioId(portfolio.id);
        const trades = await intReqService.getTradesByPortfolioIdGreaterThanTimestampDesc(portfolio.id, lastAllocationTimestamp);
        const transactions = await intReqService.getTransactionsByPortfolioIdGreaterThanTimestampDesc(portfolio.id, lastAllocationTimestamp);
        const transactionsAndTrades = await trades.concat(transactions);
        const transactionsAndTradesSorted = await sortByTimestamp(transactionsAndTrades);
        let currentAssetBalanceArray = fillCurrentAssetBalanceArray(assets, lastAllocation);
        const resultArray = [];

        transactionsAndTradesSorted.map((transaction, index) => {
          const currentAssetBalanceArrayNoEth = currentAssetBalanceArray.filter(item => item.tokenName !== 'ETH');
          const currentAssetBalanceArrayOnlyEth = currentAssetBalanceArray.filter(item => item.tokenName === 'ETH');
          const assetBalanceArray = defineAssetsBalanceArr(
            transactionsAndTradesSorted, currentAssetBalanceArrayNoEth,
            currentAssetBalanceArrayOnlyEth, index,
          );
          valueToAddToEth = 0;
          currentAssetBalanceArray = assetBalanceArray;
          const allocation = createAllocationObject(portfolio.id, transaction, assetBalanceArray);
          return resultArray.push(allocation);
        });

        return await syncAllocations(req, res, sortByTimestamp(resultArray));
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
    getAllocations,
    sync,
  };
};

module.exports = allocationsController;
