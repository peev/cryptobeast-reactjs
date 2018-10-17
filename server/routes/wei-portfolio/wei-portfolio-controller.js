const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiPortfolio';

const weiPortfolioController = (repository) => {
  const weiPortfolioService = require('../../services/wei-portfolio-service')(repository);

  const createWeiPortfolio = async (req, res) => {
    const user = req.body;

    const newWeiPortfolioObject = {
      userAddress: user.address,
      userID: user.id,
    };

    await repository.findOne({
      modelName,
      options: {
        where: {
          userAddress: user.address,
        },
      },
    }).then((portfolio) => {
      if (portfolio === null) {
        repository.create({ modelName, newObject: newWeiPortfolioObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const newWeiPortfolioData = Object.assign({}, newWeiPortfolioObject, { id: portfolio.id });
        repository.update({ modelName, updatedRecord: newWeiPortfolioData })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch(error => res.json(error));
      }
    }).catch((error) => {
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

  const updateWeiPortfolioTotalInvestment = async (req, res) => {
    const { address } = req.params;
    const portfolio = await repository.findOne({
      modelName,
      options: {
        where: { userAddress: address },
        include: [{ all: true }],
      },
    });

    if (portfolio.weiTransactions !== 0) {
      await weiPortfolioService.calcPortfolioTotalInvestment(portfolio).then((data) => {
        portfolio.totalInvestment = data;
        const weiPortfolioData = Object.assign({}, portfolio, { id: portfolio.id, totalInvestment: data });
        repository.update({ modelName, updatedRecord: weiPortfolioData })
          .then((response) => { res.status(200).send(response); })
          .catch(error => res.json(error));
      });
    }
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
        weiPortfolioService.updateWeiPortfolioTotalInvestment(response.id);
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeWeiPortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = (data) => {
    repository.find({ modelName }).then((portfolios) => {
      transactions.forEach(async (portfolio) => {
        await weiPortfolioService.calcPortfolioTotalInvestment(portfolio).then((data) => {
          portfolio.totalInvestment = data;
          const weiPortfolioData = Object.assign({}, portfolio, { id: portfolio.id, totalInvestment: data });
          repository.update({ modelName, updatedRecord: weiPortfolioData })
            .then((response) => {
              // TODO: Handle the response based on all items on all controllers ready
            })
            .catch(error => res.json(error));
        });
      });
    });
  };

  return {
    createWeiPortfolio,
    updateWeiPortfolio,
    updateWeiPortfolioTotalInvestment,
    getWeiPortfolio,
    removeWeiPortfolio,
    sync
  };
};

module.exports = weiPortfolioController;
