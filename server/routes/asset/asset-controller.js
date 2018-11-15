const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'Asset';

const assetController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service');

  const getCurrency = async tokenNameParam => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName: tokenNameParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getAssetObject = async (tokenNameParam, portfolioIdParam) => repository.findOne({
    modelName,
    options: {
      where: {
        tokenName: tokenNameParam,
        portfolioId: portfolioIdParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioObject = async portfolioId => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        id: portfolioId,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioObjectIncludeAll = async idParam => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: { id: idParam },
      include: [{ all: true }],
    },
  })
    .catch(err => console.log(err));

  const createAssetObject = async (req, lastPriceETHParam, priceUSD) => {
    let newAssetObject;
    try {
      newAssetObject = {
        tokenName: req.tokenName,
        userID: req.userAddress,
        balance: req.fullAmount,
        available: req.availableAmount,
        inOrder: bigNumberService().difference(req.fullAmount, req.availableAmount),
        portfolioId: req.portfolioId,
        // eslint-disable-next-line no-nested-ternary
        lastPriceETH: lastPriceETHParam !== null && lastPriceETHParam !== undefined ? lastPriceETHParam : req.tokenName === 'ETH' ? 1 : 0,
        lastPriceUSD: bigNumberService().product(lastPriceETHParam, priceUSD) || 0,
        totalETH: bigNumberService().product(req.fullAmount, lastPriceETHParam) || 0,
        totalUSD: bigNumberService().product(bigNumberService().product(req.fullAmount, lastPriceETHParam), priceUSD) || 0,
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

  const createAction = async (req, res, assetObject, isSyncing) => {
    return repository.create({ modelName, newObject: assetObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAsset = async (req, res) => {
    const assetData = req.body;

    try {
      const lastPriceUSD = await etherScanServices().getETHUSDPrice();
      const currency = await getCurrency(assetData.tokenName);
      const assetObject = await createAssetObject(assetData, currency.lastPriceETH, lastPriceUSD);
      const assetFound = await getAssetObject(assetData.tokenName, assetData.portfolioId);

      if (assetFound === null) {
        await createAction(req, res, assetObject, false);
      } else {
        await updateAction(req, res, Number(assetFound.id), assetObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncAsset = async (req, res, lastPriceUSD) => {
    const assetData = req.body;

    try {
      const currency = await getCurrency(assetData.tokenName);
      const assetObject = await createAssetObject(assetData, currency.lastPriceETH, lastPriceUSD);
      const assetFound = await getAssetObject(assetData.tokenName, assetData.portfolioId);

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

  const updateAsset = async (req, res) => {
    const { id } = req.params;
    const assetData = req.body;

    const currency = await getCurrency(assetData.tokenName);
    const lastPriceUSD = await etherScanServices().getETHUSDPrice();
    const assetObject = await createAssetObject(assetData, currency.lastPriceETH, lastPriceUSD);

    await updateAction(req, res, Number(id), assetObject, false);
  };

  const updateAssetWeight = async (req, res) => {
    const { id } = req.params;

    try {
      const assetData = await repository.findById({ modelName, id });
      const portfolio = await getPortfolioObject(assetData.portfolioId);

      if (portfolio.assets !== 0) {
        const assetValue = await portfolioService.calculateTokenValueETH(assetData.tokenName, assetData.balance);
        await portfolioService.calcPortfolioTotalValueETH(portfolio).then((portfolioValue) => {
          const result = bigNumberService().quotient(bigNumberService().product(assetValue, 100), portfolioValue);
          const newAssetData = Object.assign({}, assetData, { id: assetData.id, weight: result });
          repository.update({ modelName, updatedRecord: newAssetData })
            .then((response) => { res.status(200).send(response); })
            .catch(error => res.json(error));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAssetsWeight = async (req, res, idParam) => {
    try {
      const portfolio = await getPortfolioObjectIncludeAll(idParam);
      const portfolioTotalValue = await portfolioService.calcPortfolioTotalValueETH(portfolio);

      await Promise.all(portfolio.assets.map(async (asset) => {
        const assetValue = await portfolioService.calculateTokenValueETH(asset.tokenName, asset.balance);
        const result = (portfolioTotalValue !== 0) ?
          bigNumberService().quotient(bigNumberService().product(assetValue, 100), portfolioTotalValue) : 0;
        const newAssetData = Object.assign(asset, { weight: result });

        await updateAction(req, res, Number(asset.id), newAssetData.dataValues, true);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const removeAsset = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const getPeriodValue = (period) => {
    switch (period) {
      case 'w': return 7;
      case 'm': return 31;
      case 'y': return 365;
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

  const resolveDates = async (datesArr, tokenId) => {
    try {
      return datesArr.map(async item => ({
        date: item,
        value: await WeidexService.getTokenValueByTimestampHttp(Number(tokenId), item).then(data => data),
      }));
    } catch (error) {
      return console.log(error);
    }
  };

  const getAssetPriceHistory = async (req, res) => {
    const { tokenId } = req.params;
    const { period } = req.params;
    const datesArr = getDatesArray(period);

    try {
      const result = await resolveDates(datesArr, tokenId);
      return Promise.all(result).then(data => res.status(200).send(data));
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
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
        const lastPriceUSD = await etherScanServices().getETHUSDPrice();
        const portfolio = await getPortfolioObjectByAddress(address);
        const assets = await WeidexService.getBalanceByUserHttp(portfolio.userAddress);

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
    createAsset,
    getAsset,
    updateAsset,
    updateAssetWeight,
    removeAsset,
    getAssetPriceHistory,
    sync,
  };
};

module.exports = assetController;
