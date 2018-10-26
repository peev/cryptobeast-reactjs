const { WeidexService } = require('../../services/weidex-service');

const weidexController = (repository) => {
  const assetController = require('../asset/asset-controller')(repository);
  const fiatFxController = require('../fiat-fx/fiat-fx-controller')(repository);
  const currencyController = require('../currency/currency-controller')(repository);
  const portfolioController = require('../portfolio/portfolio-controller')(repository);
  const transactionController = require('../transaction/transaction-controller')(repository);
  const tradeHistoryController = require('../trade-history/trade-history-controller')(repository);

  const sync = async (req, res) => {
    const addresses = req.body.map(address => address.toLowerCase());
    // POST /weidex/sync ["0x5AE0d1Ffb5e06d32f3dA53aCA952439766Ab029F","0xac5e37db1c85bfc3e6474755ed77cff76d81eb67"]
    await fiatFxController.sync(req, res);
    currencyController.sync(req, res);
    await portfolioController.sync(req, res, addresses);
    await assetController.sync(req, res, addresses);
    await transactionController.sync(req, res, addresses);
    await tradeHistoryController.sync(req, res, addresses);
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
    getUserOrderHistoryByUserAndToken,
  };
};

module.exports = weidexController;
