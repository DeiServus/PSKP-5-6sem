const send = require('fucking_pack');
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    send('Hello!');
    res.end('message was sent');
}).listen(5000);
console.log('Welcome -> http://localhost:5000/');