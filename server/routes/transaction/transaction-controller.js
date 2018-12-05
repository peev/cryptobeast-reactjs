const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Transaction';

const transactionController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');
  const Sequelize = require('sequelize');
  const weidexFiatMsService = require('../../services/weidex-fiat-ms-service');
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

  const isFirstDepositCheck = portfolioId =>
    repository.findOne({
      modelName,
      options: {
        where: {
          portfolioId,
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

  const getTransactionByHash = (portfolioId, txHash) =>
    repository.findOne({
      modelName,
      options: {
        where: {
          portfolioId,
          txHash,
        },
      },
    })
      .catch(err => console.log(err));

  const getCurrencyByTokenName = async tokenName => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName,
      },
    },
  })
    .catch(err => console.log(err));

  const getEthToUsd = async timestamp =>
    weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp)).then(data => data.priceUSD);

  const tokenToEthToUsd = (amount, tokenPriceEth, ethToUsd) =>
    bigNumberService().product(bigNumberService().product(bigNumberService().gweiToEth(amount), tokenPriceEth), ethToUsd);

  const createTransactionObject = (
    amount, txHash, status, tokenName, type, portfolioId, timestamp, tokenPriceETH, totalValueETH,
    tokenPriceUSD, totalValueUSD, ETHUSD,
  ) => {
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
        tokenPriceETH: tokenPriceETH || 0,
        totalValueETH: totalValueETH || 0,
        tokenPriceUSD: tokenPriceUSD || 0,
        totalValueUSD: totalValueUSD || 0,
        ETHUSD: ETHUSD || 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newTransactionObject;
  };

  const updateAction = async (req, res, id, transactionObject, isSyncing) => {
    const newTransactionData = Object.assign({}, transactionObject, { id });
    await repository.update({ modelName, updatedRecord: newTransactionData })
      .then(response => (isSyncing ? response : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = async (req, res, transactionObject, isSyncing) => {
    await repository.create({ modelName, newObject: transactionObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const syncTransaction = async (req, res) => {
    const tr = req.body;
    const transaction = await getTransactionObject(tr.txHash);
    if (transaction === null || transaction === undefined) {
      try {
        const etherScanTransaction = await etherScanServices().getTransactionByHash(tr.txHash);
        const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
        const currency = await getCurrencyByTokenName(tr.tokenName);
        const tokenPriceInEth = (tr.tokenName === 'ETH') ? 1 :
          await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
        const ethTotalValue = (tr.type === 'd') ?
          await bigNumberService().toNumber(etherScanTransaction.value) : bigNumberService().product(tr.amount, tokenPriceInEth);
        const ethUsd = await getEthToUsd(Number(etherScanTrBlock.timestamp) * 1000);
        const tokenPriceUSD = bigNumberService().product(tokenPriceInEth, ethUsd);
        const totalValueUSD = tokenToEthToUsd(tr.amount, tokenPriceInEth, ethUsd);

        const transactionObject = createTransactionObject(
          tr.amount, tr.txHash, tr.status, tr.tokenName, tr.type, tr.portfolioId, etherScanTrBlock.timestamp,
          tokenPriceInEth, ethTotalValue, tokenPriceUSD, totalValueUSD, ethUsd,
        );
        await createAction(req, res, transactionObject, true);
      } catch (error) {
        console.log(error);
      }
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

  // =========================================================================================

  const calculateIsFirstDeposit = async (transaction, portfolioId) => {
    const deposit = await isFirstDepositCheck(portfolioId);
    return (deposit === null) || ((deposit !== null) && (deposit.txHash === transaction.txHash));
  };

  const calculateAllocationBalance = async (portfolioId) => {
    const timestamp = new Date().getTime();
    const allocation = await getAllocationBeforeTimestamp(portfolioId, timestamp);
    const tokensValue = allocation.balance.map(async (token) => {
      const currency = await getCurrencyByTokenName(token.tokenName);
      const tokenPriceInEth = (token.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, timestamp);
      return bigNumberService().product(token.amount, tokenPriceInEth);
    });

    return Promise.all(tokensValue).then(values =>
      values.reduce((acc, obj) => bigNumberService().sum(acc, obj)));
  };

  const calculatePortfolioValueBeforeTx = async (portfolioId, tr, isFirstDeposit, ethUsd) => {
    if (tr.type === 'd') {
      return (isFirstDeposit) ? 0 :
        Number(bigNumberService().product(bigNumberService().gweiToEth(await calculateAllocationBalance(portfolioId)), ethUsd));
    }
    return Number(bigNumberService().product(bigNumberService().gweiToEth(await calculateAllocationBalance(portfolioId)), ethUsd));
  };

  const calculateNumSharesBefore = async (txHash, isFirstDeposit, allTransactions, portfolioId) => {
    if (isFirstDeposit) {
      return 0;
    }
    const index = allTransactions.findIndex(tr => tr.txHash === txHash);
    const transaction = await getTransactionByHash(portfolioId, allTransactions[index - 1].txHash);
    return transaction.numSharesAfter;
  };

  const calculateCurrentSharePriceUSD = (isFirstDeposit, portfolioValueBeforeTx, numSharesBefore) =>
    ((isFirstDeposit) ? 1 : bigNumberService().quotient(portfolioValueBeforeTx, numSharesBefore));

  const calculateSharesCreated = (transactionType, totalValueUsd, currentSharePriceUSD) =>
    ((transactionType === 'd') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null);

  const calculateSharesLiquidated = (transactionType, totalValueUsd, currentSharePriceUSD) =>
    ((transactionType === 'w') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null);

  const calculateNumSharesAfter = (transactionType, isFirstDeposit, numSharesBefore, sharesCreated, sharesLiquidated) => {
    if (transactionType === 'd') {
      return (isFirstDeposit) ? sharesCreated : bigNumberService().sum(numSharesBefore, sharesCreated);
    }
    return bigNumberService().difference(numSharesBefore, sharesLiquidated);
  };

  const updateTransactionsShareParamsArray = async (req, res, portfolioId, transactions, allTransactions) =>
    Promise.all(transactions.map(async (tr) => {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(tr.txHash);
      const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await getCurrencyByTokenName(tr.tokenName);
      const tokenPriceInEth = (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
      const timestamp = new Date().getTime();
      const ethUsd = await getEthToUsd(Number(etherScanTrBlock.timestamp) * 1000);
      const ethUsdNow = await getEthToUsd(timestamp);
      const totalValueUsd = tokenToEthToUsd(tr.amount, tokenPriceInEth, ethUsd);

      const isFirstDeposit = await calculateIsFirstDeposit(tr, portfolioId);
      const portfolioValueBeforeTx = await calculatePortfolioValueBeforeTx(portfolioId, tr, isFirstDeposit, ethUsdNow);
      const numSharesBefore = await calculateNumSharesBefore(tr.txHash, isFirstDeposit, allTransactions, portfolioId);
      const currentSharePriceUSD = await calculateCurrentSharePriceUSD(isFirstDeposit, portfolioValueBeforeTx, numSharesBefore);
      const sharesCreated = await calculateSharesCreated(tr.type, totalValueUsd, currentSharePriceUSD);
      const sharesLiquidated = await calculateSharesLiquidated(tr.type, totalValueUsd, currentSharePriceUSD);
      const numSharesAfter = await calculateNumSharesAfter(tr.type, isFirstDeposit, numSharesBefore, sharesCreated, sharesLiquidated);

      return Object.assign({}, tr, {
        id: tr.id,
        isFirstDeposit,
        portfolioValueBeforeTx,
        numSharesBefore,
        currentSharePriceUSD,
        sharesCreated,
        sharesLiquidated,
        numSharesAfter,
      });
    }));

  const updateTransactionsShareParams = async (req, res, transactions) => {
    await Promise.all(transactions.map(async transaction =>
      updateAction(req, res, Number(transaction.id), transaction, true)));
  };

  // =========================================================================================

  const updateTransactions = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObjectByAddress(address);
        const transactions = await getSortedTransactions(portfolio.id);
        const filteredTransactions = transactions.filter(tr => tr.isFirstDeposit === null);
        if (filteredTransactions.length && filteredTransactions.length > 0) {
          const firstDeposit = await updateTransactionsShareParamsArray(req, res, portfolio.id, [filteredTransactions[0]], transactions);
          await updateTransactionsShareParams(req, res, firstDeposit);
          const updatedTransactions = await updateTransactionsShareParamsArray(req, res, portfolio.id, filteredTransactions, transactions);
          await updateTransactionsShareParams(req, res, updatedTransactions);
        }
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
