const investorController = (repository) => {
  const getAllInvestor = (req, res) => {
    repository.investor.getAll()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createInvestor = (req, res) => {
    const investorData = req.body;

    repository.investor.create(investorData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    getAllInvestor,
    createInvestor,
  };
};

module.exports = investorController;
