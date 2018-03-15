const portfolioController = (repository) => {
  const getAllPortfolios = (req, res) => {
    repository.portfolio.getAll()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

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
    const portfolioData = req.body;

    repository.portfolio.remove(portfolioData)
      .then((response) => {
        switch (response) {
          case 1:
            res.status(200).send(`${response}`);
            break;
          case 0:
            res.status(404).send(`${response}`);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const addAccountToPortfolio = (req, res) => {
    const accountData = req.body;

    repository.portfolio.addAccount(accountData)
      .then((response) => {
        console.log('-------------', response);
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
    removePortfolio,
    addAccountToPortfolio,
  };
};

module.exports = portfolioController;
