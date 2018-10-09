const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiAsset';

const weiAssetController = (repository) => {
  const createWeiAsset = async (req, res) => {
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

    await repository.create({ modelName,
      newObject: {
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
      },
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
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

  const updateWeiAsset = (req, res) => {
    const { id } = req.params;
    const weiAssetData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiAssetData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
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
    removeWeiAsset,
  };
};

module.exports = weiAssetController;
