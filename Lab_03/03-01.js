var http = require('http');
var process = require('process');
let state = 'norm';

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end('<h1>'+state+'</h1>');
}).listen(5000);

console.log('Welcome -> http://localhost:5000');
process.stdin.setEncoding('utf-8');
process.stdout.write(state + '->')
process.stdin.on('readable', ()=>{
    let chunk = null;
    while((chunk = process.stdin.read()) != null)
    {
        if(chunk.trim()=='exit') process.exit(0);
        else if(chunk.trim()=='norm') state = 'norm';
        else if(chunk.trim()=='idle') state = 'idle';
        else if(chunk.trim()=='stop') state = 'stop';
        else if(chunk.trim()=='test') state = 'test';
        else process.stdout.write(chunk);
    }
    process.stdout.write(state + '->');

});

