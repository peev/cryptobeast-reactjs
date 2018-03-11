const portfolioController = (data) => {
  const getAllPortfolios = (req, res) => {
    data.portfolio.getAllPortfolios()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createPortfolio = (req, res) => {
    const portfolioData = req.body;

    data.portfolio.createPortfolio(portfolioData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updatePortfolio = (req, res) => {
    // const id = req.params.id;
    const portfolioData = req.body;

    data.portfolio.updatePortfolio(portfolioData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const deletePortfolio = (req, res) => {
    const portfolioData = req.body;

    data.portfolio.deletePortfolio(portfolioData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
};

module.exports = portfolioController;
