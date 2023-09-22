var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./m04-01');

var db = new data.DB();

db.on('GET', (req, res) => {
    console.log('DB.GET');
    res.end(JSON.stringify(db.get()));
})
db.on('POST',(req, res) => {
    console.log('DB.POST');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r))
    })
})
db.on('PUT', (req, res) => {
    console.log('DB.PUT');
    req.on('data', data => {        
        let r = JSON.parse(data);
        db.put(r);
        res.end(JSON.stringify(r));
    });
});
db.on('DELETE', (req, res) => {
    console.log('DB.DELETE');
    if(typeof url.parse(req.url,true).query.id != 'undefined'){
        let k=parseInt(url.parse(req.url,true).query.id);
        if(Number.isInteger(k)){
            let r= db.delete(k);
            res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
            res.end(JSON.stringify(r));
        }
    }
});


http.createServer(function (request, response) {
    if(url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./04-01.html')
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        response.end(html)
    }
    else if(url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response)
    }
}).listen(5000);

console.log('Welcome -> http://localhost:5000');