const https = require('https');

function getMarketSummariesFromApi() {
  const url = 'https://bittrex.com/api/v1.1/public/getmarketsummaries';
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.setEncoding('utf8');

      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
      }

      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => resolve(data));
      response.on('error', err => reject(err));
    });
  });
}

const init = (db) => {
  // TODO: Setup market CRUD operations
  const updateSummary = () => {
    const prices = getMarketSummariesFromApi().then((result) => {
      const deserializedPrices = JSON.parse(result);
      return deserializedPrices.result;
    }).then((parsedPrices) => {
      db.MarketSummary.destroy({ where: {} }).then(() => { });
      return db.MarketSummary.bulkCreate(parsedPrices);
    });

    return prices;
  };

  const getBase = () => {
    return db.MarketSummary.findAll({
      where: { MarketName: ['USDT-ETH', 'USDT-BTC'] },
    });
  };

  return {
    updateSummary,
    getBase,
  };
};

module.exports = { init };
