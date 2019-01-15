const modelName = 'Asset';

const assetController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  const commonService = require('../../services/common-methods-service')();

  const createAssetObject = async (req, lastPriceETHParam, priceUSD) => {
    let newAssetObject;
    try {
      newAssetObject = {
        tokenName: req.tokenName,
        userID: req.userAddress,
        balance: req.fullAmount,
        available: req.availableAmount,
        inOrder: bigNumberService.difference(req.fullAmount, req.availableAmount),
        portfolioId: req.portfolioId,
        // eslint-disable-next-line no-nested-ternary
        lastPriceETH: lastPriceETHParam !== null && lastPriceETHParam !== undefined ? lastPriceETHParam : req.tokenName === 'ETH' ? 1 : 0,
        lastPriceUSD: bigNumberService.product(lastPriceETHParam, priceUSD) || 0,
        totalETH: bigNumberService.product(req.fullAmount, lastPriceETHParam) || 0,
        totalUSD: commonService.tokenToEthToUsd(req.fullAmount, lastPriceETHParam, priceUSD) || 0,
        weight: 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newAssetObject;
  };

  const updateAction = async (req, res, id, assetObject, isSyncing) => {
    const newAssetData = Object.assign({}, assetObject, { id });
    return repository.update({ modelName, updatedRecord: newAssetData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = async (req, res, assetObject, isSyncing) =>
    repository.create({ modelName, newObject: assetObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));

  const syncAsset = async (req, res, lastPriceUSD) => {
    const assetData = req.body;

    try {
      const currency = await intReqService.getCurrencyByTokenName(assetData.tokenName);
      const assetObject = await createAssetObject(assetData, currency.lastPriceETH, lastPriceUSD);
      const assetFound = await intReqService.getAssetByPortfolioIdAndTokenName(assetData.portfolioId, assetData.tokenName);

      if (assetFound === null || assetFound === undefined) {
        await createAction(req, res, assetObject, true);
      } else {
        await updateAction(req, res, Number(assetFound.id), assetObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAsset = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const calculateTokenValueETH = async (tokenName, amount) => {
    const currency = await intReqService.getCurrencyByTokenName(tokenName);
    return bigNumberService.product(amount, currency.lastPriceETH);
  };

  const calcPortfolioTotalValueETH = async (portfolio) => {
    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets
        .map(async asset => calculateTokenValueETH(asset.tokenName, asset.balance)))
        .then(assets => assets.reduce((acc, a) => (bigNumberService.sum(acc, a)), 0));
    }
    return Promise.resolve();
  };

  const updateAssetsWeight = async (req, res, idParam) => {
    try {
      const portfolio = await intReqService.getPortfolioByIdIncludeAll(idParam);
      const portfolioTotalValue = await calcPortfolioTotalValueETH(portfolio);

      await Promise.all(portfolio.assets.map(async (asset) => {
        const assetValue = await calculateTokenValueETH(asset.tokenName, asset.balance);
        const result = (portfolioTotalValue !== 0) ?
          bigNumberService.quotient(bigNumberService.product(assetValue, 100), portfolioTotalValue) : 0;
        const newAssetData = Object.assign(asset, { weight: result });

        await updateAction(req, res, Number(asset.id), newAssetData.dataValues, true);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getPeriodValue = (period) => {
    switch (period) {
      case 'w': return 8;
      case 'm': return 32;
      case 'y': return 366;
      default: return 0;
    }
  };

  const getDatesArray = (period) => {
    const interval = 1000 * 60 * 60 * 24;
    const startOfDay = Math.floor(Date.now() / interval) * interval;
    let endOfDay = (startOfDay + interval) - 1;
    const arr = [];

    for (let i = 0; i < getPeriodValue(period); i += 1) {
      endOfDay -= interval;
      arr.push(endOfDay);
    }
    return arr;
  };

  const resolveDates = async (req, res, datesArr, tokenId) => {
    try {
      return datesArr.map(async (item) => {
        const date = (item - (item % 1000)) / 1000;
        return {
          date,
          value: await weidexService.getTokenValueByTimestampHttp(Number(tokenId), date)
            .then(data => ((data.length > 0) ? data : 0))
            .catch(err => res.status(500).send(err)),
        };
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  };

  const getAssetPriceHistory = async (req, res) => {
    const { tokenId } = req.params;
    const { period } = req.params;
    const datesArr = getDatesArray(period);

    try {
      const result = await resolveDates(req, res, datesArr, tokenId);
      return Promise.all(result).then(data => res.status(200).send(data));
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  };

  const getTokenPriceByDate = async (timestamp) => {
    const currencies = await intReqService.getCurrencies();
    const result = currencies.map(async (currency) => {
      const tokenValue = (currency.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, timestamp);
      return {
        timestamp,
        tokenName: currency.tokenName,
        value: tokenValue,
      };
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

  const getTokensPriceByDate = async (timestamps) => {
    const result = timestamps.map(async (timestamp) => {
      const tokenPrice = await getTokenPriceByDate(timestamp);
      return tokenPrice;
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

  const defineTokenPricesArr = async (tokenPricesArr, balance, timestamp, ethToUsd) => {
    const result = tokenPricesArr.map(async (token) => {
      if (balance.tokenName === token.tokenName) {
        return {
          tokenName: balance.tokenName,
          amount: balance.amount,
          price: token.value,
          total: bigNumberService.product(balance.amount, token.value),
          totalUsd: await commonService.tokenToEthToUsd(balance.amount, token.value, ethToUsd.priceUsd),
        };
      }
      return null;
    });
    return Promise.all(result).then((data) => {
      const filtered = data.filter(el => el !== null);
      return filtered[0];
    });
  };

  const resolveAssets = async (balancesArr, tokenPricesArr, timestamp, ethPriceHistory) => {
    const ethToUsd = ethPriceHistory.find(item => (item.timestamp === timestamp));
    const result = await balancesArr.map(async balance =>
      defineTokenPricesArr(tokenPricesArr, balance, timestamp, ethToUsd));
    return Promise.all(result).then(data => ({ timestamp, assets: data }));
  };

  /**
   * Gets timestamps, token prices and token balance for each day,
   * multiply balance by price.
   * @param {*} timestamps
   * @param {*} tokenPrices
   * @param {*} balances
   * @param {*} ethPriceHistory
   */
  const calculatePortfolioAssetsValueHistory = async (timestamps, tokenPrices, balances, ethPriceHistory) => {
    const result = timestamps.map(async (timestamp, index) => {
      const balancesArr = balances[index].balance;
      const tokenPricesArr = tokenPrices[index];
      return resolveAssets(balancesArr, tokenPricesArr, timestamp, ethPriceHistory);
    });
    return Promise.all(result).then(data => data);
  };

  const getAssetsValueHistory = async (req, res) => {
    const { id } = req.params;
    try {
      const allocations = await intReqService.getAllocationsByPortfolioIdAsc(id);
      const today = new Date().getTime();
      const begin = new Date((allocations[0].timestamp).toString()).getTime();
      const timestamps = commonService.calculateDays(commonService.getEndOfDay(begin), commonService.getEndOfDay(today));
      const tokenPricesByDate = await getTokensPriceByDate(timestamps);
      const balances = await commonService.getBalancesByDate(timestamps, allocations);
      const filledPreviousBalances = commonService.fillPreviousBalances(balances);
      const ethHistory = await commonService.getEthHistoryDayValue(timestamps[0], timestamps[timestamps.length - 1]);
      const ethPriceHistory = commonService.defineEthHistory(timestamps, ethHistory);
      const portfolioValueHistory = await calculatePortfolioAssetsValueHistory(timestamps, tokenPricesByDate, filledPreviousBalances, ethPriceHistory);
      res.status(200).send(portfolioValueHistory);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const syncAssets = async (req, res, assets, lastPriceUSD, portfolioIdParam) => {
    try {
      await Promise.all(assets.map(async (asset) => {
        const addPortfolioId = Object.assign({}, asset, { portfolioId: portfolioIdParam });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        return syncAsset(bodyWrapper, res, lastPriceUSD);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const sync = async (req, res, addresses) => {
    const addressesArray = addresses.map(async (address) => {
      try {
        const lastPriceUSD = await commonService.getEthToUsdNow();
        const portfolio = await intReqService.getPortfolioByUserAddress(address);
        const assets = await weidexService.getBalanceByUserHttp(portfolio.userAddress);

        await syncAssets(req, res, assets, lastPriceUSD, portfolio.id);
        await updateAssetsWeight(req, res, portfolio.id);
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(addressesArray).then(() => {
      console.log('================== END ASSETS =========================================');
    });
  };

  return {
    getAsset,
    getAssetPriceHistory,
    sync,
    getAssetsValueHistory,
  };
};

module.exports = assetController;
