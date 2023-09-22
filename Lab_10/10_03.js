const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 5000, host: 'localhost', path: '/bc' });
wss.on('connection', ws => {
    console.log('+Socket');
    ws.on('message', data => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Server: ' + data);
            }
        });
    })
    ws.on('close', () => {
        console.log('-Socket');
    })
});
wss.on('error', error => { console.log('WebSocket: ', error.message); });