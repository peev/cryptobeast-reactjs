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
          txTimestamp: Number(etherScanTransactionBlock.timestamp),
          tokenPriceETH: Number(etherScanTransaction.value),
          tokenPriceUSD: null,
          totalValueETH: weiTransactionData.amount * Number(etherScanTransaction.value),
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
    repository.find({ modelName }).then((transactions) => {
      transactions.forEach(async (transaction) => {
        const etherScanTransaction = await etherScanServices().getTransactionByHash(transaction.txHash);
        const etherScanTransactionBlock = await etherScanServices().getBlockByNumber(transaction.blockNumber);

        repository.update({
          modelName,
          updatedRecord: {
            txHash: weiTransactionData.txHash,
            txTimestamp: etherScanTransactionBlock.timestamp,
            tokenPriceETH: etherScanTransaction.value,
          }
        })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      });
    });
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
