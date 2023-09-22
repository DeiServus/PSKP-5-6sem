const WS = require('ws');
const fs = require('fs');
const rpc = require('rpc-websockets').Server;

let wsServer = new WS.Server({ port: 4000, host: 'localhost' });

let a = 0; let n = 1; let c = 0; let x = 1;

wsServer.on('connection', (ws) => {
    ws.on('pong', (data) => {
        a++;
    });
    setInterval(() => {
        console.log(`${x}. Clients:`);
        wsServer.clients.forEach(client => {
            client.ping(1);
            console.log(`  +client${++c}`);
        });
        a = 0; c = 0; x++;
    }, 5000);
    setInterval(() => {
        wsServer.clients.forEach(client => {client.send(`11-03: server: ${n}`);});
        n++;
    }, 15000);
});

wsServer.on('close', () => {
    x = 0;
    console.log('Close connection');
});

wsServer.on('error', (err) => {
    console.error('err');
});