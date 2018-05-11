const { CronJob } = require('cron');

const portfolioService = (repository) => {
  const modelName = 'Portfolio';

  const updateAssetBTCEquivalent = (asset) => {
    return new Promise((resolve, reject) => {
      let assetPair;
      let lastBTCEquivalent;
      let updatedRecord;

      switch (asset.currency) {
        case 'BTC':
          lastBTCEquivalent = asset.balance;
          resolve(updatedRecord = { id: asset.id, lastBTCEquivalent });
          repository.update({ modelName: 'Asset', updatedRecord });
          break;
        case 'USDT':
          assetPair = `${asset.currency}-BTC`;
          repository.findById({ modelName: 'Ticker', id: assetPair })
            .then((foundTickers) => {
              lastBTCEquivalent = asset.balance / foundTickers.last;
              resolve(updatedRecord = { id: asset.id, lastBTCEquivalent });
              repository.update({ modelName: 'Asset', updatedRecord });
            });
          break;
        case 'USD':
        case 'JPY':
        case 'EUR':
          assetPair = asset.currency;
          repository.findById({ modelName: 'Ticker', id: assetPair })
            .then((foundTickers) => {
              lastBTCEquivalent = asset.balance / foundTickers.last;
              resolve(updatedRecord = { id: asset.id, lastBTCEquivalent });
              repository.update({ modelName: 'Asset', updatedRecord });
            });
          break;
        default:
          assetPair = `BTC-${asset.currency}`;
          repository.findById({ modelName: 'Ticker', id: assetPair })
            .then((foundTickers) => {
              lastBTCEquivalent = asset.balance * foundTickers.last;
              resolve(updatedRecord = { id: asset.id, lastBTCEquivalent });
              repository.update({ modelName: 'Asset', updatedRecord });
            });
          break;
      }
    });
  };

  const updatePortfolioBTCEquivalent = async (portfolioId) => {
    const portfolio = await repository.findOne({
      modelName,
      options: {
        where: { id: portfolioId },
        include: [{ all: true }],
      },
    });

    if (portfolio.assets !== 0) {
      return Promise.all(portfolio.assets.map((asset) => {
        return updateAssetBTCEquivalent(asset);
      }))
        .then((assets) => {
          const cost = assets.reduce((acc, a) => acc + a.lastBTCEquivalent, 0);
          const updatedRecord = { id: portfolio.id, cost };
          return repository.update({ modelName, updatedRecord });
        });
    }
  };

  const calcSharePrice = async (portfolioId) => {
    const portfolio = await repository.findById({ modelName: 'Portfolio', id: portfolioId });
    const usdTicker = await repository.findOne({ modelName: 'Ticker', options: { where: { pair: 'USD' } } });

    return portfolio.shares === 0 ? 1 : ((portfolio.cost * usdTicker.last) / portfolio.shares);
  };

  const createSaveClosingSharePriceJob = async (portfolioId) => {
    const { userId } = await repository.findById({ modelName, id: portfolioId });
    const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const job = new CronJob(`${minutes} ${hours} * * *`, async () => {
      // Load assets from pf here to get current values
      await updatePortfolioBTCEquivalent(portfolioId);
      const sharePrice = await calcSharePrice(portfolioId);
      repository.create({ modelName: 'SharePrice', newObject: { price: sharePrice, portfolioId, isClosingPrice: true } });
    }, () => {
      /* This function is executed when the job stops */
      console.log('Save closing share price job stopped!');
    }, true, /* Start the job right now */
      // timeZone /* Time zone of this job. */
    );
    return job;
  };

  const createSaveOpeningSharePriceJob = async (portfolioId) => {
    const { userId } = await repository.findById({ modelName, id: portfolioId });
    const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const job = new CronJob(`1 ${minutes} ${hours} * * *`, async () => { // 1 second after closing time
      // Load assets from pf here to get current values
      await updatePortfolioBTCEquivalent(portfolioId);
      const sharePrice = await calcSharePrice(portfolioId);
      repository.create({ modelName: 'SharePrice', newObject: { price: sharePrice, portfolioId, isClosingPrice: false } });
    }, () => {
      /* This function is executed when the job stops */
      console.log('Save opening share price job stopped!');
    }, true, /* Start the job right now */
      // timeZone /* Time zone of this job. */
    );
    return job;
  };

  const createSaveClosingPortfolioCostJob = async (portfolioId) => {
    const { userId } = await repository.findById({ modelName, id: portfolioId });
    const closingTime = await repository.findOne({ modelName: 'Setting', options: { where: { name: 'Closing time', userId } } });
    const [hours, minutes] = closingTime ? closingTime.value.split(':') : [23, 59];
    const job = new CronJob(`${minutes} ${hours} * * *`, async () => {
      // Load assets from pf here to get current values
      await updatePortfolioBTCEquivalent(portfolioId);
      const { cost } = await repository.findById({ modelName, id: portfolioId });
      repository.create({ modelName: 'PortfolioPrice', newObject: { price: cost, portfolioId } });
    }, () => {
      /* This function is executed when the job stops */
      console.log('Save closing portfolio cost job stopped!');
    }, true, /* Start the job right now */
      // timeZone /* Time zone of this job. */
    );
    return job;
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
