const net = require('net');
const HOST = '0.0.0.0';
const PORT1 = 4000;
const PORT2 = 5000;


let h = n => {
    return sock => {
        console.log(`CONNECTED${n}:` +sock.remoteAddress +':'+sock.remotePort);

        sock.on('data', data => {
            console.log(`DATA${n}: number = ${data.readInt32LE()}`);
            sock.write('ECHO: ' + data.readInt32LE());
        })

        sock.on('close', () => { console.log(`CLOSED${n}`+sock.remoteAddress +' '+sock.remotePort); })
        sock.on('error', error => { console.log(`ERROR${n}: ${error.message}`); });
    }
}

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', () => { console.log(`TCP-server: ${HOST}:${PORT1}`) });
net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', () => { console.log(`TCP-server: ${HOST}:${PORT2}\n`) });