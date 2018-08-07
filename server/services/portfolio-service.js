const { CronJob } = require('cron');

const portfolioService = (repository) => {
  const modelName = 'Portfolio';

  const updateAssetBTCEquivalent = asset => new Promise((resolve) => {
    let assetPair;
    let lastBTCEquivalent;
    let updatedRecord;

    switch (asset.currency) {
      case 'BTC':
        lastBTCEquivalent = asset.balance;
        updatedRecord = { id: asset.id, lastBTCEquivalent };
        repository.update({ modelName: 'Asset', updatedRecord })
          .then(() => {
            resolve(updatedRecord);
          });
        break;
      case 'USDT':
        assetPair = `${asset.currency}-BTC`;
        repository.findOne({ modelName: 'MarketSummary', options: { where: { MarketName: assetPair } } })
          .then((foundSummary) => {
            lastBTCEquivalent = asset.balance / foundSummary.dataValues.Last;
            updatedRecord = { id: asset.id, lastBTCEquivalent };
            repository.update({ modelName: 'Asset', updatedRecord })
              .then(() => {
                resolve(updatedRecord);
              });
          });
        break;
      case 'USD':
      case 'JPY':
      case 'EUR':
        assetPair = asset.currency;
        repository.findById({ modelName: 'Ticker', id: assetPair })
          .then((foundTickers) => {
            lastBTCEquivalent = asset.balance / foundTickers.last;
            updatedRecord = { id: asset.id, lastBTCEquivalent };
            repository.update({ modelName: 'Asset', updatedRecord })
              .then(() => {
                resolve(updatedRecord);
              });
          });
        break;
      default:
        assetPair = `BTC-${asset.currency}`;
        repository.findOne({ modelName: 'MarketSummary', options: { where: { MarketName: assetPair } } })
          .then((foundSummary) => {
            lastBTCEquivalent = asset.balance * foundSummary.dataValues.Last;
            updatedRecord = { id: asset.id, lastBTCEquivalent };
            repository.update({ modelName: 'Asset', updatedRecord })
              .then(() => {
                resolve(updatedRecord);
              });
          });
        break;
    }
  });


  const updatePortfolioBTCEquivalent = async (portfolioId) => {
    const portfolio = await repository.findOne({
      modelName,
      options: {
        where: { id: portfolioId },
        include: [{ all: true }],
      },
    });

    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets.map(asset => updateAssetBTCEquivalent(asset)))
        .then((assets) => {
          const cost = assets.reduce((acc, a) => acc + a.lastBTCEquivalent, 0);
          const updatedRecord = { id: portfolio.id, cost };
          return repository.update({ modelName, updatedRecord });
        });
    }
    return Promise.resolve(); // just for the sake of eslint rule consistent-returns
  };

  const calcSharePrice = async (portfolioId) => {
    const portfolio = await repository.findById({ modelName: 'Portfolio', id: portfolioId });
    const usdTicker = await repository.findOne({ modelName: 'Ticker', options: { where: { pair: 'USD' } } });

    return portfolio.shares === 0 ? 1 : ((portfolio.cost * usdTicker.last) / portfolio.shares);
  };

  const createSaveClosingSharePriceJob = async (portfolioId) => {
    // const { userId } = await repository.findById({ modelName, id: portfolioId });
    // const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    // const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const [hours, minutes] = [23, 59];
    return new CronJob({
      cronTime: `${minutes} ${hours} * * *`,
      onTick: async () => {
        // Load assets from pf here to get current values
        try {
          await updatePortfolioBTCEquivalent(portfolioId);
        } catch (err) {
          console.log(err); // eslint-disable-line
        }
        const sharePrice = await calcSharePrice(portfolioId);
        repository.create({ modelName: 'SharePrice', newObject: { price: sharePrice, portfolioId, isClosingPrice: true } });
      },
      start: true,
      // timeZone: 'America/Los_Angeles',
    });
  };

  const createSaveOpeningSharePriceJob = async (portfolioId) => {
    // const { userId } = await repository.findById({ modelName, id: portfolioId });
    // const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    // const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const [hours, minutes] = [23, 59];
    return new CronJob({
      cronTime: `1 ${minutes} ${hours} * * *`,
      onTick: async () => {
        // Load assets from pf here to get current values
        try {
          await updatePortfolioBTCEquivalent(portfolioId);
        } catch (err) {
          console.log(err); // eslint-disable-line
        }
        const sharePrice = await calcSharePrice(portfolioId);
        repository.create({ modelName: 'SharePrice', newObject: { price: sharePrice, portfolioId, isClosingPrice: false } });
      },
      start: true,
      // timeZone: 'America/Los_Angeles',
    });
  };

  const createSaveClosingPortfolioCostJob = async (portfolioId) => {
    // const { userId } = await repository.findById({ modelName, id: portfolioId });
    // const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    // const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const [hours, minutes] = [23, 59];
    return new CronJob({
      cronTime: `${minutes} ${hours} * * *`,
      onTick: async () => {
        // Load assets from pf here to get current values
        try {
          await updatePortfolioBTCEquivalent(portfolioId);
        } catch (err) {
          console.log(err); // eslint-disable-line
        }
        const { cost } = await repository.findById({ modelName, id: portfolioId });
        repository.create({ modelName: 'PortfolioPrice', newObject: { price: cost, portfolioId } });
      },
      start: true,
      // timeZone: 'America/Los_Angeles',
    });
  };

  const initializeAllJobs = async (createJobFunction) => {
    const jobs = {}; // key = pf id, value = job
    const allPortfolios = await repository.find({ modelName }); // with lazy loading
    allPortfolios.forEach(async (pf) => {
      const spJob = await createJobFunction(pf.id);
      spJob.start();
      jobs[pf.id] = spJob;
    });

    return jobs;
  };

  return {
    updateAssetBTCEquivalent,
    updatePortfolioBTCEquivalent,
    calcSharePrice,
    createSaveClosingSharePriceJob,
    createSaveOpeningSharePriceJob,
    createSaveClosingPortfolioCostJob,
    initializeAllJobs,
  };
};

module.exports = portfolioService;
