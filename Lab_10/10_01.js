const http = require('http');
const url = require('url');
const fs = require('fs');
const WebSocket = require('ws');

http.createServer((req, res) => {
    if (req.method === 'GET' && url.parse(req.url).pathname === '/start') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync('./index.html'));
    }
    else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>localhost:3000/start?! </h1>');
    }
}).listen(3000);

console.log('Welcome -> http://localhost:3000/start\n');


let k = 0;
let n = 0;
const wss = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' });
wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`Received message =>  ${message}`);
        n = +message.toString().slice(-1);
    });

    setInterval(() => {
        ws.send(`10-01-server: ${n}->${++k}`);
    }, 5000);
});
wss.on('error', e => { console.log('WebSocket: ', e.message); })