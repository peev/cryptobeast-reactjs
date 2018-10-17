const { responseHandler } = require('../utilities/response-handler');
// const { WeidexService } = require('../../services/weidex-service');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const getCurrencyObject = async (req) => {
    const today = Math.floor(Date.now() / 1000);
    const yesterday = today - (24 * 3600);
    const lastWeek = today - (24 * 7 * 3600);
    let currencyDayStatsJson = null;
    let currencyWeekStatsJson = null;
    let volume24HStats = 0;
    let high24HStats = 0;
    let low24HStats = 0;
    let change24HStats = 0;
    let change7DStats = 0;

    const priceResponse = await WeidexService.getTokenTicker(req.id);
    const currencyDayStats = await WeidexService.getCurrencyStats(req.id, yesterday, today);
    const currencyWeekStats = await WeidexService.getCurrencyStats(req.id, lastWeek, today);

    if (!Array.isArray(currencyDayStats)) {
      currencyDayStatsJson = JSON.parse(currencyDayStats);
    } else {
      currencyDayStatsJson = currencyDayStats;
    }

    if (!Array.isArray(currencyWeekStats)) {
      currencyWeekStatsJson = JSON.parse(currencyWeekStats);
    } else {
      currencyWeekStatsJson = currencyWeekStats;
    }

    if (currencyDayStatsJson.length > 0) {
      volume24HStats = currencyDayStatsJson.volume;
      high24HStats = currencyDayStatsJson.high24H;
      low24HStats = currencyDayStatsJson.low24H;
      change24HStats = Number((currencyDayStatsJson[0].close - currencyDayStatsJson[0].open)
      / currencyDayStatsJson[0].open);
    }

    if (currencyWeekStatsJson.length > 0) {
      if (currencyWeekStatsJson.length === 1) {
        change7DStats = Number((currencyWeekStatsJson[0].close - currencyWeekStatsJson[0].open)
         / currencyWeekStatsJson[0].open);
      } else {
        change7DStats = Number((currencyWeekStatsJson[currencyWeekStatsJson.length - 1].close - currencyWeekStatsJson[0].open)
        / currencyWeekStatsJson[0].open);
      }
    }

    const newWeiCurrencyObject = {
      tokenId: req.id,
      tokenName: req.name,
      tokenNameLong: req.fullName,
      lastPriceETH: priceResponse.price,
      volume24H: volume24HStats,
      high24H: high24HStats,
      low24H: low24HStats,
      change24H: change24HStats,
      change7D: change7DStats,
      // bid: priceResponse.body.bid,
      // ask: priceResponse.body.ask,
    };

    return newWeiCurrencyObject;
  };

  const createWeiCurrency = async (req, res) => {
    const weiCurrency = req.body;

    const weiCurrencyObject = await getCurrencyObject(weiCurrency);

    await repository.findOne({
      modelName,
      options: {
        where: {
          tokenName: weiCurrency.name,
        },
      },
    }).then((currency) => {
      if (currency === null) {
        repository.create({ modelName, newObject: weiCurrencyObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const newWeiCurrencyData = Object.assign({}, weiCurrencyObject, { id: currency.id });
        repository.update({ modelName, updatedRecord: newWeiCurrencyData })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch(error => res.json(error));
      }
    }).catch((error) => {
      res.json(error);
    });
  };

  const getWeiCurrency = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiCurrency = async (req, res) => {
    const { id } = req.params;

    const weiCurrency = await getCurrencyObject(req);

    const newWeiCurrencyData = Object.assign({}, weiCurrency, { id });
    repository.update({ modelName, updatedRecord: newWeiCurrencyData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiCurrency = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async () => {
    const tokens = await WeidexService.getAllTokens().then(res => res.json());
    tokens.forEach(async (token) => {
      await createWeiCurrency(token);
    });
  };

  return {
    createWeiCurrency,
    getWeiCurrency,
    updateWeiCurrency,
    removeWeiCurrency,
    sync,
  };
};

module.exports = weiCurrencyController;
