const modelName = 'Investor';

const investorController = (repository) => {
  const createInvestor = (req, res) => {
    const investor = req.body;

    repository.create({ modelName, newObject: investor })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const updateInvestor = async (req, res) => {
    const { id } = req.params;
    const investorData = Object.assign({}, req.body, { id });
    try {
      const updatedInvestorRecord = await repository.update({ modelName, updatedRecord: investorData });
      res.status(200).send(updatedInvestorRecord);
    } catch (er) {
      console.log(er);
      res.status(500).json(er);
    }
  };

  const removeInvestor = async (req, res) => {
    const { id } = req.params;
    const investorData = Object.assign({}, req.body, { id, active: false });
    try {
      const updatedInvestorRecord = await repository.update({ modelName, updatedRecord: investorData });
      res.status(200).send(updatedInvestorRecord);
    } catch (er) {
      console.log(er);
      res.status(500).json(er);
    }
  };

  return {
    createInvestor,
    updateInvestor,
    removeInvestor,
  };
};

module.exports = investorController;
