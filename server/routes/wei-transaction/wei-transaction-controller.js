const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'WeiTransaction';

const weiTransactionController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const getWeiTransactionObject = async transactionHash => repository.findOne({
    modelName,
    options: {
      where: {
        txHash: transactionHash,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'WeiPortfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiCurrencyByTokenName = async name => repository.findOne({
    modelName: 'WeiCurrency',
    options: {
      where: {
        tokenName: name,
      },
    },
  })
    .catch(err => console.log(err));

  const createWeiTransactionObject = async (req, timestamp, ethValue) => {
    let newTransactionObject;
    try {
      newTransactionObject = {
        amount: req.amount,
        txHash: req.txHash,
        status: req.status,
        tokenName: req.tokenName,
        type: req.type,
        weiPortfolioId: req.weiPortfolioId,
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

  const updateAction = (req, res, id, weiTransactionObject, isSyncing) => {
    const newWeiTransactionData = Object.assign({}, weiTransactionObject, { id });
    repository.update({ modelName, updatedRecord: newWeiTransactionData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, weiTransactionObject, isSyncing) => {
    repository.create({ modelName, newObject: weiTransactionObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createWeiTransaction = async (req, res) => {
    const weiTransactionData = req.body;

    const etherScanTransaction = await etherScanServices().getTransactionByHash(weiTransactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const weiCurrency = await getWeiCurrencyByTokenName(weiTransactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(weiCurrency.tokenId, etherScanTransactionBlock.timestamp);
    const weiTransactionObject = await createWeiTransactionObject(weiTransactionData, etherScanTransactionBlock.timestamp, ethValue);

    try {
      const weiTransaction = await getWeiTransactionObject(weiTransactionData.txHash);
      if (weiTransaction === null) {
        await createAction(req, res, weiTransactionObject, false);
      } else {
        await updateAction(req, res, Number(weiTransaction.id), weiTransactionObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncWeiTransaction = async (req, res) => {
    const weiTransactionData = req.body;

    const etherScanTransaction = await etherScanServices().getTransactionByHash(weiTransactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const weiCurrency = await getWeiCurrencyByTokenName(weiTransactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(weiCurrency.tokenId, Number(etherScanTransactionBlock.timestamp));
    const weiTransactionObject = await createWeiTransactionObject(weiTransactionData, etherScanTransactionBlock.timestamp, ethValue);

    try {
      const weiTransaction = await getWeiTransactionObject(weiTransactionData.txHash);
      if (weiTransaction === null) {
        await createAction(req, res, weiTransactionObject, true);
      } else {
        await updateAction(req, res, Number(weiTransaction.id), weiTransactionObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWeiTransaction = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiTransaction = async (req, res) => {
    const { id } = req.params;
    const weiTransactionData = req.body;

    const etherScanTransaction = await etherScanServices().getTransactionByHash(weiTransactionData.txHash);
    const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    const weiCurrency = await getWeiCurrencyByTokenName(weiTransactionData.tokenName);
    const ethValue = await WeidexService.getTokenPriceByTimestamp(weiCurrency.tokenId, Number(etherScanTransactionBlock.timestamp));
    const weiTransactionObject = await createWeiTransactionObject(weiTransactionData, etherScanTransactionBlock.timestamp, ethValue);

    updateAction(req, res, Number(id), weiTransactionObject, false);
  };

  const removeWeiTransaction = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, address) => {
    try {
      const weiPortfolio = await getWeiPortfolioObjectByAddress(address);
      const deposits = await WeidexService.getUserDeposit(weiPortfolio.userID)
        .then(data => data.json())
        .catch(error => console.log(error));
      const withdrawls = await WeidexService.getUserWithdraw(weiPortfolio.userID)
        .then(data => data.json())
        .catch(error => console.log(error));

      const resolvedDeposits = await Promise.all(deposits.map(async (deposit) => {
        const addPortfolioId = Object.assign({}, deposit, { weiPortfolioId: weiPortfolio.id, type: 'd' });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        return syncWeiTransaction(bodyWrapper, res);
      }));
      const resolvedWithdrawls = await Promise.all(withdrawls.map(async (withdrawl) => {
        const addPortfolioId = Object.assign({}, withdrawl, { weiPortfolioId: weiPortfolio.id, type: 'w' });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        return syncWeiTransaction(bodyWrapper, res);
      }));

      // Promise.resolve(resolvedDeposits, resolvedWithdrawls)
      //   .then(() => res.status(200).send('transaction sync success'))
      //   .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createWeiTransaction,
    getWeiTransaction,
    updateWeiTransaction,
    removeWeiTransaction,
    sync,
  };
};

module.exports = weiTransactionController;
