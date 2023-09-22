const http = require('http');
const url = require('url');
const fs = require('fs');
const {  } = require('./functions');
const { http_handler } = require('./handlers');

let server = http.createServer();
server.listen(3000, () => { console.log('http://localhost:3000'); })
    .on('error', (err) => { console.log(`Error: ${err.message}`); })
    .on('request', http_handler);