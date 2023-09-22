var http = require('http');
var url = require('url');
var fs = require('fs');
var process = require('process');
var data = require('./m05-01');

var db = new data.DB();
var statistic = {start: null, finish: null, request: null, commit: null};
let countR = 0;
let countC  = 0;
db.on('GET', (req, res) => {
    console.log('DB.GET');
    countR++;
    res.end(JSON.stringify(db.get()));})

db.on('POST',(req, res) => {
    console.log('DB.POST');
    countR++;
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r))
    })
})
db.on('PUT', (req, res) => {
    console.log('DB.PUT');
    countR++;
    req.on('data', data => {        
        let r = JSON.parse(data);
        db.put(r);
        res.end(JSON.stringify(r));
    });
});
db.on('DELETE', (req, res) => {
    console.log('DB.DELETE');
    countR++;
    if(typeof url.parse(req.url,true).query.id != 'undefined'){
        let k=parseInt(url.parse(req.url,true).query.id);
        if(Number.isInteger(k)){
            let r= db.delete(k);
            res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
            res.end(JSON.stringify(r));
        }
    }
});
db.on('COMMIT', ()=>{
    console.log(`DB.COMMIT -> ${db.com_count}`);
    countC++;
    db.commit();
})


var server = http.createServer(function (request, response) {
    if(url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./05-01.html')
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
    else if(url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(statistic));
    }
}).listen(5000);


var timer = null;
var interval = null; server.unref();
var sstimer = null;
process.stdin.setEncoding('utf-8');
process.stdin.on('readable', ()=>{
    let chunk = null;
    while((chunk = process.stdin.read()) != null)
    {
        if(chunk.split(' ')[0]== 'sd' && chunk.split(' ').length==2){
            let t = parseInt(chunk.split(' ')[1]);
            timer = setTimeout((t) => {
                console.log('process is closed');
                server.close();
            }, t, t).unref();
            process.stdin.unref();
        }
        else if(chunk.split('\r\n')[0] == 'sd'){ 
            if(timer!=null)               
            console.log('sd_timer is stopped');
            else console.log('there is nothing to stop');
            clearTimeout(timer);
        }
        else if(chunk.split(' ')[0]== 'sc' && chunk.split(' ').length==2){
            let t = parseInt(chunk.split(' ')[1]);
            interval = setInterval(() => {
                db.emit('COMMIT');
            }, t);
            interval.unref();
        }
        else if(chunk.split('\r\n')[0] == 'sc'){//добавить условие
            if(timer!=null)
            console.log('sc_interval is stopped');
            else console.log('there is nothing to stop');
            clearInterval(interval);
        }
        else if(chunk.split(' ')[0]== 'ss' && chunk.split(' ').length==2){
            let t = parseInt(chunk.split(' ')[1]);
            countC = 0;
            countR = 0;
            statistic.start = Date(Date.now()).toString();
            sstimer = setTimeout((t) => {
                statistic.commit = countC;
                statistic.request = countR;
                statistic.finish = Date(Date.now()).toString();
                console.log("start: "+statistic.start+", finish: "+statistic.finish+", request: "+statistic.request+", commit: "+ statistic.commit);
            }, t, t);
            sstimer.unref();
        }
        else if(chunk.split('\r\n')[0] == 'ss'){
            if(sstimer!=null)               
            console.log('ss_timer is stopped');
            else console.log('there is nothing to stop');
            clearTimeout(sstimer);
        }
        else console.log('command not found');
    }
})