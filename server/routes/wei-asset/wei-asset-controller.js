const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiAsset';

const weiAssetController = (repository) => {
  const weiPortfolioService = require('../../services/wei-portfolio-service')(repository);

  const createWeiAsset = async (req, res) => {
    const weiAssetData = req.body;

    const findAssetPromise = repository.findOne({
      modelName,
      options: {
        where: {
          currency: weiAssetData.tokenName,
          weiPortfolioId: weiAssetData.weiPortfolioId,
        },
      },
    });

    const currency = await repository.findOne({
      modelName: 'WeiCurrency',
      options: {
        where: {
          tokenName: weiAssetData.tokenName,
        },
      },
    });

    const ethToUsd = await repository.findOne({
      modelName: 'MarketSummary',
      options: {
        where: {
          MarketName: 'USD-ETH',
        },
      },
    });

    const assetObject = {
      currency: weiAssetData.tokenName,
      userID: weiAssetData.userAddress,
      balance: weiAssetData.fullAmount,
      available: weiAssetData.availableAmount,
      inOrder: weiAssetData.fullAmount - weiAssetData.availableAmount,
      weiPortfolioId: weiAssetData.weiPortfolioId,
      lastPriceETH: currency.lastPriceETH,
      lastPriceUSD: currency.lastPriceETH * ethToUsd.Last,
      totalETH: weiAssetData.fullAmount * currency.lastPriceETH,
      totalUSD: (weiAssetData.fullAmount * currency.lastPriceETH) * ethToUsd.Last,
    };

    findAssetPromise
      .then(async (asset) => {
        if (!asset) {
          await repository.create({ modelName, assetObject })
            .then((response) => {
              res.status(200).send(response);
            })
            .catch((error) => {
              res.json(error);
            });
        } else {
          const newWeiAssetData = Object.assign({}, assetObject, { id: asset.id });
          repository.update({ modelName, updatedRecord: newWeiAssetData })
            .then((response) => {
              res.status(200).send(response);
            })
            .catch(error => res.json(error));
        }
      });
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

    const currency = await repository.findOne({
      modelName: 'WeiCurrency',
      options: {
        where: {
          tokenName: weiAssetData.tokenName,
        },
      },
    });

    const ethToUsd = await repository.findOne({
      modelName: 'MarketSummary',
      options: {
        where: {
          MarketName: 'USD-ETH',
        },
      },
    });

    const assetObject = {
      currency: weiAssetData.tokenName,
      userID: weiAssetData.userAddress,
      balance: weiAssetData.fullAmount,
      available: weiAssetData.availableAmount,
      inOrder: weiAssetData.fullAmount - weiAssetData.availableAmount,
      weiPortfolioId: weiAssetData.weiPortfolioId,
      lastPriceETH: currency.lastPriceETH,
      lastPriceUSD: currency.lastPriceETH * ethToUsd.Last,
      totalETH: weiAssetData.fullAmount * currency.lastPriceETH,
      totalUSD: (weiAssetData.fullAmount * currency.lastPriceETH) * ethToUsd.Last,
    };

    const newWeiAssetData = Object.assign({}, assetObject, { id });
    repository.update({ modelName, updatedRecord: newWeiAssetData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
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
          .calculateTokenValueETH(weiAssetData.currency, weiAssetData.balance));
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

  return {
    createWeiAsset,
    getWeiAsset,
    updateWeiAsset,
    updateWeiAssetWeight,
    removeWeiAsset,
  };
};

module.exports = weiAssetController;
