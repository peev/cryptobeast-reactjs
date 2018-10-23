const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'TradeHistory';

const tradeController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const getWeiPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
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

  const getFiatFx = () => repository.findOne({
    modelName: 'FiatFx',
    options: {
      where: {
        fxName: 'ETH',
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
        amount: req.amount,
        priceETH: req.price,
        priceUSD: 0,
        priceTotalETH: req.amount * req.price,
        priceTotalUSD: 0,
        timestamp: req.createdAt,
        txHash: req.txHash,
        status: req.status,
        txFee: transactonFee,
        pair: `${req.token.name.toUpperCase()}-ETH`,
        weiPortfolioId: req.weiPortfolioId,
      };
    } catch (error) {
      console.log(error);
    }
    return newTradeObject;
  };

  const createAction = (req, res, tradeObject, isSyncing) => {
    repository.create({ modelName, newObject: tradeObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const calculateTransactionFee = transaction =>
    ((transaction !== null) ? Number(transaction.gas * transaction.gasPrice) / 1000000000000000000 : 0);

  const createTrade = async (req, res) => {
    const trade = req.body;

    try {
      const tradeExist = await getTradeByTransactionHash(trade.txHash);
      if (tradeExist !== null) {
        const ethValue = await getFiatFx();
        const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
        const transactionFee = calculateTransactionFee(transaction);
        const tradeObject = createTradeObject(trade, ethValue.priceUSD, transactionFee);

        await createAction(req, res, tradeObject, false);
      } else {
        res.status(200).send(trade);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncTrade = async (req, res) => {
    const trade = req.body;

    try {
      const tradeExist = await getTradeByTransactionHash(trade.txHash);
      if (tradeExist === null) {
        const ethValue = await getFiatFx();
        const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
        const transactionFee = calculateTransactionFee(transaction);
        const tradeObject = createTradeObject(trade, ethValue.priceUSD, transactionFee);

        await createAction(req, res, tradeObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTrade = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
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

  const sync = async (req, res, addresses) => {
    addresses.map(async (address) => {
      const portfolio = await getWeiPortfolioObjectByAddress(address);
      const trades = await WeidexService.getUserOrderHistoryByUser(portfolio.userID)
        .then(data => data.json())
        .catch(error => console.log(error));

      const resolvedFinalArray = await Promise.all(trades.map(async (trade) => {
        const addPortfolioId = Object.assign({}, trade, { weiPortfolioId: portfolio.id });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        return syncTrade(bodyWrapper, res);
      }));
      Promise.resolve(resolvedFinalArray)
        .then(() => console.log('success'))
        .catch(error => console.log(error));
    });
  };

  return {
    createTrade,
    getTrade,
    removeTrade,
    sync,
  };
};

module.exports = tradeController;
