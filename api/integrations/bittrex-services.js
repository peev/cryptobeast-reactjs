const bittrex = require('node-bittrex-api');
const util = require('util');

const bittrexServices = (key, secret) => {
  // bittrex.options({
  //   'apikey': API_KEY,
  //   'apisecret': API_SECRET,
  // });

  const getAllTickers = () => {
    bittrex.getmarketsummaries((data, err) => {
      return data.result.forEach((summary) => {
        return bittrex.getticker({ market: summary.MarketName }, (ticker) => {
          const tickerResult = { pair: summary.MarketName, last: (ticker.result ? ticker.result.Last : null) };
          // callback cannot return data from getAllTickers
          // fill db from here

          console.log(tickerResult);
          return tickerResult;
        });
      });
    });

    return;
  };

  return {
    getAllTickers,
  };
};

bittrexServices().getAllTickers(); // Test
