const { coinMarketCapServices } = require('../../integrations/coinMarketCap-services');

const marketController = () => {
  const getTickersFromCoinMarketCap = async (req, res) => {
    await coinMarketCapServices().getTickers('ETH')
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(err));
  };

  return {
    getTickersFromCoinMarketCap,
  };
};

module.exports = marketController;
