const marketController = (repository) => {
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
    getBaseCurrencies,
  };
};

module.exports = marketController;
