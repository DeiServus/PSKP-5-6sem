const http = require('http');
const send = require('./m0603.js');

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    for(var i = 0; i < 10; i++)
    send('Misha, hello!!!');
    response.end(`Message was sent`);
}).listen(5000); 

console.log('Welcome -> http://localhost:5000/');