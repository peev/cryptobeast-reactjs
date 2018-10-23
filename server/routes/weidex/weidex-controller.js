const { WeidexService } = require('../../services/weidex-service');

const weidexController = (repository) => {
  const weiAssetController = require('../asset/asset-controller')(repository);
  const weiFiatFxController = require('../fiat-fx/fiat-fx-controller')(repository);
  const weiCurrencyController = require('../currency/currency-controller')(repository);
  const weiPortfolioController = require('../portfolio/portfolio-controller')(repository);
  const weiTransactionController = require('../transaction/transaction-controller')(repository);
  const weiTradeHistoryController = require('../trade-history/trade-history-controller')(repository);

  const sync = async (req, res) => {
    const { id } = req.params;
    console.log('Start sync');
    // weiFiatFxController.sync();
    await weiCurrencyController.sync(req, res);
    await console.log('=============== END OF CURRENCY =======================================');
    await weiPortfolioController.sync(req, res, id.toLowerCase());
    await console.log('=============== END OF PORTFOLIO =======================================');
    await weiAssetController.sync(req, res, id.toLowerCase());
    await console.log('=============== END OF ASSETS =======================================');
    await weiTransactionController.sync(req, res, id.toLowerCase());
    await console.log('=============== END OF TRANSACTIONS =======================================');
    await weiTradeHistoryController.sync(req, res, id.toLowerCase());
    await console.log('=============== END OF TRADES =======================================');
    await console.log('End sync');
  };

  const getUser = (req, res) => {
    WeidexService.getUser(req.params.address)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllTokens = (req, res) => {
    WeidexService.getAllTokens()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getBalanceByUser = (req, res) => {
    WeidexService.getBalanceByUser(req.params.address)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserDeposit = (req, res) => {
    WeidexService.getUserDeposit(req.params.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserWithdraw = (req, res) => {
    WeidexService.getUserWithdraw(req.params.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOpenOrders = (req, res) => {
    WeidexService.getUserOpenOrders(req.params.userId, req.params.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOpenOrdersByOrderType = (req, res) => {
    WeidexService.getUserOpenOrdersByOrderType(req.params.tokenId, req.params.type)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByToken = (req, res) => {
    WeidexService.getUserOrderHistoryByToken(req.params.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByUser = (req, res) => {
    WeidexService.getUserOrderHistoryByUser(req.params.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByUserAndToken = (req, res) => {
    WeidexService.getUserOrderHistoryByUserAndToken(req.params.userId, req.params.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    sync,
    getUser,
    getBalanceByUser,
    getUserDeposit,
    getUserWithdraw,
    getUserOpenOrders,
    getUserOpenOrdersByOrderType,
    getUserOrderHistoryByToken,
    getUserOrderHistoryByUser,
    getUserOrderHistoryByUserAndToken
  };
};

module.exports = weidexController;
