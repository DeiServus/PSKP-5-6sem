const http = require('http');
const url = require('url');
let server = http.createServer();
const modules = require('./functions')(server);

let GET_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(path.split('/')[1]);
    switch (path) {
        case '/1': modules.informationFunc(req, res); break;
        case '/2': modules.parameterFunc(req, res); break;
        case '/8/from.txt': modules.readFromFile(req, res); break;
        default: HTTP404(req, res);
    }
}

let POST_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(path.split('/')[1]);
    switch (path) {
        case '/3': modules.postParameters(req, res); break;
        case '/4': modules.postJsonParameters(req, res); break;
        case '/5': modules.xmlFunc(req, res); break;
        case '/6': modules.uploadPOST(req, res); break;
        case '/7': modules.uploadPOST(req, res); break;
        default: HTTP404(req, res);
    }
}



http_handler = (req, res) => {
    switch (req.method) {
        case 'GET': GET_handler(req, res); break;
        case 'POST': POST_handler(req, res); break;
        default: HTTP405(req, res);
    }
}


let HTTP405 = (req, res) => {
    let message = ` Method ${req.method} Not Allowed [405]`;
    let errInfo = {
        error: 'Warning! Method Not Allowed [405]',
        method: req.method,
        url: req.url
    }
    console.log(message);
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}

let HTTP404 = (req, res) => {
    let message = `Adress ${req.method} Not Found [404]`;
    let errInfo = {
        error: 'Warning! Adress Not Found [404]',
        method: req.method,
        url: req.url
    }
    console.log(message);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}

server.listen(5000, () => { console.log('Welcome -> http://localhost:5000'); })
    .on('error', (err) => { console.log(`Error: ${err.message}`); })
    .on('request', http_handler);
