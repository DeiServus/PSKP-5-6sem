var http = require('http');
var stat = require('./m07-01')('./static');

let http_handler = (req, res)=>{
    if (req.method === 'GET') {
    if(stat.isStatic('html', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/html; charset=utf-8'});
    else if(stat.isStatic('css', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/css; charset=utf-8'});
    else if(stat.isStatic('js', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/javascript; charset=utf-8'});
    else if(stat.isStatic('png', req.url)) stat.sendFile(req, res, {'Content-Type': 'image/png;'});
    else if(stat.isStatic('docx', req.url)) stat.sendFile(req, res, {'Content-Type': 'appliaction/msword; charset=utf-8'});
    else if(stat.isStatic('json', req.url)) stat.sendFile(req, res, {'Content-Type': 'appliaction/json; charset=utf-8'});
    else if(stat.isStatic('xml', req.url)) stat.sendFile(req, res, {'Content-Type': 'appliaction/xml; charset=utf-8'});
    else if(stat.isStatic('mp4', req.url)) stat.sendFile(req, res, {'Content-Type': 'video/mp4;'});
    else stat.writeHTTP404(res);
    }else{
        stat.writeHTTP405(res);
    }
}
let server = http.createServer();

server.listen(5000, ()=>{console.log('Welcome -> http://localhost:5000/index.html')})
      .on('error', (e)=>{console.log('server.listen(5000): error: ', e.code)})
      .on('request', http_handler);