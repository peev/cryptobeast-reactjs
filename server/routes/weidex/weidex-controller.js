const { WeidexService } = require('../../services/weidex-services');

const weidexController = (repository) => {
  const weiFiatFxController = require('../wei-fiat-fx-controller')(repository);
  const weiCurrencyController = require('../wei-currency-controller')(repository);
  const weiPortfolioController = require('../wei-portfolio-controller')(repository);
  const weiAssetController = require('../wei-asset/wei-asset-controller')(repository);
  const weiTransactionController = require('../wei-transacation-controller')(repository);
  const weiTradeHistoryController = require('../wei-trade-history-controller')(repository);

  const sync = (req, res) => {
    weiAssetController.sync(req.query.id);
    weiFiatFxController.sync(req.query.id);
    weiCurrencyController.sync(req.query.id);
    weiPortfolioController.sync(req.query.id);
    weiTransactionController.sync(req.query.id);
    weiTradeHistoryController.sync(req.query.id);
  };

  const getUser = (req, res) => {
    WeidexService.getUser(req.query.address)
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
    WeidexService.getBalanceByUser(req.query.address)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserDeposit = (req, res) => {
    WeidexService.getUserDeposit(req.query.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserWithdraw = (req, res) => {
    WeidexService.getUserWithdraw(req.query.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOpenOrders = (req, res) => {
    WeidexService.getUserOpenOrders(req.query.userId, req.query.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOpenOrdersByOrderType = (req, res) => {
    WeidexService.getUserOpenOrdersByOrderType(req.query.tokenId, req.query.type)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByToken = (req, res) => {
    WeidexService.getUserOrderHistoryByToken(req.query.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByUser = (req, res) => {
    WeidexService.getUserOrderHistoryByUser(req.query.userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUserOrderHistoryByUserAndToken = (req, res) => {
    WeidexService.getUserOrderHistoryByUserAndToken(req.query.userId, req.query.tokenId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
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
