const modelName = 'Currency';

const currencyController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');
  const commonService = require('../../services/common-methods-service')();

  const calculateCurrencyChange = (open, close) =>
    Number(bigNumberService().product(bigNumberService().quotient(bigNumberService().difference(close, open), open), 100));

  const fetchCurrencyObject = tokenNameParam => repository.findOne({
    modelName,
    options: {
      where: {
        tokenName: tokenNameParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getCurrencyObject = async (req, tokenPricesByDate) => {
    let newCurrencyObject;
    try {
      const today = Math.floor(Date.now() / 1000);
      const yesterday = today - (24 * 3600);
      let currencyDayStatsJson = null;
      let volume24HStats = 0;
      let high24HStats = 0;
      let low24HStats = 0;

      const priceResponse = await weidexService.getTokenTicker(req.id);
      const currencyDayStats = await weidexService.getCurrencyStats(req.id, yesterday, today);

      currencyDayStatsJson = !Array.isArray(currencyDayStats) ? JSON.parse(currencyDayStats) : currencyDayStats;

      if (currencyDayStatsJson.length > 0) {
        volume24HStats = currencyDayStatsJson.volume;
        high24HStats = currencyDayStatsJson.high24H;
        low24HStats = currencyDayStatsJson.low24H;
      }

      const todayValue = tokenPricesByDate.today;
      const yesterdayValue = tokenPricesByDate.yesterday;
      const lastWeekValue = tokenPricesByDate.lastWeek;
      const change24HStats = (req.name === 'ETH') ? 0 : calculateCurrencyChange(yesterdayValue, todayValue);
      const change7DStats = (req.name === 'ETH') ? 0 : calculateCurrencyChange(lastWeekValue, todayValue);

      // eslint-disable-next-line no-nested-ternary
      const lastPriceETH = (priceResponse.lastPrice !== null && priceResponse.lastPrice !== undefined) ?
        req.name === 'ETH' ? 1 : priceResponse.lastPrice : 0;

      newCurrencyObject = {
        tokenId: req.id,
        tokenName: req.name,
        tokenNameLong: req.fullName,
        decimals: req.decimals,
        lastPriceETH,
        volume24H: volume24HStats || 0,
        high24H: high24HStats || 0,
        low24H: low24HStats || 0,
        change24H: change24HStats,
        change7D: change7DStats,
        bid: priceResponse.bid || 0,
        ask: priceResponse.ask || 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newCurrencyObject;
  };

  const updateAction = async (req, res, id, currencyObject, isSyncing) => {
    const newCurrencyData = Object.assign({}, currencyObject, { id });
    await repository.update({ modelName, updatedRecord: newCurrencyData })
      .then(response => (isSyncing ? response : res.status(200).send(response)))
      .catch(error => res.status(400).send({ message: error }));
  };

  const createAction = async (req, res, currencyObject, isSyncing) => {
    await repository.create({ modelName, newObject: currencyObject })
      .then(response => (isSyncing ? response : res.status(200).send(response)))
      .catch(error => res.status(400).send({ message: error }));
  };

  const syncCurrency = async (req, res, tokenPricesByDate) => {
    const currency = req.body;

    const currencyObject = await getCurrencyObject(currency, tokenPricesByDate);
    const currencyFound = await fetchCurrencyObject(currency.name);

    if (currencyFound === null || currencyFound === undefined) {
      await createAction(req, res, currencyObject, true);
    } else {
      await updateAction(req, res, Number(currencyFound.id), currencyObject, true);
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

  const getAllCurrencies = (req, res) => {
    repository.find({ modelName })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const definePeriodTokenValues = (tokensValues, tokenName) => {
    const temp = [];
    const result = {};
    Object.keys(tokensValues).forEach((key) => {
      temp.push({ date: Number(key), value: tokenName !== 'ETH' ? tokensValues[key][tokenName] : 1 });
    });
    temp.forEach((item, i) => {
      if (i === 7) {
        result.today = item.value;
      } else if (i === 6) {
        result.yesterday = item.value;
      } else if (i === 0) {
        result.lastWeek = item.value;
      }
    });
    return result;
  };

  const sync = async (req, res) => {
    const tokens = await weidexService.getAllTokensHttp();
    const today = Math.floor(Date.now() / 1000);
    let tokensValues = await weidexService.getTokensValuesHistoryHttp(today, 8);
    tokensValues = commonService.sortTokensByDateAsc(tokensValues);
    const tokenArray = await tokens.map(async (token) => {
      const bodyWrapper = Object.assign({ body: token });
      const tokenPricesByDate = definePeriodTokenValues(tokensValues, token.name);
      return syncCurrency(bodyWrapper, res, tokenPricesByDate);
    });
    await Promise.all(tokenArray).then(() => {
      console.log('================== END CURRENCY ==================');
    });
  };

  return {
    getCurrency,
    getAllCurrencies,
    sync,
  };
};

module.exports = currencyController;
