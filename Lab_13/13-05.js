const net = require('net');

const HOST = '0.0.0.0';
const PORT = 4000;
let timeId = null;

let label = (pfx, socket) => { return `${pfx} ${socket.remoteAddress} : ${socket.remotePort} -> `; }
let connections = new Map();

let server = net.createServer(sock => {
    console.log(`Client connected:  ${sock.remoteAddress} : ${sock.remotePort}\n`);

    sock.id = (new Date()).toISOString();
    connections.set(sock.id, 0);
    console.log('Socket ID: ', sock.id);


    server.getConnections((e, c) => {
        if (!e) {
            console.log(label('CONNECTED', sock) + c);
            for (let [key, value] of connections) {
                console.log(key, value);
            }
        }
    });

    sock.on('data', (data) => {
        console.log(label('DATA ', sock) + data.readInt32LE());
        connections.set(sock.id, connections.get(sock.id) + data.readInt32LE());
        console.log(`SUM: ${connections.get(sock.id)}`);
    });

    let buf = Buffer.alloc(4);
    timeId = setInterval(() => {
        buf.writeInt32LE(connections.get(sock.id), 0);
        sock.write(buf);
    }, 5000);


    sock.on('close', () => {
        console.log(label('CLOSED', sock) + sock.id);
        clearInterval(timeId);
        connections.delete(sock.id);
    });

    sock.on('error', error => {
        console.log(label('ERROR', sock) + error.message);
        clearInterval(timeId);
        connections.delete(sock.id);
    });
});
server.on('listening', () => { console.log(`TCP-server: ${HOST}:${PORT}`); });
server.on('error', error => { console.log(`TCP-Server error: ${error.message}`); });
server.listen(PORT, HOST);