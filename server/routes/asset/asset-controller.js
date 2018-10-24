const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Asset';

const assetController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);

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

  const getWeiFiatFx = async () => repository.findOne({
    modelName: 'FiatFx',
    options: {
      where: {
        fxName: 'ETH',
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiPortfolioObject = async portfolioId => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        id: portfolioId,
      },
    },
  })
    .catch(err => console.log(err));

  const getWeiPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
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
        inOrder: req.fullAmount - req.availableAmount,
        portfolioId: req.portfolioId,
        lastPriceETH: lastPriceETHParam || 0,
        lastPriceUSD: lastPriceETHParam * priceUSD,
        totalETH: req.fullAmount * lastPriceETHParam,
        totalUSD: (req.fullAmount * lastPriceETHParam) * priceUSD,
        weight: 0,
      };
    } catch (error) {
      console.log(error);
    }
    return newAssetObject;
  };

  const updateAction = (req, res, id, weiAssetObject, isSyncing) => {
    const newAssetData = Object.assign({}, weiAssetObject, { id });
    repository.update({ modelName, updatedRecord: newAssetData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, weiAssetObject, isSyncing) => {
    repository.create({ modelName, newObject: weiAssetObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAsset = async (req, res) => {
    const weiAssetData = req.body;

    try {
      const weiCurrency = await getCurrency(weiAssetData.tokenName);
      const weiFiatFx = await getWeiFiatFx();
      const weiAssetObject = await createAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);
      const weiAssetFound = await getAssetObject(weiAssetData.tokenName, weiAssetData.portfolioId);

      if (weiAssetFound === null) {
        await createAction(req, res, weiAssetObject, false);
      } else {
        await updateAction(req, res, Number(weiAssetFound.id), weiAssetObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncAsset = async (req, res) => {
    const weiAssetData = req.body;

    try {
      const weiCurrency = await getCurrency(weiAssetData.tokenName);
      const weiFiatFx = await getWeiFiatFx();
      const weiAssetObject = await createAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);
      const weiAssetFound = await getAssetObject(weiAssetData.tokenName, weiAssetData.portfolioId);

      if (weiAssetFound === null) {
        await createAction(req, res, weiAssetObject, true);
      } else {
        await updateAction(req, res, Number(weiAssetFound.id), weiAssetObject, true);
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
    const weiAssetData = req.body;

    const weiCurrency = await getCurrency(weiAssetData.tokenName);
    const weiFiatFx = await getWeiFiatFx();
    const weiAssetObject = await createAssetObject(weiAssetData, weiCurrency.lastPriceETH, weiFiatFx.priceUSD);

    updateAction(req, res, Number(id), weiAssetObject, false);
  };

  const updateAssetWeight = async (req, res) => {
    const { id } = req.params;

    try {
      const weiAssetData = await repository.findById({ modelName, id });
      const portfolio = await getWeiPortfolioObject(weiAssetData.portfolioId);

      if (portfolio.weiAssets !== 0) {
        const assetValue = await portfolioService.calculateTokenValueETH(weiAssetData.tokenName, weiAssetData.balance);
        await portfolioService.calcPortfolioTotalValueETH(portfolio).then((portfolioValue) => {
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

  const updateAssetsWeight = async (req, res, idParam) => {
    try {
      const portfolio = await repository.findOne({
        modelName: 'WeiPortfolio',
        options: {
          where: { id: idParam },
          include: [{ all: true }],
        },
      });
      const portfolioTotalValue = await portfolioService.calcPortfolioTotalValueETH(portfolio);

      await Promise.all(portfolio.weiAssets.map(async (asset) => {
        const assetValue = await portfolioService.calculateTokenValueETH(asset.tokenName, asset.balance);
        const result = (portfolioTotalValue !== 0) ? ((assetValue * 100) / portfolioTotalValue) : 0;
        const newAssetData = Object.assign(asset, { weight: result });

        updateAction(req, res, Number(asset.id), newAssetData.dataValues, true);
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

  const sync = async (req, res, addresses) => {
    addresses.map(async (address) => {
      const portfolio = await getWeiPortfolioObjectByAddress(address);
      const assets = await WeidexService.getBalanceByUser(portfolio.userAddress)
        .then(data => data.json())
        .catch(error => console.log(error));

      const resolvedFinalArray = await Promise.all(assets.map(async (asset) => { // map instead of forEach
        const addPortfolioId = Object.assign({}, asset, { portfolioId: portfolio.id });
        const bodyWrapper = Object.assign({ body: addPortfolioId });
        return syncAsset(bodyWrapper, res);
      }));
      Promise.resolve(resolvedFinalArray)
        .then(() => updateAssetsWeight(req, res, portfolio.id))
        .catch(error => console.log(error));
    });
  };

  return {
    createAsset,
    getAsset,
    updateAsset,
    updateAssetWeight,
    removeAsset,
    sync,
  };
};

module.exports = assetController;
