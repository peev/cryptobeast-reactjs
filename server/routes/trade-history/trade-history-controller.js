/* eslint-disable no-nested-ternary */
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'TradeHistory';

const tradeController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const commomService = require('../../services/common-methods-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);

  const setStatus = (userAddress, trade) =>
    ((trade.makerAddress === userAddress) ? trade.type : (trade.type === 'SELL') ? 'BUY' : 'SELL');

  const isMaker = (userAddress, makerAddress) => (userAddress === makerAddress);

  const createTradeObject = (req, priceUsd, transactonFee, address, priceUSD, priceTotalUSD) => {
    let newTradeObject;
    try {
      newTradeObject = {
        tokenName: req.token.name,
        type: setStatus(address, req),
        amount: req.amount || 0,
        priceETH: req.price || 0,
        priceTotalETH: bigNumberService.product(req.amount, req.price) || 0,
        priceUSD: priceUSD || 0,
        priceTotalUSD: priceTotalUSD || 0,
        timestamp: req.createdAt,
        txHash: req.txHash,
        status: req.status,
        txFee: transactonFee,
        pair: `${req.token.name.toUpperCase()}-ETH`,
        isMaker: isMaker(address, req.makerAddress),
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
      bigNumberService.quotient(bigNumberService.product(transaction.gas, transaction.gasPrice), 1000000000000000000) : 0);

  const syncTrade = async (req, res, lastPriceUSD, address) => {
    const trade = req.body;

    try {
      const transaction = await etherScanServices().getTransactionByHash(trade.txHash);
      const transactionFee = calculateTransactionFee(transaction);
      const timestamp = await commomService.getTimestampByTxHash(trade.txHash);
      const ethUsd = await commomService.getEthToUsdMiliseconds(timestamp);
      const priceUSD = bigNumberService.product(trade.price, ethUsd);
      const priceTotalUSD = await commomService.tokenToEthToUsd(trade.amount, trade.price, ethUsd);

      const tradeObject = createTradeObject(trade, lastPriceUSD, transactionFee, address, priceUSD, priceTotalUSD);
      const tradeExist = await intReqService.getTradeByTxHashAndType(trade.txHash, setStatus(address, trade));
      if (tradeExist === null || tradeExist === undefined) {
        await createAction(req, res, tradeObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTradesByPortfolioId = async (req, res) => {
    const { portfolioId } = req.params;
    try {
      await intReqService.getPortfolioByIdIncludeAll(portfolioId)
        .then(portfolio => res.status(200).send(portfolio.tradeHistories))
        .catch(error => res.json(error));
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

  const getTrades = async (req, res, trades, portfolioId, lastPriceUSD, address) => {
    try {
      await Promise.all(trades.map(async (trade) => {
        const addPortfolioId = Object.assign({}, trade, { portfolioId });
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
        const lastPriceUSD = await commomService.getEthToUsdNow();
        const portfolio = await intReqService.getPortfolioByUserAddressIncludeAll(address);
        const trades = await weidexService.getUserOrderHistoryByUserHttp(portfolio.userID);
        const portfolioId = portfolio.id;
        if (trades) {
          await getTrades(req, res, trades, portfolioId, lastPriceUSD, address);
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
