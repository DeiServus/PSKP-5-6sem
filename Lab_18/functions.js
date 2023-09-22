const DBExample = require('./DbService');
const fs = require('fs');

exports.mainPage = (req, res) => {
    let html = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}
exports.transaction = (req, res) => {
    DBExample.transaction(res);
}
exports.getScope = (req, res) => {
    DBExample.getScope(res);
}
exports.getPulpits = (req, res) => {
    DBExample.getPulpits(res);
}

exports.getFaculties = (req, res) => {
    DBExample.getFaculties(res);
}

exports.getSubjects = (req, res) => {
    DBExample.getSubjects(res);
}

exports.getAuditoriumTypes = (req, res) => {
    DBExample.getAuditoriumTypes(res);
}
exports.getTeachers = (req, res) => {
    DBExample.getTeachers(res);
}

exports.getAuditoriums = (req, res) => {
    DBExample.getAuditoriums(res);
}

exports.postPulpits = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
            body = JSON.parse(body);
            DBExample.postPulpits(body.pulpit,body.pulpit_name,body.faculty, body, res)
    });
}

exports.postFaculties = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
            body = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            DBExample.postFaculties(body.faculty,body.faculty_name, body, res)
    });
}

exports.postTeachers = (req, res) => {
    let body = '';
    req.on("data", chunk=> {body+=chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        DBExample.postTeachers(body.teacher,body.teacher_name, body.pulpit , body, res)
    });
}

exports.postSubjects = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
            body = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            DBExample.postSubjects(body.subject,body.subject_name,body.pulpit, body, res)
            .catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}))});
    });
}

exports.postAuditoriumTypes = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
            body = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            DBExample.postAuditoriumTypes(body.AUDITORIUM_TYPE,body.AUDITORIUM_TYPENAME, body, res)
            .catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}))});
    });
}

exports.postAuditoriums = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
            body = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            DBExample.postAuditoriums(body.AUDITORIUM,body.AUDITORIUM_NAME,body.AUDITORIUM_CAPACITY,body.AUDITORIUM_TYPE, body, res)
            .catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
    });
}

exports.putPulpits = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.putPulpits(body.pulpit, body.pulpit_name ,body.faculty, response);
    });
}

exports.putFaculties = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.putFaculties(body.faculty,body.faculty_name, response)
    })
};

exports.putSubjects = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, { "Content-Type": "application/json" });
        DBExample.putSubjects(body.subject,body.subject_name,body.pulpit, response);
    });
}

exports.putTeachers = (req, res) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        DBExample.putTeachers(body.teacher, body.teacher_name, body.pulpit, res);
    });
}

exports.putAuditoriumTypes = (req, response) => {
    let body = '';
    req.on("data", (chunk) => { body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        DBExample.getAuditoriumTypes(body.auditorium_type)
            .then((res) => {
                if (res.recordset.length == 0) throw "No such auditorium_type";
                else DBExample.putAuditoriumTypes(body.auditorium_type,body.auditorium_typename)
                    .then((records) => {
                        response.writeHead(200, {"Content-Type": "application/json",});
                        response.end(JSON.stringify(body));
                    });
            });
    });
}

exports.putAuditoriums = (req, response) => {
    let body = '';
    req.on("data", (chunk) => {body += chunk;});
    req.on("end", () => {
        body = JSON.parse(body);
        response.writeHead(200, {"Content-Type": "application/json",});
        DBExample.putAuditoriums(body.auditorium,body.auditorium_name,body.auditorium_capacity,body.auditorium_type, response);
    });
}

exports.deleteFaculties = (req, response, param) => {
    DBExample.deleteFaculties(param, response);
}

exports.deleteSubjects = (req, response, param) => {
    DBExample.deleteSubjects(param, response);
}

exports.deleteAuditoriumTypes = (req, response, param) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    DBExample.deleteAuditoriumTypes(param, response);
}

exports.deleteAuditoriums = (req, res, param) => {
    DBExample.deleteAuditoriums(param, res);
}

exports.deletePulpits = (req, res, param) => {
    DBExample.deletePulpits(param, res);

}
exports.deleteTeachers = (req, res, param) => {
    DBExample.deleteTeachers(param, res);
}

exports.getSubjectsByFaculty = (req, res, param) => {
    DBExample.getSubjectsByFaculty(param, res);
}

exports.getAuditoriumsByTypes = (req, res, param) => {
    DBExample.getAuditoriumsByTypes(param, res);
}