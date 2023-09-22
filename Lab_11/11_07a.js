const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

let input = process.stdin;
ws.on('open', () => {
    console.log('Enter A, B or C');
});

input.setEncoding('utf-8');
input.on('data', (data) =>{
    if(data.length==3)
    {
    ws.notify(data.slice(0,1));
}
    else
    console.error('Error');
});