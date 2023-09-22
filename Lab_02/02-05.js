var http = require('http');
const fs = require("fs");

http.createServer(function(request, response){
    if(request.url === "/fetch"){
        let html = fs.readFileSync('./fetch.html');
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(request.url == "/api/name"){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('<h1>Раченок Илья Александрович</h1>');
    }
    else
        response.write("Not found");
    response.end();
}).listen(5000);

console.log('Welcome -> http://localhost:5000/fetch');