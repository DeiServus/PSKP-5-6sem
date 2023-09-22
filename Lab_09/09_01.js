var http = require('http');

let options = {
    host: 'localhost',
    path: '/1',
    port: 5000,
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log("response code: ", res.statusCode);
    console.log("response status message: ", res.statusMessage);
    console.log("server port: ", res.socket.remotePort);
    console.log("server IP: ", res.socket.remoteAddress);

    let data ='';
    res.on('data', (chunk) => {
        console.log('http.request: data: body =', data += chunk.toString('utf-8'))
    });
    res.on('end', () => {console.log('http.request: end: body: '+data)});
});

req.on('error', (e) => {console.log('http.request: error:', e.message);});
req.end();