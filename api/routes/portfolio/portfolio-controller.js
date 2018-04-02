const { responseHandler } = require('../utilities/response-handler');

const portfolioController = (repository) => {
  const createPortfolio = (req, res) => {
    const portfolioData = req.body;

    repository.portfolio.create(portfolioData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const getAllPortfolios = (req, res) => {
    repository.portfolio.getAll()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updatePortfolio = (req, res) => {
    // const id = req.params.id;
    const portfolioData = req.body;

    repository.portfolio.update(portfolioData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };


  const updateAssetBTCEquivalent = (req, res) => {
    repository.portfolio.updateAssetBTCEquivalent(req.body)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updatePortfolioBTCEquivalent = (req, res) => {
    repository.portfolio.updatePortfolioBTCEquivalent(req.body)
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

  const removePortfolio = (req, res) => {
    const portfolioData = req.body;

    repository.portfolio.remove(portfolioData)
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
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
