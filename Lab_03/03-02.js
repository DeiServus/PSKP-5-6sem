var http = require('http');
var url = require('url');

let fact = (n) => {return (n==0?1:n*fact(n-1))};

//console.log(fac(3));
http.createServer(function(request, response){
    if(typeof url.parse(request.url, true).query.k != 'undefined' ){
        let k = parseInt(url.parse(request.url, true).query.k);
        if(Number.isInteger(k)){
            response.writeHead(200, {'Content-Type': 'application/json; text/plain'});
            response.end(JSON.stringify({k:k, fact: fact(k)}));
        }
    }
}).listen(5000);