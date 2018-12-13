const marketController = (repository) => {
  const modelName = 'CoinMarketCapCurrency';

  const getTickersFromCoinMarketCap = async (req, res) =>
    repository.find({
      modelName,
    })
      .then(response => res.status(200).send(response))
      .catch(error => res.json(error));

  return {
    getTickersFromCoinMarketCap,
  };
};

module.exports = marketController;
