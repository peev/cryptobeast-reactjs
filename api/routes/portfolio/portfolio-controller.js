const { responseHandler } = require('../utilities/response-handler');

const portfolioController = (repository) => {
  const createPortfolio = (req, res) => {
    const portfolioData = req.body;
    console.log(req.body)
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

  const removePortfolio = (req, res) => {

    const id = req.params.id

    repository.portfolio.remove({id})
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
  };
};

module.exports = portfolioController;
