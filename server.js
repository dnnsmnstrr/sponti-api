const http = require('http');
const fs = require('fs');

const sprueche = JSON.parse(fs.readFileSync('sprueche.json', 'utf-8'));

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/sponti') {
    const random = sprueche[Math.floor(Math.random() * sprueche.length)];
    res.end(JSON.stringify(random));
  } else if (req.url === '/api/all') {
    res.end(JSON.stringify(sprueche));
  } else if (req.url === '/api/count') {
    res.end(JSON.stringify({ count: sprueche.length }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Sponti API</h1><p>GET /api/sponti - Random Spruch</p><p>GET /api/count - Total count</p><p>GET /api/all - All Sprueche</p>');
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sponti API running on http://localhost:${PORT}`);
});