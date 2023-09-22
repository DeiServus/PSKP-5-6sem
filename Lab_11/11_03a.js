const fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket('ws:/localhost:4000');

ws.on('pong', (data)=>{
    console.log(data.toString());
});

ws.on('message', (mes)=>{
    console.log(mes.toString());
});

ws.on('error', (err)=>{
    console.error('err');
});