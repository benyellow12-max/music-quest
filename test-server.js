const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

const PORT = 5050;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
