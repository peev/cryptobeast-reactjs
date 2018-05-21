const https = require('https');

const get = (url) => {
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
};

module.exports = { get };
