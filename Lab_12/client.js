const rpcC = require('rpc-websockets').Client;

const prc = new rpcC('http://localhost:5001');
prc.on('open', () => {
    prc.subscribe('add');
    prc.on('add', () => console.log('add'));
    prc.subscribe('badd');
    prc.on('badd', () => console.log('backup add'));
    prc.subscribe('update');
    prc.on('update', () => console.log('update'));
    prc.subscribe('bupdate');
    prc.on('bupdate', () => console.log('backup update'));
    prc.subscribe('delete');
    prc.on('delete', () => console.log('delete'));
    prc.subscribe('bdelete');
    prc.on('bdelete', () => console.log('backup delete'));
});