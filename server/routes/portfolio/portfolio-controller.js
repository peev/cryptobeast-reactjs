const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const weiPortfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);

  const getPortfolioObject = async address => repository.findOne({
    modelName,
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioWholeObject = async address => repository.findOne({
    modelName,
    options: {
      where: {
        userAddress: address,
      },
      include: [{ all: true }],
    },
  })
    .catch(err => console.log(err));

  const createWeiAssetObject = (address, id, investment) => {
    const weiPortfolio = {
      userAddress: address,
      userID: id,
      totalInvestmentETH: investment || 0,
      totalInvestmentUSD: null,
    };
    return weiPortfolio;
  };

  const updateAction = (req, res, id, weiPortfolioObject, isSyncing) => {
    const newWeiAssetData = Object.assign({}, weiPortfolioObject, { id });
    repository.update({ modelName, updatedRecord: newWeiAssetData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, weiPortfolioObject, isSyncing) => {
    repository.create({ modelName, newObject: weiPortfolioObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const weiPorfolioFound = await getPortfolioWholeObject(user.address);

      if (weiPorfolioFound === null) {
        const newPortfolioObject = createWeiAssetObject(user.address, user.id, 0);
        await createAction(req, res, newPortfolioObject, false);
      } else {
        const totalInvestment = await weiPortfolioService.calcPortfolioTotalInvestmentETH(weiPorfolioFound);
        const newPortfolioObject = createWeiAssetObject(user.address, user.id, totalInvestment);
        await updateAction(req, res, Number(weiPorfolioFound.id), newPortfolioObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const weiPorfolioFound = await getPortfolioWholeObject(user.address);

      if (weiPorfolioFound === null) {
        const newPortfolioObject = createWeiAssetObject(user.address, user.id, 0);
        await createAction(req, res, newPortfolioObject, true);
      } else {
        const totalInvestment = await weiPortfolioService.calcPortfolioTotalInvestmentETH(weiPorfolioFound);
        const newPortfolioObject = createWeiAssetObject(user.address, user.id, totalInvestment);
        await updateAction(req, res, Number(weiPorfolioFound.id), newPortfolioObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePortfolio = async (req, res) => {
    const { id } = req.params;
    const weiPortfolioData = Object.assign({}, req.body, { id });
    return updateAction(req, res, Number(id), weiPortfolioData, false);
  };


  const updatePortfolioTotalInvestment = async (req, res, address) => {
    const weiPortfolioFound = await getPortfolioWholeObject(address);

    if (weiPortfolioFound.weiTransactions !== 0) {
      await weiPortfolioService.calcPortfolioTotalInvestmentETH(weiPortfolioFound).then((data) => {
        weiPortfolioFound.totalInvestment = data;
        const weiPortfolioData = Object.assign({}, weiPortfolioFound, { id: weiPortfolioFound.id, totalInvestment: data });
        repository.update({ modelName, updatedRecord: weiPortfolioData })
          .then((response) => { res.status(200).send(response); })
          .catch(error => res.json(error));
      });
    }
  };

  const getPortfolio = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, address) => {
    try {
      const weiPortfolio = await WeidexService.getUser(address)
        .then(data => data.json())
        .catch(error => console.log(error));

      const bodyWrapper = Object.assign({ body: weiPortfolio });
      return syncPortfolio(bodyWrapper, res);
    } catch (error) {
      console.log(error);
    }
  };
    // Promise.resolve(resolvedFinalArray)
    //   .then(() => updateWeiAssetsWeight(req, res, portfolioId))
    //   .catch(error => console.log(error));

  return {
    createPortfolio,
    updatePortfolio,
    updatePortfolioTotalInvestment,
    getPortfolio,
    removePortfolio,
    sync,
  };
};

module.exports = portfolioController;
