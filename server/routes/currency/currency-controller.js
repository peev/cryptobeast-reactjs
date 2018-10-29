const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Currency';

const currencyController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const calculateCurrencyChange = (open, close) => Number((close - open) / open);

  const fetchCurrencyObject = tokenNameParam => repository.findOne({
    modelName,
    options: {
      where: {
        tokenName: tokenNameParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getCurrencyObject = async (req) => {
    let newCurrencyObject;
    try {
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

      currencyDayStatsJson = !Array.isArray(currencyDayStats) ? JSON.parse(currencyDayStats) : currencyDayStats;
      currencyWeekStatsJson = !Array.isArray(currencyWeekStats) ? JSON.parse(currencyWeekStats) : currencyWeekStats;

      if (currencyDayStatsJson.length > 0) {
        volume24HStats = currencyDayStatsJson.volume;
        high24HStats = currencyDayStatsJson.high24H;
        low24HStats = currencyDayStatsJson.low24H;
        change24HStats = calculateCurrencyChange(currencyDayStatsJson[0].close, currencyDayStatsJson[0].open);
      }

      if (currencyWeekStatsJson.length > 0) {
        change7DStats = currencyWeekStatsJson.length === 1 ?
          calculateCurrencyChange(currencyWeekStatsJson[0].close, currencyWeekStatsJson[0].open) :
          calculateCurrencyChange(currencyWeekStatsJson[currencyWeekStatsJson.length - 1].close, currencyWeekStatsJson[0].open);
      }

      newCurrencyObject = {
        tokenId: req.id,
        tokenName: req.name,
        tokenNameLong: req.fullName,
        lastPriceETH: priceResponse.price,
        volume24H: volume24HStats,
        high24H: high24HStats,
        low24H: low24HStats,
        change24H: change24HStats,
        change7D: change7DStats,
        // bid: req.bid,
        // ask: req.ask,
      };
    } catch (error) {
      console.log(error);
    }
    return newCurrencyObject;
  };

  const updateAction = (req, res, id, currencyObject, isSyncing) => {
    const newCurrencyData = Object.assign({}, currencyObject, { id });
    return repository.update({ modelName, updatedRecord: newCurrencyData })
      .then(response => (isSyncing ? newCurrencyData : res.status(200).send(response)))
      .catch(error => console.log(error));
  };

  const createAction = (req, res, currencyObject, isSyncing) => {
    repository.create({ modelName, newObject: currencyObject })
      .then(response => (isSyncing ? currencyObject : res.status(200).send(response)))
      .catch(error => console.log(error));
  };

  const createCurrency = (req, res) => {
    const currency = req.body;

    const currencyObject = getCurrencyObject(currency);
    const currencyFound = fetchCurrencyObject(currency.name);

    if (currencyFound === null) {
      return createAction(req, res, currencyObject, false);
    }
    return updateAction(req, res, Number(currencyFound.id), currencyObject, false);
  };

  const syncCurrency = async (req, res) => {
    const currency = req.body;

    const currencyObject = await getCurrencyObject(currency);
    const currencyFound = await fetchCurrencyObject(currency.name);

    if (currencyFound === null) {
      createAction(req, res, currencyObject, true);
    } else {
      updateAction(req, res, Number(currencyFound.id), currencyObject, true);
    }
  };

  const getCurrency = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateCurrency = async (req, res) => {
    const { id } = req.params;
    const currency = getCurrencyObject(req.body);
    return updateAction(req, res, Number(id), currency, false);
  };

  const removeCurrency = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = (req, res) => {
    (async () => {
      const tokens = await WeidexService.getAllTokens()
        .then(data => data.json())
        .catch(error => console.log(error));
      const tokenArray = await tokens.map((token) => {
        const bodyWrapper = Object.assign({ body: token });
        return syncCurrency(bodyWrapper, res);
      });
      await Promise.all(tokenArray).then(() => {
        console.log('================== END CURRENCY =========================================');
      });
    })();
  };

  return {
    createCurrency,
    getCurrency,
    updateCurrency,
    removeCurrency,
    sync,
  };
};

module.exports = currencyController;
