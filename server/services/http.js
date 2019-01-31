const http = require('http');

const get = url => new Promise((resolve, reject) => {
  http.get(url, (response) => {
    let data = '';
    response.setEncoding('utf8');
    if (response.statusCode < 200 || response.statusCode > 299) {
      console.log('------------------------------------');
      console.log(url);
      console.log('------------------------------------');
      reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
    }

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => resolve(data));

    response.on('error', err => reject(err));
  });
});

module.exports = { get };
