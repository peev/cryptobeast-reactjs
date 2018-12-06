/* eslint-disable no-nested-ternary */
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'TradeHistory';

const tradeController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');
  const weidexFiatMsService = require('../../services/weidex-fiat-ms-service');
  const commomService = require('../../services/common-methods-service');

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

  const setStatus = (userAddress, trade) =>
    ((trade.makerAddress === userAddress) ? trade.type : (trade.type === 'SELL') ? 'BUY' : 'SELL');

  const createTradeObject = (req, priceUsd, transactonFee, address, priceUSD, priceTotalUSD) => {
    let newTradeObject;
    try {
      newTradeObject = {
        tokenName: req.token.name,
        type: setStatus(address, req),
        amount: req.amount || 0,
        priceETH: req.price || 0,
        priceTotalETH: bigNumberService().product(req.amount, req.price) || 0,
        priceUSD: priceUSD || 0,
        priceTotalUSD: priceTotalUSD || 0,
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

  const getEthToUsd = async timestamp =>
    weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp)).then(data => data.priceUSD);

  const syncTrade = async (req, res, lastPriceUSD, address) => {
    const trade = req.body;

    try {
      const tradeExist = await getTradeByTransactionHash(trade.txHash);
      if (tradeExist === null) {
        const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
        const transactionFee = calculateTransactionFee(transaction);
        const timestamp = await commomService().getTimestampByTxHash(trade.txHash);
        const ethUsd = await commomService().getEthToUsd(timestamp);
        const priceUSD = bigNumberService().product(trade.price, ethUsd);
        const priceTotalUSD = await commomService().tokenToEthToUsd(trade.amount, trade.price, ethUsd);

        const tradeObject = createTradeObject(trade, lastPriceUSD, transactionFee, address, priceUSD, priceTotalUSD);
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

  const getTrades = async (req, res, trades, portfolioID, lastPriceUSD, address) => {
    try {
      await Promise.all(trades.map(async (trade) => {
        const addPortfolioId = Object.assign({}, trade, { portfolioId: portfolioID });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        await syncTrade(bodyWrapper, res, lastPriceUSD, address);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const timestamp = new Date().getTime();
        const lastPriceUSD = await getEthToUsd(timestamp);
        const portfolio = await getPortfolioObjectByAddress(address);
        const trades = await WeidexService.getUserOrderHistoryByUserHttp(portfolio.userID);
        if (trades) {
          await getTrades(req, res, trades, portfolio.id, lastPriceUSD, address);
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
    getTrade,
    sync,
    getAllTradesByPortfolioId,
  };
};

module.exports = tradeController;
