const http = require('http');

const { http_handler } = require('./handlers');

let server = http.createServer();

server.listen(5000, () => { console.log('http://localhost:5000'); })
    .on('error', (err) => { console.log(`Error: ${err.message}`); })
    .on('request', http_handler);