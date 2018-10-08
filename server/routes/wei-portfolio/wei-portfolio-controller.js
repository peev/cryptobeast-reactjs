const modelName = 'WeiPortfolio';

const weiPortfolioController = (repository) => {
  const createWeiPortfolio = (req, res) => {
    // TODO get user first
    // TODO calculate deposits - withdraws
    const user = req.body;
    repository.create({ modelName,
      newObject: {
        userAddress: user.address,
        userID: user.id,
        portfolioName: null,
        totalInvestments: null,
      },
    })
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
    const { address } = req.params;
    repository.findOne({
      modelName,
      options: {
        where: {
          userAddress: address,
        },
      },
    })
      .then((response) => {
        console.log(response);
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
