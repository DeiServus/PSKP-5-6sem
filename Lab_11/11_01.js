const WS = require('ws');
const fs = require('fs');

let ws = new WS.Server({ port: 4000, host: 'localhost'});

ws.on('connection', (ws) => {
    const duplex = WS.createWebSocketStream(ws);
    let file = fs.createWriteStream(`./upload/new_file.txt`);
    duplex.pipe(file);
}); 

ws.on('close', () => {
    console.log('Close connection');
}); 

ws.on('error', (err) => {
    console.error('err');
});