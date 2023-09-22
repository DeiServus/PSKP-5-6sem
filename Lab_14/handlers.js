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
    let param = decodeURIComponent(url.parse(req.url).pathname.split('/')[3]);
    let check = url.parse(req.url).pathname.split('/')[4];
    if (param && check) {
        let pathname = url.parse(req.url).pathname.split('/')[1] + url.parse(req.url).pathname.split('/')[2]
        console.log(pathname);
        switch(pathname) {
            case 'apifaculty' : functions.getPulpitsByFaculties(req,res,param); break;
            case 'apiauditoriumstypes' : functions.getAuditoriumsByTypes(req,res,param); break;
            default: HTTP404(req, res);
        }
    }
    else {
        let pathname = url.parse(req.url).pathname;
        console.log(pathname);
        switch (pathname) {
            case '/': functions.mainPage(req, res); break;
            case '/api/pulpits': functions.getPulpits(req, res); break;
            case '/api/faculties': functions.getFaculties(req, res); break;
            case '/api/subjects': functions.getSubjects(req, res); break;
            case '/api/auditoriumstypes': functions.getAuditoriumTypes(req, res); break;
            case '/api/auditoriums': functions.getAuditoriums(req, res); break;
            default: HTTP404(req, res);
        }
    }
}

let post_handler = (req, res) => {
    let pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/pulpits': functions.postPulpits(req, res); break;
        case '/api/faculties': functions.postFaculties(req, res); break;
        case '/api/subjects': functions.postSubjects(req, res); break;
        case '/api/auditoriumstypes': functions.postAuditoriumTypes(req, res); break;
        case '/api/auditoriums': functions.postAuditoriums(req, res); break;
        default: HTTP404(req, res);
    }
}

let put_handler = (req, res) => {
    let pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/pulpits': functions.putPulpits(req, res); break;
        case '/api/faculties': functions.putFaculties(req, res); break;
        case '/api/subjects': functions.putSubjects(req, res); break;
        case '/api/auditoriumstypes': functions.putAuditoriumTypes(req, res); break;
        case '/api/auditoriums': functions.putAuditoriums(req, res); break;
        default: HTTP404(req, res);
    }
}

let delete_handler = (req, res) => {
    let pathname = '/' + url.parse(req.url).pathname.split('/')[1] + '/' + url.parse(req.url).pathname.split('/')[2];
    let param = decodeURIComponent((url.parse(req.url).pathname.split('/')[3]));
    console.log(pathname);
    console.log(param);
    switch (pathname) {
        case '/api/pulpits': functions.deletePulpits(req, res, param); break;
        case '/api/faculties': functions.deleteFaculties(req, res, param); break;
        case '/api/subjects': functions.deleteSubjects(req, res, param); break;
        case '/api/auditoriumstypes': functions.deleteAuditoriumTypes(req, res, param); break;
        case '/api/auditoriums': functions.deleteAuditoriums(req, res, param); break;
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

exports.write_error_400 = (res, message) => {
    res.statusCode = 400;
    res.statusMessage = "Invalid method";
    if (typeof message == "string") {
        let errorJSON = { originalError: { info: { message } } };
        res.end(JSON.stringify(errorJSON));
    } else {
        res.end(JSON.stringify(message));
    }
}