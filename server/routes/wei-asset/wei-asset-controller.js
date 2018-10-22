const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiAsset';

const weiAssetController = (repository) => {
  const weiPortfolioService = require('../../services/wei-portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);

  const getWeiCurrency = async tokenNameParam => repository.findOne({
    modelName: 'WeiCurrency',
    options: {
      where: {
        tokenName: tokenNameParam,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiAssetObject = async (tokenNameParam, portfolioId) => repository.findOne({
    modelName,
    options: {
      where: {
        tokenName: tokenNameParam,
        weiPortfolioId: portfolioId,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiFiatFx = async () => repository.findOne({
    modelName: 'WeiFiatFx',
    options: {
      where: {
        fxName: 'ETH',
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiPortfolioObject = async portfolioId => repository.findOne({
    modelName: 'WeiPortfolio',
    options: {
      where: {
        id: portfolioId,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'WeiPortfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const createWeiAssetObject = async (req, lastPriceETHParam, priceUSD) => {
    let newWeiAssetObject;
    try {
      newWeiAssetObject = {
        tokenName: req.tokenName,
        userID: req.userAddress,
        balance: req.fullAmount,
        available: req.availableAmount,
        inOrder: req.fullAmount - req.availableAmount,
        weiPortfolioId: req.weiPortfolioId,
        lastPriceETH: lastPriceETHParam || 0,
        lastPriceUSD: lastPriceETHParam * priceUSD,
        totalETH: req.fullAmount * lastPriceETHParam,
        totalUSD: (req.fullAmount * lastPriceETHParam) * priceUSD,
        weight: 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newWeiAssetObject;
  };

  const updateAction = (req, res, id, weiAssetObject, isSyncing) => {
    const newWeiAssetData = Object.assign({}, weiAssetObject, { id });
    repository.update({ modelName, updatedRecord: newWeiAssetData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, weiAssetObject, isSyncing) => {
    repository.create({ modelName, newObject: weiAssetObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createWeiAsset = async (req, res) => {
    const weiAssetData = req.body;

    try {
      const weiCurrency = await getWeiCurrency(weiAssetData.tokenName);
      const weiFiatFx = await getWeiFiatFx();
      const weiAssetObject = await createWeiAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);
      const weiAssetFound = await getWeiAssetObject(weiAssetData.tokenName, weiAssetData.weiPortfolioId);

      if (weiAssetFound === null) {
        await createAction(req, res, weiAssetObject, false);
      } else {
        await updateAction(req, res, Number(weiAssetFound.id), weiAssetObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncWeiAsset = async (req, res) => {
    const weiAssetData = req.body;

    try {
      const weiCurrency = await getWeiCurrency(weiAssetData.tokenName);
      const weiFiatFx = await getWeiFiatFx();
      const weiAssetObject = await createWeiAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);
      const weiAssetFound = await getWeiAssetObject(weiAssetData.tokenName, weiAssetData.weiPortfolioId);

      if (weiAssetFound === null) {
        await createAction(req, res, weiAssetObject, true);
      } else {
        await updateAction(req, res, Number(weiAssetFound.id), weiAssetObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWeiAsset = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiAsset = async (req, res) => {
    const { id } = req.params;
    const weiAssetData = req.body;

    const weiCurrency = await getWeiCurrency(weiAssetData.tokenName);
    const weiFiatFx = await getWeiFiatFx();
    const weiAssetObject = await createWeiAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);

    updateAction(req, res, Number(id), weiAssetObject, false);
  };

  const updateWeiAssetWeight = async (req, res) => {
    const { id } = req.params;

    try {
      const weiAssetData = await repository.findById({ modelName, id });
      const portfolio = await getWeiPortfolioObject(weiAssetData.weiPortfolioId);

      if (portfolio.weiAssets !== 0) {
        const assetValue = await weiPortfolioService
          .calculateEtherValueUSD(await weiPortfolioService
            .calculateTokenValueETH(weiAssetData.tokenName, weiAssetData.balance));
        await weiPortfolioService.calcPortfolioTotalValue(portfolio).then((portfolioValue) => {
          const result = (assetValue * 100) / portfolioValue;
          const newAssetData = Object.assign({}, weiAssetData, { id: weiAssetData.id, weight: result });
          repository.update({ modelName, updatedRecord: newAssetData })
            .then((response) => { res.status(200).send(response); })
            .catch(error => res.json(error));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateWeiAssetsWeight = async (req, res, idParam) => {
    try {
      const portfolio = await repository.findOne({
        modelName: 'WeiPortfolio',
        options: {
          where: { id: idParam },
          include: [{ all: true }],
        },
      });
      const portfolioTotalValue = await weiPortfolioService.calcPortfolioTotalValue(portfolio);

      await Promise.all(portfolio.weiAssets.map(async (asset) => {
        const assetValue = await weiPortfolioService
          .calculateEtherValueUSD(await weiPortfolioService
            .calculateTokenValueETH(asset.tokenName, asset.balance));
        const result = (portfolioTotalValue !== 0) ? ((assetValue * 100) / portfolioTotalValue) : 0;
        const newAssetData = Object.assign(asset, { weight: result });

        updateAction(req, res, Number(asset.id), newAssetData.dataValues, true);
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const removeWeiAsset = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, address) => {
    const portfolio = await getWeiPortfolioObjectByAddress(address);
    const assets = await WeidexService.getBalanceByUser(portfolio.userAddress)
      .then(data => data.json())
      .catch(error => console.log(error));

    const resolvedFinalArray = await Promise.all(assets.map(async (asset) => { // map instead of forEach
      const addPortfolioId = Object.assign({}, asset, { weiPortfolioId: portfolio.id });
      const bodyWrapper = Object.assign({ body: addPortfolioId });
      return syncWeiAsset(bodyWrapper, res);
    }));
    Promise.resolve(resolvedFinalArray)
      .then(() => updateWeiAssetsWeight(req, res, portfolio.id))
      .catch(error => console.log(error));
  };

  return {
    createWeiAsset,
    getWeiAsset,
    updateWeiAsset,
    updateWeiAssetWeight,
    removeWeiAsset,
    sync,
  };
};

module.exports = weiAssetController;
