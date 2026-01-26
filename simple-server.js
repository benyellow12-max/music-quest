const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  res.writeHead(200);
  res.end('Hello\n');
});

server.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});
