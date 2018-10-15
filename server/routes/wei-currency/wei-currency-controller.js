const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const createWeiCurrency = async (req, res) => {
    const weiCurrencyData = req.body;
    const today = Math.floor(Date.now() / 1000);
    const yesterday = today - (24 * 3600);
    const lastWeek = today - (24 * 7 * 3600);

    const priceResponse = await WeidexService.getTokenTicker(weiCurrencyData.id);
    const currencyDayStats = await WeidexService.getCurrencyStats(weiCurrencyData.id, yesterday, today);
    const currencyWeekStats = await WeidexService.getCurrencyStats(weiCurrencyData.id, lastWeek, today);

    // TODO json

    let volume24HStats = 0;
    let high24HStats = 0;
    let low24HStats = 0;
    let change24HStats = 0;
    let change7DStats = 0;

    if (currencyDayStats.length) {
      volume24HStats = currencyDayStats.volume;
      high24HStats = currencyDayStats.high24H;
      low24HStats = currencyDayStats.low24H;
      change24HStats = Number((currencyDayStats[0].close / currencyDayStats[0].open) / currencyDayStats[0].open);
    }

    if (currencyWeekStats.length) {
      console.log('------------------------------------');
      console.log(currencyWeekStats[0]);
      console.log('------------------------------------');
      if (currencyWeekStats.length === 1) {
        change7DStats = Number((currencyWeekStats[0].close / currencyWeekStats[0].open) / currencyWeekStats[0].open);
      } else {
        change7DStats = Number((currencyWeekStats[currencyWeekStats.length - 1].close / currencyWeekStats[0].open) / currencyWeekStats[0].open);
      }
    }

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: priceResponse.price,
      volume24H: volume24HStats,
      high24H: high24HStats,
      low24H: low24HStats,
      change24H: change24HStats,
      change7D: change7DStats,
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
