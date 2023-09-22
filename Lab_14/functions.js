const DBExample = require('./DbService');
const fs = require('fs');
const { write_error_400 } = require('./handlers');

exports.mainPage = (req, res) => {
    let html = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}

exports.getPulpits = (req, res) => {
    DBExample.getPulpits().then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}

exports.postPulpits = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        try {
            body = JSON.parse(body);
            DBExample.postPulpits(body.PULPIT,body.PULPIT_NAME,body.FACULTY)
                .then((records) => {
                    res.writeHead(200, {"Content-Type": "application/json",});
                    res.end(JSON.stringify(body));
                }).catch((error) => {write_error_400(res, error);});
        } catch (error) {write_error_400(res, error.message);}
    });
}

exports.putPulpits = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.getPulpit(body.PULPIT)
            .then((res) => {
                if (res.recordset.length == 0 || body.PULPIT=='' || body.PULPIT_NAME=='' || body.FACULTY=='') throw "No such pulpit or not enough info";
                else DBExample.putPulpits(body.PULPIT,body.PULPIT_NAME,body.FACULTY)
                        .then((records) => {
                            response.end(JSON.stringify(body));
                        }).catch((error) => {write_error_400(response, error);});
            }).catch((error) => {write_error_400(response, error);});
    });
}

exports.deletePulpits = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.getPulpit(param).then((res) => {
        if (res.recordset.length == 0 || param=='' || param==undefined) throw "No such pulpit";
        else DBExample.deletePulpits(param).then((records) => {
            response.end(JSON.stringify(res.recordset[0]));
        }).catch((error) => {write_error_400(response, error);});
    }).catch((error) => {write_error_400(response, error);});
}

exports.getFaculties = (req, res) => {
    DBExample.getFaculties().then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}

exports.getSubjects = (req, res) => {
    DBExample.getSubjects().then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}

exports.getAuditoriumTypes = (req, res) => {
    DBExample.getAuditoriumTypes().then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}

exports.getAuditoriums = (req, res) => {
    DBExample.getAuditoriums().then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}

exports.postFaculties = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        try {
            body = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            DBExample.postFaculties(body.FACULTY,body.FACULTY_NAME)
                .then((records) => {res.end(JSON.stringify(body));})
                .catch((error) => {write_error_400(res, error);});
        } catch (error) {write_error_400(res, error.message);}
    });
}

exports.postSubjects = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        try {
            body = JSON.parse(body);
            DBExample.postSubjects(body.SUBJECT,body.SUBJECT_NAME,body.PULPIT)
                .then((records) => {
                    res.writeHead(200, {"Content-Type": "application/json",});
                    res.end(JSON.stringify(body));
                }).catch((error) => {write_error_400(res, error);});
        } catch (error) {write_error_400(res, error.message);}
    });
}

exports.postAuditoriumTypes = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        try {
            body = JSON.parse(body);
            DBExample.postAuditoriumsTypes(body.AUDITORIUM_TYPE,body.AUDITORIUM_TYPENAME)
                .then((records) => {
                    res.writeHead(200, {"Content-Type": "application/json",});
                    res.end(JSON.stringify(body));
                }).catch((error) => {write_error_400(res, error);});
        } catch (error) {write_error_400(res, error.message);}
    });
}

exports.postAuditoriums = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
        try {
            body = JSON.parse(body);
            DBExample.postAuditoriums(body.AUDITORIUM,body.AUDITORIUM_NAME,body.AUDITORIUM_CAPACITY,body.AUDITORIUM_TYPE)
                .then((records) => {
                    res.writeHead(200, {"Content-Type": "application/json",});
                    res.end(JSON.stringify(body));
                }).catch((error) => {write_error_400(res, error);});
        } catch (error) {write_error_400(res, error.message);}
    });
}

exports.putFaculties = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.getFaculty(body.FACULTY)
            .then((res) => {
                if (res.recordset.length == 0) throw "No such faculty";
                else DBExample.putFaculties(body.FACULTY,body.FACULTY_NAME)
                .then((records) => {response.end(JSON.stringify(body));})
                .catch((error) => {write_error_400(response, error);});
            }).catch((error) => {write_error_400(response, error);});
    });
}

exports.putSubjects = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.getSubject(body.SUBJECT)
            .then((res) => {
                if (res.recordset.length == 0) throw "No such subject";
                else DBExample.putSubjects(body.SUBJECT,body.SUBJECT_NAME,body.PULPIT)
                    .then((records) => {response.end(JSON.stringify(body));})
                    .catch((error) => {write_error_400(response, error);});
            }).catch((error) => {write_error_400(response, error);});
    });
}

exports.putAuditoriumTypes = (req, response) => {
    let body = '';
    req.on("data", (chunk) => { body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        DBExample.getAuditoriumTypes(body.AUDITORIUM_TYPE)
            .then((res) => {
                if (res.recordset.length == 0) throw "No such auditorium_type";
                else DBExample.putAuditoriumsTypes(body.AUDITORIUM_TYPE,body.AUDITORIUM_TYPENAME)
                    .then((records) => {
                        response.writeHead(200, {"Content-Type": "application/json",});
                        response.end(JSON.stringify(body));
                    }).catch((error) => {write_error_400(response, error);});
            }).catch((error) => {write_error_400(response, error);});
    });
}

exports.putAuditoriums = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        DBExample.getAuditorium(body.AUDITORIUM)
            .then((res) => {
                if (res.recordset.length == 0) throw "No such auditorium";
                else
                    response.writeHead(200, {"Content-Type": "application/json",});
                DBExample.putAuditoriums(body.AUDITORIUM,body.AUDITORIUM_NAME,body.AUDITORIUM_CAPACITY,body.AUDITORIUM_TYPE)
                    .then((records) => {response.end(JSON.stringify(body));})
                    .catch((error) => {write_error_400(response, error);});
            }).catch((error) => {write_error_400(response, error);});
    });
}

exports.deleteFaculties = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.getFaculty(param)
    .then((res) => {
        if (res.recordset.length == 0) throw "No such faculty";
        else DBExample.deleteFaculties(param)
        .then((records) => {response.end(JSON.stringify(res.recordset[0]));})
        .catch((error) => {write_error_400(response, error);});
    }).catch((error) => {write_error_400(response, error);});
}

exports.deleteSubjects = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.getSubject(param)
        .then((res) => {
            if (res.recordset.length == 0) throw "No such subject";
            else DBExample.deleteSubjects(param)
            .then((records) => {response.end(JSON.stringify(res.recordset[0]));})
            .catch((error) => {write_error_400(response, error);});
        }).catch((error) => {write_error_400(response, error);});
}

exports.deleteAuditoriumTypes = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.getAuditoriumTypes(param)
        .then((res) => {
            if (res.recordset.length == 0) throw "No such auditorium type";
            else DBExample.deleteAuditoriumsTypes(param)
            .then((records) => {response.end(JSON.stringify(res.recordset[0]));})
            .catch((error) => {write_error_400(response, error);});
        }).catch((error) => {write_error_400(response, error);});
}

exports.deleteAuditoriums = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.getAuditorium(param)
        .then((res) => {
            if (res.recordset.length == 0) throw "No such auditorium";
            DBExample.deleteAuditoriums(param)
            .then((records) => {
                response.end(JSON.stringify(res.recordset[0]));
            }).catch((error) => {write_error_400(response, error);});
        }).catch((error) => {write_error_400(response, error);});
}

exports.getPulpitsByFaculties = (req, res, param) => {
    DBExample.getPulpitsByFaculty(param)
        .then((records) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(records.recordset));
        }).catch((error) => {write_error_400(res, error);});
}

exports.getAuditoriumsByTypes = (req, res, param) => {
    DBExample.getAuditoriumsByAuditoriumType(param)
    .then((records) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(records.recordset));
    }).catch((error) => {write_error_400(res, error);});
}