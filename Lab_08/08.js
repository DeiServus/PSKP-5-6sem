const http = require('http');
const url = require('url');
const server = http.createServer();
const serverSockets = new Set();
const mod = require('./m08')(server, serverSockets);


let http_handler = (req, res) => {

    if (req.method === 'GET') {
        switch (url.parse(req.url).pathname.split('/')[1]) {
            case 'connection':      mod.handleConnection(req, res); break;
            case 'headers':         mod.handleHeaders(req, res); break;
            case 'parameter':       mod.handleParameter(req, res); break;
            case 'close':           mod.handleClose(req, res); break;
            case 'socket':          mod.handleSocket(req, res); break;
            case 'req-data':        mod.handleReqData(req, res); break;
            case 'resp-status':     mod.handleRespStatus(req, res); break;
            case 'files':           mod.handleFiles(req, res); break;
            case 'upload':          mod.handleUpload(req, res); break;
            case 'formparameter':   mod.handleFormParameter(req, res); break;
            case 'upload':          mod.handleUpload(req, res); break;
            case '':                mod.handleMain(req, res); break;
            default:                mod.handleIncorrectURL(req, res); break;
        }
    }
    else if (req.method === 'POST') {
        switch (url.parse(req.url).pathname.split('/')[1]) {
            case 'json':            mod.handleJson(req, res); break;
            case 'xml':             mod.handleXml(req, res); break;
            case 'upload':          mod.handleUpload(req, res); break;
            case 'formparameter':   mod.handleFormParameter(req, res); break;
            case '':                mod.handleMain(req, res); break;
            default:                mod.handleIncorrectURL(req, res); break;
        }
    }
    else mod.handleIncorrectMethod(req, res);
}

server.listen(5000, () => console.log('Welcome -> http://localhost:5000'))
    .on('request', http_handler)
    .on('connection', socket => { serverSockets.add(socket); })
    .on('error', e => { console.log('Warning! ' + e.code); });