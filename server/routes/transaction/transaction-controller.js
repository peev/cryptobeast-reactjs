/* eslint-disable no-nested-ternary */
const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Transaction';

const transactionController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');

  const getTransactionObject = async transactionHash => repository.findOne({
    modelName,
    options: {
      where: {
        txHash: transactionHash,
      },
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

  const createTransactionObject =
    (
      req, timestamp, ethValue, ethTotalValue, isFirstDepositParam, portfolioValueBeforeTxParam, currentSharePriceUSDParam,
      sharesCreatedParam, sharesLiquidatedParam, numSharesBeforeParam, numSharesAfterParam,
    ) => {
      let newTransactionObject;
      try {
        newTransactionObject = {
          amount: req.amount,
          txHash: req.txHash,
          status: req.status,
          tokenName: req.tokenName,
          type: req.type,
          portfolioId: req.portfolioId,
          txTimestamp: Number(timestamp) * 1000,
          tokenPriceETH: ethValue || 0,
          totalValueETH: ethTotalValue || 0,
          tokenPriceUSD: 0,
          totalValueUSD: 0,
          ETHUSD: 0,
          isFirstDeposit: isFirstDepositParam,
          portfolioValueBeforeTx: portfolioValueBeforeTxParam,
          currentSharePriceUSD: currentSharePriceUSDParam,
          sharesCreated: sharesCreatedParam,
          sharesLiquidated: sharesLiquidatedParam,
          numSharesBefore: numSharesBeforeParam,
          numSharesAfter: numSharesAfterParam,
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

  const createTransaction = async (req, res) => {
    try {
      const transactionData = req.body;
      const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
      const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await getCurrencyByTokenName(transactionData.tokenName);
      const ethValue = (transactionData.tokenName === 'ETH') ? 1 : await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTransactionBlock.timestamp));
      const ethTotalValue = await bigNumberService().toNumber(etherScanTransaction.value);
      const transactionObject = createTransactionObject(transactionData, etherScanTransactionBlock.timestamp, ethValue, ethTotalValue);
      const transaction = await getTransactionObject(transactionData.txHash);
      if (transaction === null || transaction === undefined) {
        return createAction(req, res, transactionObject, false);
      }
      return updateAction(req, res, Number(transaction.id), transactionObject, false);
    } catch (error) {
      console.log(error);
    }
  };

  const syncTransaction = async (req, res) => {
    const transactionData = req.body;
    try {
      // TODO
      const totalValueUsd = 0;

      const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
      const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await getCurrencyByTokenName(transactionData.tokenName);
      const ethValue = (transactionData.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTransactionBlock.timestamp));
      const ethTotalValue = await bigNumberService().toNumber(etherScanTransaction.value);
    
      const isFirstDeposit = (transactionData.type === 'd') ? await isFirstDepositCheck() === null : null;
      // TODO
      const portfolioValueBeforeTx = (isFirstDeposit) ? 0 : null;
      // TODO
      const currentSharePriceUSD = (isFirstDeposit) ? 1 : null;
      // TODO
      const sharesCreated = (transactionData.type === 'd') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null;
      // TODO
      const sharesLiquidated = (transactionData.type === 'w') ? bigNumberService().quotient(totalValueUsd, currentSharePriceUSD) : null;
      // TODO
      const numSharesBefore = (isFirstDeposit) ? 0 : null;
      // TODO
      const numSharesAfter = bigNumberService().sum(numSharesBefore, sharesCreated);

      const transactionObject =
        createTransactionObject(
          transactionData, etherScanTransactionBlock.timestamp, ethValue, ethTotalValue,
          isFirstDeposit, portfolioValueBeforeTx, currentSharePriceUSD, currentSharePriceUSD, sharesCreated, sharesLiquidated,
          numSharesBefore, numSharesAfter,
        );
      const transaction = await getTransactionObject(transactionData.txHash);

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

  const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const transactionData = req.body;
    try {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
      const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const currency = await getCurrencyByTokenName(transactionData.tokenName);
      const ethValue = (transactionData.tokenName === 'ETH') ? 1 : await weidexService.getTokenPriceByTimestamp(currency.tokenId, Number(etherScanTransactionBlock.timestamp));
      const ethTotalValue = await bigNumberService().toNumber(etherScanTransaction.value);
      const transactionObject = createTransactionObject(transactionData, etherScanTransactionBlock.timestamp, ethValue, ethTotalValue);

      await updateAction(req, res, Number(id), transactionObject, false);
    } catch (error) {
      console.log(error);
    }
  };

  const removeTransaction = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sortByTimestamp = array => array.sort(((a, b) =>
    (new Date((a.timestamp !== undefined) ? a.timestamp.toString() : a.txTimestamp.toString()).getTime() -
    new Date((b.timestamp !== undefined) ? b.timestamp.toString() : b.txTimestamp.toString()).getTime())
  ));

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

  return {
    createTransaction,
    getTransaction,
    updateTransaction,
    removeTransaction,
    sync,
  };
};

module.exports = transactionController;
