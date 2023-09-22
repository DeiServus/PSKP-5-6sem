const rpc = require('rpc-websockets').Server;


const rpc_obj = new rpc({ port: 4000, host: 'localhost'});

rpc_obj.event('A');
rpc_obj.event('B');
rpc_obj.event('C');
let input = process.stdin;
input.setEncoding('utf-8');
input.on('data', (data) =>{
    data = data.trim();
    if(data.length==1){
        // let getData = data.slice(0,1);
        rpc_obj.emit(getData,`Event: ${getData}`);
    }
    else
    console.error('Error');
});