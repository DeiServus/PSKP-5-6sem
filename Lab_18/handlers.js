const url = require('url');
const functions = require('./functions');
const DBExample = require('./DbService');

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
        console.log(param);
        switch(pathname) {
            case 'apifaculties' : functions.getSubjectsByFaculty(req,res,param); break;
            case 'apiauditoriumstypes' : functions.getAuditoriumsByTypes(req,res,param); break;
            default: res.writeHead(404); res.end(JSON.stringify({error: "Not found"}));
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
            case '/api/teachers': functions.getTeachers(req, res); break;
            case '/api/transaction': functions.transaction(req, res); break;
            case '/api/scope': functions.getScope(req, res); break;
            default: res.writeHead(404); res.end(JSON.stringify({error: "Not found"}));
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
        case '/api/teachers': functions.postTeachers(req, res); break;
        default: res.writeHead(404); res.end(JSON.stringify({error: "Not found"}));
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
        case '/api/teachers': functions.putTeachers(req, res); break;
        default: res.writeHead(404); res.end(JSON.stringify({error: "Not found"}));
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
        case '/api/teachers' : functions.deleteTeachers(req, res, param); break;
        default: res.writeHead(404); res.end(JSON.stringify({error: "Not found"}));
    }
}