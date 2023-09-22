const WebSocket = require('ws');
const ws = new WebSocket('ws:/localhost:4000');

let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'Client' : parm;
let mess;

ws.on('open',()=>{
    ws.on('message',(data)=>{
        mess = JSON.parse(data);
        console.log(mess);
    });

    setInterval(()=>{
        ws.send(JSON.stringify({ x:prfx, t: (new Date()).toString()}))
    },5000);
});

ws.on('error',(e)=>{
    console.log('Error: ',e)
});