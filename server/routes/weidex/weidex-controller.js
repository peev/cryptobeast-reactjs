const { WeidexService } = require('../../services/weidex-service');

const weidexController = (repository) => {
  const weiAssetController = require('../wei-asset/wei-asset-controller')(repository);
  const weiFiatFxController = require('../wei-fiat-fx/wei-fiat-fx-controller')(repository);
  const weiCurrencyController = require('../wei-currency/wei-currency-controller')(repository);
  const weiPortfolioController = require('../wei-portfolio/wei-portfolio-controller')(repository);
  const weiTransactionController = require('../wei-transaction/wei-transaction-controller')(repository);
  const weiTradeHistoryController = require('../wei-trade-history/wei-trade-history-controller')(repository);

  const sync = async (req, res) => {
    const { id } = req.params;
    console.log('Start sync');
    // weiFiatFxController.sync();
    await weiCurrencyController.sync(req, res);
    await weiAssetController.sync(req, res, id);
    // Needs improvement for the ticker info when weidex are ready
    // weiCurrencyController.sync();
    // weiPortfolioController.sync();
    // weiTransactionController.sync();
    // weiTradeHistoryController.sync(id);
    console.log('End sync');
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
