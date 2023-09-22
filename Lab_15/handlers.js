const { decode } = require('querystring');
const url = require('url');

const functions = require('./functions');

exports.http_handler = (req, res) => {
    switch (req.method) {
        case 'GET': get_handler(req, res); break;
        case 'POST': post_handler(req, res); break;
        case 'PUT': put_handler(req, res); break;
        case 'DELETE': delete_handler(req, res); break;
        default: HTTP405(req, res);
    }
}

let get_handler = (req, res) => {
    if (url.parse(req.url).pathname.split('/')[3]) {
        let param = decodeURIComponent(url.parse(req.url).pathname.split('/')[3]);
        let pathname = url.parse(req.url).pathname.split('/')[1] + url.parse(req.url).pathname.split('/')[2]
        switch (pathname) {
            case 'apifaculties': functions.getFaculty(req, res, param); break;
            case 'apipulpits': functions.getPulpit(req, res, param); break;
            default: HTTP404(req, res);
        }
    } else if (url.parse(req.url).query) {
        if (url.parse(req.url).pathname === '/api/pulpits') {
            let queryString = decodeURIComponent(url.parse(req.url).query);
            let params = queryString.split('=')[1].split(',');
            if (params[0] !== '')
                functions.getPulpitsByFaculty(req, res, params)
            else
                HTTP404(req, res);
        } else {
            HTTP404(req, res);
        }
    }
    else {
        let pathname = url.parse(req.url).pathname;
        switch (pathname) {
            case '/api/pulpits': functions.getPulpits(req, res); break;
            case '/api/faculties': functions.getFaculties(req, res); break;
            default: HTTP404(req, res);
        }
    }
}

let post_handler = (req, res) => {
    let pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/pulpits': functions.postPulpits(req, res); break;
        case '/api/faculties': functions.postFaculties(req, res); break;
        case '/transaction': functions.transaction(req, res); break;
        default: HTTP404(req, res);
    }
}

let put_handler = (req, res) => {
    let pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/pulpits': functions.putPulpits(req, res); break;
        case '/api/faculties': functions.putFaculties(req, res); break;
        default: HTTP404(req, res);
    }
}

let delete_handler = (req, res) => {
    let pathname = '/' + url.parse(req.url).pathname.split('/')[1] + '/' + url.parse(req.url).pathname.split('/')[2];
    let param = decodeURIComponent((url.parse(req.url).pathname.split('/')[3]));
    switch (pathname) {
        case '/api/pulpits': functions.deletePulpit(req, res, param); break;
        case '/api/faculties': functions.deleteFaculty(req, res, param); break;
        default: HTTP404(req, res);
    }
}

let HTTP405 = (req, res) => {
    let message = ` Method ${req.method} Not Allowed [405]`;
    let errInfo = {
        error: 'Method Not Allowed [405]',
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
        error: 'Adress Not Found [404]',
        method: req.method,
        url: req.url
    }
    console.log(message);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}

