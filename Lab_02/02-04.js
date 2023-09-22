const http = require("http");
const fs = require("fs");

http.createServer(function(request, response){
    if(request.url === "/xmlhttprequest"){
        let html = fs.readFileSync('./xmlhttprequest.html');
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(request.url == "/api/name"){
        response.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
        response.end('Раченок Илья Александрович');
    }
    else
        response.write("Not found");
    response.end();
}).listen(5000);

console.log('Welcome -> http://localhost:5000/xmlhttprequest');