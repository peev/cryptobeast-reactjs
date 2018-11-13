const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'TradeHistory';

const tradeController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');

  const getPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
      include: [{ all: true }],
    },
  })
    .catch(err => console.log(err));

  const getPortfolioObjectById = async idParam => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        id: idParam,
      },
      include: [{ all: true }],
    },
  })
    .catch(err => console.log(err));

  const getTradeByTransactionHash = transactionHash => repository.findOne({
    modelName,
    options: {
      where: {
        txHash: transactionHash,
      },
    },
  })
    .catch(err => console.log(err));

  const createTradeObject = (req, priceUsd, transactonFee) => {
    let newTradeObject;
    try {
      newTradeObject = {
        tokenName: req.token.name,
        type: req.type,
        amount: req.amount || 0,
        priceETH: req.price || 0,
        priceUSD: 0,
        priceTotalETH: bigNumberService().product(req.amount, req.price) || 0,
        priceTotalUSD: 0,
        timestamp: req.createdAt,
        txHash: req.txHash,
        status: req.status,
        txFee: transactonFee,
        pair: `${req.token.name.toUpperCase()}-ETH`,
        portfolioId: req.portfolioId,
      };
    } catch (error) {
      console.log(error);
    }
    return newTradeObject;
  };

  const createAction = async (req, res, tradeObject, isSyncing) => {
    await repository.create({ modelName, newObject: tradeObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const calculateTransactionFee = transaction =>
    ((transaction !== null) ?
      bigNumberService().quotient(bigNumberService().product(transaction.gas, transaction.gasPrice), 1000000000000000000) : 0);

  const createTrade = async (req, res) => {
    const trade = req.body;

    try {
      const tradeExist = await getTradeByTransactionHash(trade.txHash);
      if (tradeExist !== null) {
        const lastPriceUSD = await etherScanServices().getETHUSDPrice();
        const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
        const transactionFee = calculateTransactionFee(transaction);
        const tradeObject = createTradeObject(trade, lastPriceUSD, transactionFee);

        await createAction(req, res, tradeObject, false);
      } else {
        res.status(200).send(trade);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncTrade = async (req, res, lastPriceUSD) => {
    const trade = req.body;

    try {
      const tradeExist = await getTradeByTransactionHash(trade.txHash);
      if (tradeExist === null) {
        const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
        const transactionFee = calculateTransactionFee(transaction);
        const tradeObject = createTradeObject(trade, lastPriceUSD, transactionFee);

        await createAction(req, res, tradeObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTradesByPortfolioId = async (req, res) => {
    const { portfolioId } = req.params;
    try {
      await getPortfolioObjectById(portfolioId)
        .then((portfolio) => {
          res.status(200).send(portfolio.tradeHistories);
        })
        .catch((error) => {
          res.json(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getTrade = async (req, res) => {
    const { id } = req.params;
    await repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeTrade = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const getTrades = async (req, res, trades, portfolioID, lastPriceUSD) => {
    try {
      await Promise.all(trades.map(async (trade) => {
        const addPortfolioId = Object.assign({}, trade, { portfolioId: portfolioID });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        await syncTrade(bodyWrapper, res, lastPriceUSD);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const lastPriceUSD = await etherScanServices().getETHUSDPrice();
        const portfolio = await getPortfolioObjectByAddress(address);
        const trades = await WeidexService.getUserOrderHistoryByUserHttp(portfolio.userID);
        if (trades) {
          await getTrades(req, res, trades, portfolio.id, lastPriceUSD);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return Promise.all(portfolioArray).then(() => {
      console.log('================== END TRADES ==================');
    });
  };

  return {
    createTrade,
    getTrade,
    removeTrade,
    sync,
    getAllTradesByPortfolioId,
  };
};

module.exports = tradeController;
