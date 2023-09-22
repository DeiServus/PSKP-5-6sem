const WebSocket = require('ws');
let k = 0;


setTimeout(() => {
    const ws = new WebSocket('ws://localhost:4000/wsserver');
    ws.on('open', () => {
        console.log('+Socket');

        interval = setInterval(() => {
            ws.send(`10-02-client: ${++k}`);
        }, 3000);

        ws.on('message', message => {
            console.log('Received ', message.toString());
        })

        setTimeout(() => {
            clearInterval(interval);
            ws.close(1000);
        }, 25000);
    })

    ws.on('error', error => { console.log('WebSocket: ', error.message); })
}, 100)