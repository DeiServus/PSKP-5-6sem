var http = require('http');
var url = require('url');
var fs = require('fs');

let ffact = (n) => {return (n==0?1:n*ffact(n-1))};

function Fact(n, cb) {
    this.fn = n;
    this.ffact = ffact;
    this.fcb = cb;
    this.calc=()=>{process.nextTick(()=>{this.fcb(null,this.ffact(this.fn));});}
}

//console.log(fac(3));
http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;     
    var rc = JSON.stringify({k: 0}); 
    if (path == "/fact") {
        if (typeof url.parse(request.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {"Content-Type": "application/json"});
                let fact=new Fact(k,(err,result)=>{response.end(JSON.stringify({k:k,fact:ffact(k)}));}); 
                fact.calc();
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