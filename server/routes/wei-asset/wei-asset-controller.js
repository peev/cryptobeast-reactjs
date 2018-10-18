const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiAsset';

const weiAssetController = (repository) => {
  const weiPortfolioService = require('../../services/wei-portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);

  const getWeiCurrency = async (tokenNameParam) => {
    await repository.findOne({
      modelName: 'WeiCurrency',
      options: {
        where: {
          tokenName: tokenNameParam,
        },
      },
    })
      .catch(err => console.log(err));
  };

  const getWeiFiatFx = async () => {
    await repository.findOne({
      modelName: 'WeiFiatFx',
      options: {
        where: {
          fxName: 'ETH',
        },
      },
    })
      .catch(err => console.log(err));
  };

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
        lastPriceETH: lastPriceETHParam,
        lastPriceUSD: lastPriceETHParam * priceUSD,
        totalETH: req.fullAmount * lastPriceETHParam,
        totalUSD: (req.fullAmount * lastPriceETHParam) * priceUSD,
      };
    } catch (error) {
      console.log(error);
    }
    return newWeiAssetObject;
  };

  const updateAction = (req, res, id, weiCurrencyObject) => {
    const newWeiAssetData = Object.assign({}, weiCurrencyObject, id);
    repository.update({ modelName, updatedRecord: newWeiAssetData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const createAction = (req, res, weiAssetObject) => {
    repository.create({ modelName, newObject: weiAssetObject })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const createWeiAsset = async (req, res) => {
    const weiAssetData = req.body;

    try {
      const weiCurrency = await getWeiCurrency(weiAssetData.tokenName);
      const weiFiatFx = await getWeiFiatFx();
      const weiAssetObject = await createWeiAssetObject(weiAssetData, weiFiatFx.lastPriceETH, weiCurrency.priceUSD);

      const weiAssetFound = await repository.findOne({
        modelName,
        options: {
          where: {
            tokenName: weiAssetData.tokenName,
            weiPortfolioId: weiAssetData.weiPortfolioId,
          },
        },
      });

      if (weiAssetFound === null) {
        createAction(req, res, weiAssetObject);
      } else {
        updateAction(req, res, weiAssetFound.id, weiAssetObject);
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
    const weiAssetObject = await createWeiAssetObject(weiAssetData, weiFiatFx.lastPriceETH, weiCurrency.priceUSD);

    updateAction(req, res, { id }, weiAssetObject);
  };

  const updateWeiAssetWeight = async (req, res) => {
    const { id } = req.params;

    const weiAssetData = await repository.findById({ modelName, id });

    const portfolio = await repository.findOne({
      modelName: 'WeiPortfolio',
      options: {
        where: { id: weiAssetData.weiPortfolioId },
        include: [{ all: true }],
      },
    });

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
  };

  const removeWeiAsset = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (portfolioId) => {
    const portfolio = await repository.findOne({
      modelName: 'WeiPortfolio',
      options: {
        where: {
          id: portfolioId,
        },
      },
    });

    const assets = await WeidexService.getBalanceByUser(portfolio.userAddress)
      .then(res => res.json())
      .catch(error => console.log(error));

    assets.forEach(async (asset) => {
      const assetObject = Object.assign({}, asset, { weiPortfolioId: Number(portfolioId) });
      const bodyWrapper = Object.assign({ body: assetObject });
      await createWeiAsset(bodyWrapper);
    });


    // const ethToUsd = await repository.findOne({
    //   modelName: 'WeiFiatFx',
    //   options: {
    //     where: {
    //       fxName: 'ETH',
    //     },
    //   },
    // });
    // await repository.find({ modelName: 'WeiFiatFx' }).then((currencies) => {

    //   console.log('------------------------------------');
    //   console.log(currencies);
    //   console.log('------------------------------------');
    //   // Update the usd price of all currencies
    //   currencies.forEach(async (currency) => {
    //     await repository.findOne({
    //       modelName,
    //       options: {
    //         where: {
    //           tokenName: weiAssetData.tokenName,
    //           weiPortfolioId: weiAssetData.weiPortfolioId,
    //         },
    //       },
    //     }).then((asset) => {
    //       const assetObject = {
    //         id: asset.id,
    //         lastPriceETH: currency.lastPriceETH,
    //         lastPriceUSD: currency.lastPriceETH * ethToUsd.priceUSD,
    //         totalETH: asset.fullAmount * currency.lastPriceETH,
    //         totalUSD: (asset.fullAmount * currency.lastPriceETH) * ethToUsd.priceUSD,
    //       };
    //       repository.update({ modelName, updatedRecord: assetObject })
    //         .then((response) => {
    //           // TODO: Handle the response based on all items on all controllers ready
    //         })
    //         .catch(error => res.json(error));
    //     });
    //   });
    // });
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
