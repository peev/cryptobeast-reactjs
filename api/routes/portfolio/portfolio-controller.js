const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const createPortfolio = (req, res) => {
    const portfolio = req.body;
    repository.create({ modelName, newObject: portfolio })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const getById = (req, res) => {
    repository.findById({ modelName, id: req.params.id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllPortfolios = (req, res) => {
    repository.find({
      modelName,
      options: { include: [{ all: true }] }, // Eager loading
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updatePortfolio = (req, res) => {
    const portfolioData = req.body;
    repository.update({ modelName, updatedRecord: portfolioData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  // TODO: Calculate prices in the front end ==============================
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

  const updatePortfolioBTCEquivalent = (req, res) => {
    repository.find({
      modelName,
      options: {
        where: { id: req.body.id },
        include: [{ all: true }],
      },
    })
      .then((foundPortfolios) => {
        if (foundPortfolios[0].assets !== 0) {
          return Promise.all(foundPortfolios[0].assets.map((asset) => {
            return updateAssetBTCEquivalent(asset)
          }))
            .then((r) => {
              const cost = r.reduce((a, b) => a + b.lastBTCEquivalent, 0);
              const updatedRecord = { id: foundPortfolios[0].id, cost };
              return repository.update({ modelName, updatedRecord });
            });
        }
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getPortfolioSharePrice = (req, res) => {
    repository.portfolio.getSharePrice(req.body)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getUpdatedPortfolioSharePrice = (req, res) => {
    repository.portfolio.updatePortfolioBTCEquivalent(req.body)
      .then((updatedPortfolio) => {
        repository.portfolio.getSharePrice(updatedPortfolio)
          .then((response) => {
            console.log('>>> share price: ', response);
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      });
  };

  return {
    getById,
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    removePortfolio,

    updateAssetBTCEquivalent,
    updatePortfolioBTCEquivalent,
    getPortfolioSharePrice,
    getUpdatedPortfolioSharePrice,
  };
};

module.exports = portfolioController;
