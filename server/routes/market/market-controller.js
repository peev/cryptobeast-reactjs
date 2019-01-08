const marketController = (repository) => {
  const modelName = 'CoinMarketCapCurrency';
  const commonService = require('../../services/common-methods-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);

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

  const closest = (num, arr) => {
    let curr = arr[0];
    for (let i = 0; i < arr.length; i += 1) {
      if (Math.abs(num - arr[i].createdAt) < Math.abs(num - curr.createdAt)) {
        curr = arr[i];
      }
    }
    return curr;
  };

  const getEthHistory = async (req, res) => {
    const { portfolioId } = req.params;

    try {
      const firstAllocation = await intReqService.getFirstAllocationByPortfolioId(portfolioId);
      const start = new Date(firstAllocation.timestamp).getTime();
      const end = new Date().getTime();
      const ethHistory = await commonService.getEthHistory(start, end);
      const timestampsMiliseconds = commonService.calculateDays(commonService.getEndOfDay(start), commonService.getEndOfDay(end));
      const result = [];
      timestampsMiliseconds.forEach((timestamp) => {
        result.push({ timestamp, priceUsd: closest(timestamp, ethHistory).priceUSD });
      });
      return res.status(200).send(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  return {
    getTickersFromCoinMarketCap,
    getEthToUsd,
    getEthHistory,
  };
};

module.exports = marketController;
