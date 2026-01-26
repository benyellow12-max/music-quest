const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, JSON.stringify(res.headers));
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    console.log(`DATA CHUNK:`, chunk.substring(0, 100));
    data += chunk;
  });
  res.on('end', () => {
    console.log('No more data in response.');
    console.log(`Total length: ${data.length}`);
  });
});

req.on('error', (e) => {
  console.error(`ERROR: ${e.message}`);
});

console.log('Attempting to connect to localhost:3000...');
req.end();
