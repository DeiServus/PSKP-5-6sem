var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    const fname = './patric.png';
    let png = null;

    fs.stat(fname, (err, stat)=>{
        if(err){
            console.log('error:', err);
        }
        else{
            png = fs.readFileSync(fname);
            response.writeHead(200, {'Content-Type': 'image/png','Content-Length':stat.size});
            response.end(png, 'binary');
        }
    });
}).listen(5000);

console.log('Welcome -> http://localhost:5000/png')