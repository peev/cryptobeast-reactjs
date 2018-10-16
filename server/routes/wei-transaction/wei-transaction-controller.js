const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'WeiTransaction';

const weiTransactionController = (repository) => {
  const createWeiTransaction = async (req, res) => {
    const weiTransactionData = req.body;

    await repository.findOne({
      modelName,
      options: {
        where: {
          txHash: weiTransactionData.txHash,
        },
      },
    }).then(async (transaction) => {
      if (!transaction) {
        const etherScanTransaction = await etherScanServices().getTransactionByHash(weiTransactionData.txHash);
        const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);

        const newTransactionObject = {
          amount: weiTransactionData.amount,
          txHash: weiTransactionData.txHash,
          status: weiTransactionData.status,
          tokenName: weiTransactionData.tokenName,
          type: weiTransactionData.type,
          weiPortfolioId: weiTransactionData.weiPortfolioId,
          txTimestamp: etherScanTransactionBlock.timestamp,
          tokenPriceETH: etherScanTransaction.value,
          tokenPriceUSD: null,
          totalValueETH: weiTransactionData.amount * etherScanTransaction.value,
          totalValueUSD: null,
          ETHUSD: null,
        };

        repository.create({ modelName, newObject: newTransactionObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        res.status(200).send(transaction);
      }
    }).catch((error) => {
      res.json(error);
    });
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

  const updateWeiTransaction = (req, res) => {
    const { id } = req.params;
    const weiTransactionData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiTransactionData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiTransaction = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = (data) => {
    
  };

  return {
    createWeiTransaction,
    getWeiTransaction,
    updateWeiTransaction,
    removeWeiTransaction,
    sync
  };
};

module.exports = weiTransactionController;
