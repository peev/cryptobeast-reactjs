/* eslint-disable no-nested-ternary */
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Transaction';

const transactionController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');
  const Sequelize = require('sequelize');
  const op = Sequelize.Op;

  const getTransactionObject = async transactionHash => repository.findOne({
    modelName,
    options: {
      where: {
        txHash: transactionHash,
      },
    },
  })
    .catch(err => console.log(err));

  const getSortedTransactions = portfolioIdParam =>
    repository.find({
      modelName,
      options: {
        where: {
          portfolioId: portfolioIdParam,
        },
        order: [['txTimestamp', 'ASC']],
      },
    })
      .catch(err => console.log(err));

  const getPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getCurrencyByTokenName = async name => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName: name,
      },
    },
  })
    .catch(err => console.log(err));

  const isFirstDepositCheck = () =>
    repository.findOne({
      modelName,
      options: {
        where: {
          type: 'd',
          isFirstDeposit: true,
        },
      },
    })
      .catch(err => console.log(err));

  const getAllocationBeforeTimestamp = (portfolioId, timestamp) =>
    repository.findOne({
      modelName: 'Allocation',
      options: {
        where: {
          portfolioID: portfolioId,
          timestamp: {
            [op.lte]: timestamp,
          },
        },
        order: [['timestamp', 'ASC']],
      },
    })
      .catch(err => console.log(err));


  const createTransactionObject = (amount, txHash, status, tokenName, type, portfolioId, timestamp, ethValue, ethTotalValue) => {
    let newTransactionObject;
    try {
      newTransactionObject = {
        amount,
        txHash,
        status,
        tokenName,
        type,
        portfolioId,
        txTimestamp: Number(timestamp) * 1000,
        tokenPriceETH: ethValue || 0,
        totalValueETH: ethTotalValue || 0,
        tokenPriceUSD: 0,
        totalValueUSD: 0,
        ETHUSD: 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newTransactionObject;
  };

  const updateAction = async (req, res, id, transactionObject, isSyncing) => {
    const newTransactionData = Object.assign({}, transactionObject, { id });
    await repository.update({ modelName, updatedRecord: newTransactionData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = async (req, res, transactionObject, isSyncing) => {
    await repository.create({ modelName, newObject: transactionObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const syncTransaction = async (req, res) => {
    const tr = req.body;
    try {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(tr.txHash);
      const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await getCurrencyByTokenName(tr.tokenName);
      const ethValue = (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
      const ethTotalValue = await bigNumberService().toNumber(etherScanTransaction.value);
      const transactionObject = createTransactionObject(
        tr.amount, tr.txHash, tr.status, tr.tokenName, tr.type, tr.portfolioId, etherScanTrBlock.timestamp,
        ethValue, ethTotalValue,
      );

      const transaction = await getTransactionObject(tr.txHash);

      if (transaction === null || transaction === undefined) {
        await createAction(req, res, transactionObject, true);
      } else {
        await updateAction(req, res, Number(transaction.id), transactionObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTransaction = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getDeposits = async (req, res, portfolioID, userID) => {
    try {
      const deposits = await weidexService.getUserDepositHttp(userID);
      await Promise.all(deposits.map(async (deposit) => {
        const addPortfolioId = Object.assign({}, deposit, { portfolioId: portfolioID, type: 'd' });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        await syncTransaction(bodyWrapper, res);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getWithDrawls = async (req, res, portfolioID, userID) => {
    try {
      const withdrawls = await weidexService.getUserWithdrawHttp(userID);
      await Promise.all(withdrawls.map(async (withdrawl) => {
        const addPortfolioId = Object.assign({}, withdrawl, { portfolioId: portfolioID, type: 'w' });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        await syncTransaction(bodyWrapper, res);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObjectByAddress(address);
        await getDeposits(req, res, portfolio.id, portfolio.userID);
        await getWithDrawls(req, res, portfolio.id, portfolio.userID);
      } catch (error) {
        console.log(error);
      }
    });
    return Promise.all(portfolioArray).then(() => {
      console.log('================== END TRANSACTIONS ==================');
    });
  };

  const calculatePortfolioValueBeforeTx = async (portfolioId, timestamp) => {
    const allocation = await getAllocationBeforeTimestamp(portfolioId, timestamp);
    return Object.keys(allocation.balance).reduce((previous, key) =>
      bigNumberService().sum(previous, allocation.balance[key].balance), 0);
  };

  const updateTransactionShareParams = async (req, res, tr, isFirstDeposit) => {
    try {
      const totalValueUsd = 0;
      const portfolioValueBeforeTx = (tr.type === 'd') ? (isFirstDeposit) ? 0
        : await calculatePortfolioValueBeforeTx(tr.portfolioId, tr.txTimestamp) :
        await calculatePortfolioValueBeforeTx(tr.portfolioId, tr.txTimestamp);
      const currentSharePriceUSD = (tr.type === 'd') ? (isFirstDeposit) ? 1 : null : null;
      const sharesCreated = (tr.type === 'd') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null;
      const sharesLiquidated = (tr.type === 'w') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null;
      const numSharesBefore = (isFirstDeposit) ? 0 : null;
      const numSharesAfter = bigNumberService().sum(numSharesBefore, sharesCreated);

      const transaction = Object.assign({}, tr, {
        isFirstDeposit,
        portfolioValueBeforeTx,
        currentSharePriceUSD,
        sharesCreated,
        sharesLiquidated,
        numSharesBefore,
        numSharesAfter,
      });

      await updateAction(req, res, Number(tr.id), transaction, true);
    } catch (error) {
      console.log(error);
    }
  };

  const isFirstDepositBool = async (transaction) => {
    const deposit = await isFirstDepositCheck();
    return (deposit === null) || ((deposit !== null) && (deposit.txHash === transaction.txHash));
  };

  const updateResolveAllTransactions = async (req, res, transactions) => {
    let isFirstDeposit = null;
    try {
      await Promise.all(transactions.map(async (transaction, index) => {
        if (index === 0) {
          isFirstDeposit = await isFirstDepositBool(transaction);
        } else {
          isFirstDeposit = (transaction.type === 'd') ? false : null;
        }
        await updateTransactionShareParams(req, res, transaction, isFirstDeposit);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransactions = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObjectByAddress(address);
        const transactions = await getSortedTransactions(portfolio.id);
        await updateResolveAllTransactions(req, res, transactions);
      } catch (error) {
        console.log(error);
      }
    });
    return Promise.all(portfolioArray).then(() => {
      console.log('================== END UPDATE TRANSACTIONS ==================');
      return res.status(200).send('Sync finished');
    });
  };

  return {
    getTransaction,
    sync,
    updateTransactions,
  };
};

module.exports = transactionController;
