const http = require('http');
const query = require('querystring');

const parms = query.stringify({ x: 3, y: 4, s: 'xxx' });
console.log('parms', parms);

const options = {
    host: 'localhost',
    path: `/3?${parms}`,
    port: 5000,
    method: 'POST'
}


const req = http.request(options, res => {
    let data = '';
    console.log('statusCode:' + res.statusCode);
    res.on('data', chunk => { 
        console.log('http.request: data: body =', data += chunk.toString('utf8')); })
    res.on('end', () => { 
        console.log('http.request: data: end =', data); });
});

req.on('error', e => { console.log('http.request: error:', e.message); })
req.write(parms);
req.end();