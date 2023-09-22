const db = require('./DbService');
const fs = require('fs');

exports.mainPage = (req, res) => {
    let html = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}
exports.transaction = (req, res) => {
    db.dbService.transaction(res);
}
exports.getScope = (req, res) => {
    db.dbService.getScope(res);
}
exports.getPages = (req, res) => {
    db.dbService.getPages(req, res).then(data=>{
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    })
}
exports.getCount = (req, res) => {
    db.dbService.getCount(req, res).then(data=>{
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ count: data._count.PULPIT }));
    })
}
exports.getPulpits = (req, res) => {
    db.dbService.getPulpits().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}

exports.getPulpitsWithTeachersCount = (req, res) => {
    db.dbService.getPulpitsWithTeachersCount().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}

exports.getFaculties = (req, res) => {
    db.dbService.getFaculties().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}

exports.getSubjects = (req, res) => {
    db.dbService.getSubjects().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}

exports.getAuditoriumTypes = (req, res) => {
    db.dbService.getAuditoriumTypes().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}
exports.getTeachers = (req, res) => {
    db.dbService.getTeachers().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    })
}


exports.getAuditoriums = (req, res) => {
    db.dbService.getAuditoriums().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    });
}

exports.getPulpitsWithVladimir = (req, res) => {
    db.dbService.getPulpitsWithVladimir().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getAuditoriumsSameCount = (req, res) => {
    db.dbService.getAuditoriumsSameCount().then(data => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getFluentAPI = (req, res) => {
    db.dbService.getFluentAPI().then(data => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postPulpits = async (req, res) => {
    console.log('before');
    const param = await getDataFromBody(req);
    return await db.dbService.postPulpit(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postFaculties = async (req, res) => {
    const param = await getDataFromBody(req);
    await db.dbService.postFaculty(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postTeachers = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.postTeacher(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postSubjects = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.postSubject(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postAuditoriumTypes = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.postAuditoriumType(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.postAuditoriums = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.postAuditorium(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.putPulpits = async(req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putPulpit(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.putFaculties = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putFaculty(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
};

exports.putSubjects = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putSubject(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.putTeachers = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putTeacher(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.putAuditoriumTypes = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putAuditoriumType(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.putAuditoriums = async (req, res) => {
    const param = await getDataFromBody(req);
    db.dbService.putAuditorium(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.deleteFaculties = (req, res, param) => {
    db.dbService.deleteFaculty(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.deleteSubjects = (req, res, param) => {
    db.dbService.deleteSubject(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.deleteAuditoriumTypes = (req, res, param) => {
    db.dbService.deleteAuditoriumType(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.deleteAuditoriums = (req, res, param) => {
    db.dbService.deleteAuditorium(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.deletePulpits = (req, res, param) => {
    db.dbService.deletePulpit(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});

}
exports.deleteTeachers = (req, res, param) => {
    db.dbService.deleteTeacher(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getSubjectsByFaculty = (req, res, param) => {
    db.dbService.getSubjectsByFaculty(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getAuditoriumsByTypes = (req, res, param) => {
    db.dbService.getAuditoriumsByAuditoriumType(param).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getAuditoriumsWithComp1 = (req, res) => {
    db.dbService.getAuditoriumsWithComp1().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.getPuplitsWithoutTeachers = (req, res) => {
    db.dbService.getPuplitsWithoutTeachers().then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}

exports.transaction = (req, res) => {
    db.dbService.transaction(res).then(data=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));        
    }).catch((error) => {res.writeHead(400); res.end(JSON.stringify({error: error.message}));});
}
const getDataFromBody = async (req) => {
    let reqData = '';
    for await (const chunk of req) {
        reqData += chunk;
    }
    return JSON.parse(reqData.toString());
}