const WS = require('ws');

let wss = new WS.Server({ port: 4000, host: 'localhost'});
let mess;
let l = 0;

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        mess = JSON.parse(data);
        ws.send(JSON.stringify({ n: l++, x: mess.x, t: (new Date()).toString() }))
        console.log(JSON.parse(data));
    });
}); 

wss.on('close', () => {
    console.log('Close connection');
});

wss.on('error', (err) => {
    console.error('err');
});