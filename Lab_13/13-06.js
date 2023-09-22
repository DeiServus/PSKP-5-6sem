const net = require('net');
let HOST = '127.0.0.1';
let PORT = 4000;
let number = process.argv[2] ? process.argv[2] : 1;
let client = new net.Socket();
let buf = new Buffer.alloc(4);
let timerId = null;

client.connect(PORT, HOST, ()=>{console.log('Client CONNECTED:',client.remoteAddress+' '+client.remotePort+' '+number);
        timerId =setInterval(() => {
        client.write((buf.writeInt32LE(number, 0), buf));
    }, 1000);
    setTimeout(()=>{clearInterval(timerId); client.end();}, 20000);
});

client.on('data', (data)=>{console.log('Client DATA: ', data.readInt32LE());});

client.on('close', ()=>{console.log('Client CLOSE');});

client.on('error', (e)=>{console.log('Client ERROR', e);});