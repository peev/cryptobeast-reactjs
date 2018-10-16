const { responseHandler } = require('../utilities/response-handler');
const { WeidexService } = require('../../services/weidex-service');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const createWeiCurrency = async (req, res) => {
    const weiCurrencyData = req.body;
    // const today = Math.floor(Date.now() / 1000);
    // const yesterday = today - (24 * 3600);
    // const lastWeek = today - (24 * 7 * 3600);

    const priceResponse = await WeidexService.getTokenTicker(weiCurrencyData.id);

    // TODO uncomment whan staging has tickers
    // const currencyDayStats = await WeidexService.getCurrencyStats(weiCurrencyData.id, yesterday, today);
    // const currencyWeekStats = await WeidexService.getCurrencyStats(weiCurrencyData.id, lastWeek, today);
    // const currencyDayStatsJson = JSON.parse(currencyDayStats);
    // const currencyWeekStatsJson = JSON.parse(currencyWeekStats);

    // let volume24HStats = 0;
    // let high24HStats = 0;
    // let low24HStats = 0;
    // let change24HStats = 0;
    // let change7DStats = 0;

    // if (currencyDayStatsJson.length) {
    //   volume24HStats = currencyDayStatsJson.volume;
    //   high24HStats = currencyDayStatsJson.high24H;
    //   low24HStats = currencyDayStatsJson.low24H;
    //   change24HStats = Number((currencyDayStatsJson[0].close - currencyDayStatsJson[0].open) / currencyDayStatsJson[0].open);
    // }

    // if (currencyWeekStatsJson.length) {
    //   if (currencyWeekStatsJson.length === 1) {
    //     change7DStats = Number((currencyWeekStatsJson[0].close - currencyWeekStatsJson[0].open) / currencyWeekStatsJson[0].open);
    //   } else {
    //     change7DStats = Number((
    //       currencyWeekStatsJson[currencyWeekStatsJson.length - 1].close - currencyWeekStatsJson[0].open) / currencyWeekStatsJson[0].open);
    //   }
    // }

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: priceResponse.price,
      // volume24H: volume24HStats,
      // high24H: high24HStats,
      // low24H: low24HStats,
      // change24H: change24HStats,
      // change7D: change7DStats,
      // bid: priceResponse.body.bid,
      // ask: priceResponse.body.ask,
    };

    await repository.findOne({
      modelName,
      options: {
        where: {
          tokenName: weiCurrencyData.name,
        },
      },
    }).then((currency) => {
      if (currency === null) {
        repository.create({ modelName, newObject: newWeiCurrencyObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const newWeiCurrencyData = Object.assign({}, newWeiCurrencyObject, { id: currency.id });
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
    const weiCurrencyData = req.body;

    const priceResponse = await WeidexService.getTokenTicker(weiCurrencyData.id);

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: priceResponse.price,
      // bid: priceResponse.body.bid,
      // ask: priceResponse.body.ask,
    };

    const newWeiCurrencyData = Object.assign({}, newWeiCurrencyObject, { id });
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

  const sync = (data) => {
    const tokens = WeidexService.getAllTokens().then(res => res.json());
    tokens.forEach((token) => {
      const ticker = WeidexService.getTokenTicker(token.id).then(res => res.json());
      // TODO: Get the stats from the non public api
      repository.update({
        modelName,
        updatedRecord: {
          tokenId: token.id,
          tokenName: token.name,
          tokenNameLong: token.fullName,
          // volume24H: volume24HStats,
          // high24H: high24HStats,
          // low24H: low24HStats,
          // change24H: change24HStats,
          // change7D: change7DStats,
          lastPriceETH: ticker.price,
          bid: ticker.bid,
          ask: ticker.ask,
        }
      })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => res.json(error));
    });

  };

  return {
    createWeiCurrency,
    getWeiCurrency,
    updateWeiCurrency,
    removeWeiCurrency,
    sync
  };
};

module.exports = weiCurrencyController;
