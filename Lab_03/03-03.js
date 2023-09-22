var http = require('http');
var url = require('url');
var fs = require('fs');

let fact = (n) => {return (n==0?1:n*fact(n-1))};

http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;     
    var rc = JSON.stringify({k: 0}); 
    if (path == "/fact") {
        if (typeof url.parse(request.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify({k: k, fact: fact(k)}));
            }
        }
    }
    else if (path == "/") {
        var html = fs.readFileSync("./03-03.html");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(html);
    }
    else {
        response.end(rc);
    }
}).listen(5000);

console.log('Welcome -> http://localhost:5000/');