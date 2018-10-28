const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Transaction';

const transactionController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

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

  const createTransactionObject = async (req, timestamp, ethValue) => {
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
        tokenPriceETH: Number(ethValue) || 0,
        totalValueETH: req.amount * Number(ethValue) || 0,
        tokenPriceUSD: null,
        totalValueUSD: null,
        ETHUSD: null,
      };
    } catch (error) {
      console.log(error);
    }
    return newTransactionObject;
  };

  const updateAction = (req, res, id, transactionObject, isSyncing) => {
    const newTransactionData = Object.assign({}, transactionObject, { id });
    repository.update({ modelName, updatedRecord: newTransactionData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, transactionObject, isSyncing) => {
    repository.create({ modelName, newObject: transactionObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createTransaction = async (req, res) => {
    const transactionData = req.body;

    const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const currency = await getCurrencyByTokenName(transactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(currency.tokenId, etherScanTransactionBlock.timestamp);
    const transactionObject = await createTransactionObject(transactionData, etherScanTransactionBlock.timestamp, ethValue);

    try {
      const transaction = await getTransactionObject(transactionData.txHash);
      if (transaction === null) {
        await createAction(req, res, transactionObject, false);
      } else {
        await updateAction(req, res, Number(transaction.id), transactionObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncTransaction = async (req, res) => {
    const transactionData = req.body;

    const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const currency = await getCurrencyByTokenName(transactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(currency.tokenId, Number(etherScanTransactionBlock.timestamp));
    const transactionObject = await createTransactionObject(transactionData, etherScanTransactionBlock.timestamp, ethValue);

    try {
      const transaction = await getTransactionObject(transactionData.txHash);
      if (transaction === null) {
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

    const etherScanTransaction = await etherScanServices().getTransactionByHash(transactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const currency = await getCurrencyByTokenName(transactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(currency.tokenId, Number(etherScanTransactionBlock.timestamp));
    const transactionObject = await createTransactionObject(transactionData, etherScanTransactionBlock.timestamp, ethValue);

    updateAction(req, res, Number(id), transactionObject, false);
  };

  const removeTransaction = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, addresses) => {
    addresses.map(async (address) => {
      try {
        const portfolio = await getPortfolioObjectByAddress(address);
        const deposits = await WeidexService.getUserDeposit(portfolio.userID)
          .then(data => data.json())
          .catch(error => console.log(error));
        const withdrawls = await WeidexService.getUserWithdraw(portfolio.userID)
          .then(data => data.json())
          .catch(error => console.log(error));

        deposits.map(async (deposit) => {
          const addPortfolioId = Object.assign({}, deposit, { portfolioId: portfolio.id, type: 'd' });
          const bodyWrapper = Object.assign({ body: addPortfolioId });
          await syncTransaction(bodyWrapper, res);
        });
        withdrawls.map(async (withdrawl) => {
          const addPortfolioId = Object.assign({}, withdrawl, { portfolioId: portfolio.id, type: 'w' });
          const bodyWrapper = Object.assign({ body: addPortfolioId });
          await syncTransaction(bodyWrapper, res);
        });
      } catch (error) {
        console.log(error);
      }
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
