const userController = (repository, jobs) => {
  const modelName = 'User';
  const portfolioService = require('../../services/portfolio-service')(repository);
  const { closingSharePriceJobs, openingSharePriceJobs, closingPortfolioCostJobs } = jobs;

  const updateClosingTime = async (req, res) => {
    const setting = await repository.findOne({
      modelName: 'Setting',
      options: {
        where: {
          userId: req.body.userId,
          name: req.body.name,
        }
      },
    });

    if (setting === null) {
      // create new setting
      repository.create({
        modelName: 'Setting',
        newObject: {
          userId: req.body.userId,
          name: req.body.name,
          value: req.body.value,
        }
      });
    } else {
      // update selected setting
      repository.update({
        modelName: 'Setting',
        updatedRecord: {
          id: setting.id,
          userId: req.body.userId,
          name: req.body.name,
          value: req.body.value,
        }
      });
    }

    // TODO: PortfolioID should be changed with UserID
    closingSharePriceJobs[req.body.portfolioId] = await portfolioService.createSaveClosingSharePriceJob(req.body.portfolioId);
    openingSharePriceJobs[req.body.portfolioId] = await portfolioService.createSaveOpeningSharePriceJob(req.body.portfolioId);
    closingPortfolioCostJobs[req.body.portfolioId] = await portfolioService.createSaveClosingPortfolioCostJob(req.body.portfolioId);
  }

  return {
    updateClosingTime,
  };
};

module.exports = userController;
