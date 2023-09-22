const http = require('http');
var fs = require('fs');
//const directory = './api/name';

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
    response.end('Раченок Илья Александрович');
}).listen(5000);

console.log('Welcome -> http://localhost:5000/api/name');