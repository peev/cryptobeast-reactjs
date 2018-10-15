const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');
const { WeidexService } = require('../../services/weidex-service');

const modelName = 'WeiTradeHistory';

const weiTradeController = (repository) => {
  const createWeiTrade = async (req, res) => {
    const weiTrade = req.body;

    const tradeExist = await repository.findOne({
      modelName,
      options: {
        where: {
          txHash: weiTrade.txHash,
        },
      },
    });

    if (!tradeExist) {
      const ethToUsd = await repository.findOne({
        modelName: 'WeiFiatFx',
        options: {
          where: {
            fxName: 'ETH',
          },
        },
      });

      const transaction = await etherScanServices().getTransactionByHash(weiTrade.txHash);

      let transactonFee = null;

      // Test network use another url
      if (transaction !== null) {
        transactonFee = Number(((transaction.gas * 100) * (transaction.gasPrice * 100)) / 100);
      }

      const newWeiTradeObject = {
        type: weiTrade.type,
        amount: weiTrade.amount,
        priceETH: weiTrade.price,
        priceUSD: weiTrade.price * ethToUsd.priceUSD,
        priceTotalETH: weiTrade.amount * weiTrade.price,
        priceTotalUSD: weiTrade.amount * (weiTrade.price * ethToUsd.priceUSD),
        timestamp: weiTrade.createdAt,
        txHash: weiTrade.txHash,
        status: weiTrade.status,
        txFee: transactonFee,
        pair: `${weiTrade.token.name.toUpperCase()}-ETH`,
        weiPortfolioId: weiTrade.weiPortfolioId,
      };

      repository.create({ modelName, newObject: newWeiTradeObject })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch((error) => {
          res.json(error);
        });
    } else {
      res.status(200).send(weiTrade);
    }
  };

  const getWeiTrade = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeWeiTrade = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = (id) => {
    repository.rawQuery('SELECT DISTINCT ON ("txHash") * FROM "weiTradeHistory" ORDER  BY "txHash", "timestamp" DESC NULLS LAST, "weiPortfolioId"').then((transactions) => {
      let newest = null;
      if(transactions[0]) {
        newest = +new Date(transactions[0].timestamp);
      } else {
        newest = 1
      }
      const ethToUsd = await repository.findOne({
        modelName: 'WeiFiatFx',
        options: {
          where: {
            fxName: 'ETH',
          },
        },
      });
      let transactions = await WeidexService.getUserOrderHistoryByUser(id).then(res => res.json());
      transactions.forEach((transaction) => {
        if(newest < +(new Date(transaction)) {
          repository.create({
            modelName, 
            newObject: {
              type: transaction.type,
              amount: transaction.amount,
              priceETH: transaction.price,
              priceUSD: transaction.price * ethToUsd.priceUSD,
              priceTotalETH: transaction.amount * transaction.price,
              priceTotalUSD: transaction.amount * (transaction.price * ethToUsd.priceUSD),
              timestamp: transaction.createdAt,
              txHash: transaction.txHash,
              status: transaction.status,
              txFee: Number(((transaction.gas * 100) * (transaction.gasPrice * 100)) / 100);,
              pair: `${transaction.token.name.toUpperCase()}-ETH`,
              weiPortfolioId: transaction.weiPortfolioId,
            } 
          });
        }
      });
    });
  };

  return {
    createWeiTrade,
    getWeiTrade,
    removeWeiTrade,
    sync
  };
};

module.exports = weiTradeController;
