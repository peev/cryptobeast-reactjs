const marketController = (repository) => {
  const getSummaries = (req, res) => {
    repository.market.updateSummary()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getBaseCurrencies = (req, res) => {
    repository.market.getBase()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    getSummaries,
    getBaseCurrencies,
  };
};

module.exports = marketController;
