const modelName = 'WeiPortfolio';

const weiPortfolioController = (repository) => {
  const createWeiPortfolio = (req, res) => {
    const weiPortfolio = req.body;
    repository.create({ modelName, newObject: weiPortfolio })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiPortfolio = async (req, res) => {
    const { id } = req.params;
    const weiPortfolioData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiPortfolioData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const getWeiPortfolio = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const calculateTotalInvestment = () => {
    // TODO
  };

  return {
    createWeiPortfolio,
    updateWeiPortfolio,
    getWeiPortfolio,
  };
};

module.exports = weiPortfolioController;
