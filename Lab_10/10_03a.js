const WebSocket = require('ws');

let parm0 = process.argv[0];
let parm1 = process.argv[1];
let parm2 = process.argv[2];
console.log('parm0 = ', parm0);
console.log('parm1 = ', parm1);
console.log('parm2 = ', parm2);
let p = typeof parm2 == 'undefined' ? 'A' : parm2;

setTimeout(() => {
    let ws = new WebSocket('ws://localhost:5000/bc');
    let interval;

    ws.on('open', () => {
        console.log('+Socket');
        let k = 0;

        interval = setInterval(() => {
            ws.send(`Client: ${p}-${++k}`);
        }, 1000);

        ws.on('message', message => {
            console.log('Received message => ', message.toString());
        })

        setTimeout(() => {
            clearInterval(interval);
            ws.close();
        }, 25000);
    })


    ws.on('error', e => { console.log('WebSocket: ', e.message); })
}, 100);