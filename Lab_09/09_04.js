const http = require('http');

const jsonObject = JSON.stringify({
    '__comment': 'Запрос. Лабораторная работа 8/10',
    x: 3,
    y: 2,
    s: 'Message',
    m: ['1', 'ab', 'cde'],
    o: { surname: 'Раченок', name: 'Илья' }
});


const options = {
    host: 'localhost',
    path: '/4',
    port: 5000,
    method: 'POST',
    headers: {'Content-Type': 'application/json','Accept': 'application/json'}
}


const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => { 
        console.log('http.request: data: body =', data += chunk.toString('utf8')); })
    res.on('end', () => { 
        console.log('http.request: data: end =', data); });
});

req.on('error', e => { console.log('http.request: error:', e.message); })
req.end(jsonObject);