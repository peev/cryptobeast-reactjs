/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Transaction';

const transactionController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  const commomService = require('../../services/common-methods-service')();

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

    try {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(tr.txHash);
      const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await intReqService.getCurrencyByTokenName(tr.tokenName);
      const tokenPriceInEth = (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
      const ethTotalValue = (tr.type === 'd') ?
        await bigNumberService.toNumber(etherScanTransaction.value) : bigNumberService.product(tr.amount, tokenPriceInEth);
      const ethUsd = await commomService.getEthToUsd(etherScanTrBlock.timestamp);
      const tokenPriceUSD = bigNumberService.product(tokenPriceInEth, ethUsd);
      const totalValueUSD = commomService.tokenToEthToUsd(tr.amount, tokenPriceInEth, ethUsd);

      const transactionObject = createTransactionObject(
        tr.amount, tr.txHash, tr.status, tr.tokenName, tr.type, tr.portfolioId, etherScanTrBlock.timestamp,
        tokenPriceInEth, ethTotalValue, tokenPriceUSD, totalValueUSD, ethUsd,
      );

      const transactionExist = await intReqService.getTransactionByTxHash(tr.txHash);
      if (transactionExist === null || transactionExist === undefined) {
        await createAction(req, res, transactionObject, true);
      } else {
        await updateAction(req, res, Number(transactionExist.id), transactionObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTransaction = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then(response => res.status(200).send(response))
      .catch(error => res.json(error));
  };

  const getTransactions = (req, res) => {
    const { portfolioId } = req.params;
    repository.find({
      modelName,
      options: {
        where: {
          portfolioId,
        },
        order: [['txTimestamp', 'ASC']],
      },
    })
      .then(response => res.status(200).send(response))
      .catch(error => res.json(error));
  };

  const getDeposits = async (req, res, portfolioId, userID) => {
    try {
      const deposits = await weidexService.getUserDepositHttp(userID);
      await Promise.all(deposits.map(async (deposit) => {
        const addPortfolioId = Object.assign({}, deposit, { portfolioId, type: 'd' });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        await syncTransaction(bodyWrapper, res);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getWithDrawls = async (req, res, portfolioId, userID) => {
    try {
      const withdrawls = await weidexService.getUserWithdrawHttp(userID);
      await Promise.all(withdrawls.map(async (withdrawl) => {
        const addPortfolioId = Object.assign({}, withdrawl, { portfolioId, type: 'w' });
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
        const portfolio = await intReqService.getPortfolioByUserAddress(address);
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
    const deposit = await intReqService.getFirstDepositByPortfolioId(portfolioId);
    return (deposit === null) || ((deposit !== null) && (deposit.txHash === transaction.txHash));
  };

  const calculateAllocationBalance = async (portfolioId, tr) => {
    const timestamp = tr.txTimestamp.getTime();
    const allocation = await intReqService.getAllocationBeforeTimestampByPortfolioId(portfolioId, timestamp);
    if (allocation === null) {
      return 0;
    }
    const tokensValue = allocation.dataValues.balance.map(async (token) => {
      const currency = await intReqService.getCurrencyByTokenName(token.tokenName);
      const tokenPriceInEth = (token.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, timestamp);
      return bigNumberService.product(token.amount, tokenPriceInEth);
    });

    return Promise.all(tokensValue).then(values =>
      values.reduce((acc, obj) => bigNumberService.sum(acc, obj)));
  };

  const calculatePortfolioValueBeforeTx = async (portfolioId, tr, isFirstDeposit, ethUsd) => {
    const allocationBalanceTotal = await calculateAllocationBalance(portfolioId, tr);
    return (isFirstDeposit) ? 0 : commomService.ethToUsd(allocationBalanceTotal, ethUsd);
  };

  const calculateNumSharesBefore = async (txHash, isFirstDeposit, allTransactions, transactionsForUpdate, portfolioId) => {
    if (isFirstDeposit) {
      return 0;
    }
    if (transactionsForUpdate.length === 0) {
      const index = allTransactions.findIndex(tr => tr.txHash === txHash);
      const transaction = await intReqService.getTransactionByPortfolioIdAndTxHash(portfolioId, allTransactions[index - 1].txHash);
      return transaction.numSharesAfter;
    }
    const transaction = transactionsForUpdate[transactionsForUpdate.length - 1];
    return transaction.numSharesAfter;
  };

  const calculateCurrentSharePriceUSD = (isFirstDeposit, portfolioValueBeforeTx, numSharesBefore) =>
    ((isFirstDeposit) ? 1 : bigNumberService.quotient(portfolioValueBeforeTx, numSharesBefore));

  const calculateSharesCreated = (transactionType, totalValueUsd, currentSharePriceUSD) =>
    ((transactionType === 'd') ? bigNumberService.quotient(totalValueUsd, currentSharePriceUSD) : null);

  const calculateSharesLiquidated = (transactionType, totalValueUsd, currentSharePriceUSD) =>
    ((transactionType === 'w') ? bigNumberService.quotient(totalValueUsd, currentSharePriceUSD) : null);

  const calculateNumSharesAfter = (transactionType, isFirstDeposit, numSharesBefore, sharesCreated, sharesLiquidated) => {
    if (transactionType === 'd') {
      return (isFirstDeposit) ? sharesCreated : bigNumberService.sum(numSharesBefore, sharesCreated);
    }
    return bigNumberService.difference(numSharesBefore, sharesLiquidated);
  };

  const updateTransactionsShareParamsArray = async (req, res, portfolioId, transactions, allTransactions) => {
    const transactionsForUpdate = [];
    for (const tr of transactions) {
      const currency = await intReqService.getCurrencyByTokenName(tr.tokenName);
      const tokenPriceInEth = (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, tr.txTimestamp.getTime());
      const ethUsd = await commomService.getEthToUsdMiliseconds(tr.txTimestamp.getTime());
      const totalValueUsd = commomService.tokenToEthToUsd(tr.amount, tokenPriceInEth, ethUsd);

      const isFirstDeposit = await calculateIsFirstDeposit(tr, portfolioId);
      const portfolioValueBeforeTx = await calculatePortfolioValueBeforeTx(portfolioId, tr, isFirstDeposit, ethUsd);
      const numSharesBefore = await calculateNumSharesBefore(tr.txHash, isFirstDeposit, allTransactions, transactionsForUpdate, portfolioId);
      const currentSharePriceUSD = await calculateCurrentSharePriceUSD(isFirstDeposit, portfolioValueBeforeTx, numSharesBefore);
      const sharesCreated = await calculateSharesCreated(tr.type, totalValueUsd, currentSharePriceUSD);
      const sharesLiquidated = await calculateSharesLiquidated(tr.type, totalValueUsd, currentSharePriceUSD);
      const numSharesAfter = await calculateNumSharesAfter(tr.type, isFirstDeposit, numSharesBefore, sharesCreated, sharesLiquidated);

      transactionsForUpdate.push(Object.assign({}, tr, {
        id: tr.id,
        isFirstDeposit,
        portfolioValueBeforeTx,
        numSharesBefore,
        currentSharePriceUSD,
        sharesCreated,
        sharesLiquidated,
        numSharesAfter,
      }));
    }
    return transactionsForUpdate;
  };

  const updateTransactionsShareParams = async (req, res, transactions) => {
    await Promise.all(transactions.map(async transaction =>
      updateAction(req, res, Number(transaction.id), transaction, true)));
  };

  // =========================================================================================

  const updateTransactions = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await intReqService.getPortfolioByUserAddress(address);
        const transactions = await intReqService.getTransactionsByPortfolioIdAsc(portfolio.id);
        const filteredTransactions = transactions.filter(tr => tr.isFirstDeposit === null &&
          // eslint-disable-next-line no-restricted-globals
          (tr.ETHUSD !== null && tr.ETHUSD !== undefined && !isNaN(tr.ETHUSD)));
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
    getTransactions,
    sync,
    updateTransactions,
  };
};

module.exports = transactionController;
