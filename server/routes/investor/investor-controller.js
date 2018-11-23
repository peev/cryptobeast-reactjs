const modelName = 'Investor';

const investorController = (repository) => {
  const getPortfolioObjectByAddress = async address => repository.findOne({
    modelName: 'Portfolio',
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const createInvestor = async (req, res) => {
    const investor = req.body;

    const portfolio = await getPortfolioObjectByAddress(investor.userAddress);

    if (portfolio !== null && portfolio !== undefined) {
      const investorData = {
        name: investor.name,
        email: investor.email,
        phone: investor.phone,
        portfolioId: portfolio.id,
      };

      await repository.create({ modelName, newObject: investorData })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => res.status(500).send(error));
    } else {
      res.status(400).send('Invalid portfolio address!');
    }
  };

  const updateInvestor = async (req, res) => {
    const { id } = req.params;
    const investor = req.body;

    const portfolio = await getPortfolioObjectByAddress(investor.userAddress);

    if (portfolio !== null && portfolio !== undefined) {
      const investorData = {
        id,
        name: investor.name,
        email: investor.email,
        phone: investor.phone,
        fee: investor.fee || 0,
        portfolioId: portfolio.id,
      };

      await repository.update({ modelName, updatedRecord: investorData })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => res.status(500).send(error));
    } else {
      res.status(400).send('Invalid portfolio address!');
    }
  };

  const removeInvestor = async (req, res) => {
    const { id } = req.params;
    const investor = req.body;

    const portfolio = await getPortfolioObjectByAddress(investor.userAddress);

    if (portfolio !== null && portfolio !== undefined) {
      const investorData = Object.assign({}, req.body, { id, active: false });

      await repository.update({ modelName, updatedRecord: investorData })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => res.status(500).send(error));
    } else {
      res.status(400).send('Invalid portfolio address!');
    }
  };

  return {
    createInvestor,
    updateInvestor,
    removeInvestor,
  };
};

module.exports = investorController;
