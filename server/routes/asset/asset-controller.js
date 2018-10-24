const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');

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

  const updateAction = (req, res, id, assetObject, isSyncing) => {
    const newAssetData = Object.assign({}, assetObject, { id });
    repository.update({ modelName, updatedRecord: newAssetData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, assetObject, isSyncing) => {
    repository.create({ modelName, newObject: assetObject })
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

      if (assetFound === null) {
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

    updateAction(req, res, Number(id), assetObject, false);
  };

  const updateAssetWeight = async (req, res) => {
    const { id } = req.params;

    try {
      const assetData = await repository.findById({ modelName, id });
      const portfolio = await getPortfolioObject(assetData.portfolioId);

      if (portfolio.assets !== 0) {
        const assetValue = await portfolioService.calculateTokenValueETH(assetData.tokenName, assetData.balance);
        await portfolioService.calcPortfolioTotalValueETH(portfolio).then((portfolioValue) => {
          const result = (assetValue * 100) / portfolioValue;
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
    const resolvedFinalArray = await Promise.all(addresses.map(async (address) => {
      try {
        const lastPriceUSD = await etherScanServices().getETHUSDPrice();
        const portfolio = await getPortfolioObjectByAddress(address);
        const assets = await WeidexService.getBalanceByUser(portfolio.userAddress)
          .then(data => data.json())
          .catch(error => console.log(error));

        await assets.map(async (asset) => {
          const addPortfolioId = Object.assign({}, asset, { portfolioId: portfolio.id });
          const bodyWrapper = Object.assign({ body: addPortfolioId });
          await syncAsset(bodyWrapper, res, lastPriceUSD);
        });

        await updateAssetsWeight(req, res, portfolio.id);
      } catch (error) {
        console.log(error);
      }
    }));
    return Promise.resolve(resolvedFinalArray)
      .then(() => console.log('=============== END OF ASSETS ======================================='))
      .catch(error => console.log(error));
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
