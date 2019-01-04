const marketController = (repository) => {
  const modelName = 'CoinMarketCapCurrency';
  const commonService = require('../../services/common-methods-service')();

  const getTickersFromCoinMarketCap = async (req, res) =>
    repository.find({
      modelName,
    })
      .then(response => res.status(200).send(response))
      .catch(error => res.json(error));

  const getEthToUsd = async (req, res) => {
    const timestamp = new Date().getTime();
    const ethToUsd = await commonService.getEthToUsd(timestamp);
    if (ethToUsd !== null && ethToUsd !== undefined) {
      return res.status(200).send(ethToUsd.toString());
    }
    return res.status(400).send(null);
  };

  return {
    getTickersFromCoinMarketCap,
    getEthToUsd,
  };
};

module.exports = marketController;
