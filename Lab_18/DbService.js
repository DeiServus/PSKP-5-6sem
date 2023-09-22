const Sequelize = require('sequelize');
const sequelize = new Sequelize('UNIVER', 'sa', '1111', {host: 'localhost', dialect: 'mssql', define:{
    hooks:{
        beforeBulkDestroy:(options)=>{console.log('--------beforeDelete-----------');}
    }
}});
const {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium}=require('./tables').ORM(sequelize)
class DataBaseService{
    constructor(){
        this.sequelize = new Sequelize('UNIVER', 'sa', '1111', {host: 'localhost', dialect: 'mssql'})
        .authenticate()
        .then(() => {console.log('Соединение с базой данных установлено');})
        .catch(err => {console.log('Ошибка при соединении с базой данных', err)});
    }

    transaction = async (response) => {
        return new Promise((resolve, reject) => {
            sequelize.transaction().then(t => {
                Auditorium.update(
                    {auditorium_capacity: 0},
                    {where: {}, transaction: t}
                    ).then(updated => {
                        setTimeout(() => {
                            t.rollback();
                        }, 10000);
                        Auditorium.findAll({transaction: t}).then(res =>{
                            resolve(res);
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(JSON.stringify(res));
                        }).catch(err => {
                            reject({status: 400, message: err});
                        })
                    }).catch(err => {
                        reject({status: 400, message: err});
                    })
                })
            })
        }
    getScope(res){
        Auditorium.scope('auditoriumsMore').findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }

    getFaculties(res){
        Faculty.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getPulpits(res){
        Pulpit.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getTeachers(res){
        Teacher.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getSubjects(res){
        Subject.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getAuditoriumTypes(res){
        Auditorium_type.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getAuditoriums(res){
        Auditorium.findAll().then(result => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));});
    }
    getSubjectsByFaculty(fields, res){
        Faculty.findAll({
            include:[{
                where:{faculty:fields},
                model:Pulpit,
                as: 'faculty_pulpits',
                include:[{model:Subject, as:'pulpit_subject'}]
            }]
        }).then(result=> {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));
        }).catch(err => {res.writeHead(400); res.end(JSON.stringify({error: err}))})
    }
    getAuditoriumsByTypes(fields, res){
        Auditorium_type.findAll({
            include:[{
                where:{auditorium_type:fields},
                model:Auditorium,
                as: 'type_auditoriums'
            }]
        }).then(result=> {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(result));
        })
        .catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    postFaculties(f, fname, body, res){
        Faculty.create({faculty:f, faculty_name:fname})
        .then(() => {res.end(JSON.stringify(body));})
        .catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    postPulpits(p, pname, f, body, res){
        Pulpit.create({pulpit:p, pulpit_name:pname, faculty:f})
        .then(() => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(body));
        })
        .catch(err=>{res.writeHead(500); res.end(JSON.stringify({error: err}))});
    }
    postTeachers(t, tname, p, body, res){
        Teacher.create({teacher:t, teacher_name:tname, pulpit:p})
        .then(() => {res.end(JSON.stringify(body));})
        .catch(err=>{res.writeHead(500); res.end(JSON.stringify({error: err}))});
    }
    postSubjects(s, sname, p, body, res){
        Subject.create({subject:s, subject_name: sname, pulpit:p})
        .then(() => {res.end(JSON.stringify(body));})
        .catch(err=>{res.writeHead(500); res.end(JSON.stringify({error: err}))});
    }
    postAuditoriumTypes(at, atname, body, res){
        Auditorium_type.create({auditorium_type:at, auditorium_typename:atname})
        .then(() => {res.end(JSON.stringify(body));})
        .catch(err=>{res.writeHead(500); res.end(JSON.stringify({error: err}))});
    }
    postAuditoriums(a, aname, ac, at, body, res){
        Auditorium.create({auditorium:a, auditorium_name:aname, auditorium_capacity:ac, auditorium_type:at})
        .then(() => {res.end(JSON.stringify(body));})
        .catch(err=>{res.writeHead(500); res.end(JSON.stringify({error: err}))});
    }
    putFaculties(f, fname, res){
        Faculty.findOne({where:{faculty:f}}).then((result)=>{
            if(result!=null){
                Faculty.update({faculty_name:fname},{where:{faculty:f}})
                .then((r) => {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({faculty:f, faculty_name:fname}));})
                .catch(err=>{
                    res.writeHead(400); 
                    res.end(JSON.stringify({error: err}))
                });
            }else{
                throw 'there is no such faculty';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))})
    }
    putPulpits(p, pname, f, res) {
        Pulpit.findOne({where:{pulpit:p}}).then((result)=>{
            if(result!=null) {
                Pulpit.update({pulpit_name:pname, faculty:f},{where:{pulpit:p}})
                .then((r) => {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({pulpit:p, pulpit_name:pname, faculty:f}));})
                .catch(err => {
                    res.writeHead(400); 
                    res.end(JSON.stringify({error: err}))
                });
            } else {
                throw 'there is no such pulpit';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))})
    }
    putTeachers(t, tname, p, res){
        Teacher.findOne({where:{teacher:t}}).then((result)=>{
            if(result!=null){
                Teacher.update({teacher_name:tname, pulpit:p},{where:{teacher:t}})
                .then((r) => {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({teacher:t, teacher_name:tname, pulpit:p}));})
                .catch(err=>{
                    res.writeHead(400); 
                    res.end(JSON.stringify({error: err}))
                });
            }else{
                throw 'there is no such teacher';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))})
    }
    putSubjects(s, sname, p, res){
        Subject.findOne({where:{subject:s}}).then((result)=>{
            if(result!=null){
                Subject.update({subject_name:sname, pulpit:p},{where:{subject:s}})
                .then(r=>{
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({subject:s, subject_name:sname, pulpit:p}));})
                .catch(err=>{
                    res.writeHead(400); 
                    res.end(JSON.stringify({error: err}))
                })
            }else{
                throw 'there is no such subject';    
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    
    putAuditoriumTypes(at, atname){
        Auditorium_type.create({auditorium_typename:atname},{where:{auditorium_type:at}})
        .then(types=>{return types})
        .catch(err=>{console.log('DbService ERROR: '+err)});
    }
    putAuditoriums(a, aname, ac, at, res){
        Auditorium.findOne({where:{auditorium:a}}).then((result)=>{
            if(result!=null){
                Auditorium.update({auditorium_name:aname, auditorium_capacity:ac, auditorium_type:at},{where:{auditorium:a}})
                .then(r=>{
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({auditorium:a, auditorium_name:aname, auditorium_capacity:ac, auditorium_type:at}));})
                .catch(err=>{
                    res.writeHead(400); 
                    res.end(JSON.stringify({error: err}))
                })
            }else{
                throw 'there is no such auditorium';    
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    deleteFaculties(f, res){
        Faculty.findOne({where:{faculty:f}}).then((result)=>{
            if(result!=null){
                Faculty.destroy({where:{faculty:f}})
                .then((records) => {res.end(JSON.stringify(result));})
            }else{
                throw 'there is no such faculty';
            }
        })
        .catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    deletePulpits(p, res){
        Pulpit.findOne({where:{pulpit:p}}).then(result=>{
            if(result!=null){
                Pulpit.destroy({where:{pulpit:p}})
                .then(records=>{
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));})
            }else{
                throw 'there is no such pulpit';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    deleteTeachers(t, res){
        Teacher.findOne({where:{teacher:t}}).then(result=>{
            if(result!=null){
                Teacher.destroy({where: {teacher:t}})
                .then((records) => {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));})
            }else{
                throw 'there is no such teacher';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    deleteSubjects(s, res){
        Subject.findOne({where:{subject:s}})
        .then(result=>{
            if(result!=null){
                Subject.destroy({where:{subject:s}})
                .then((records) => {res.end(JSON.stringify(result));})
            }else{
                throw 'there is no such subject';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
    deleteAuditoriumTypes(at, res){
        Auditorium_type.findOne({where:{auditorium_type:at}})
        .then(result=>{
            if(result!=null){
                Auditorium_Type.destroy({where:{auditorium_type:at}})
                .then((records) => {res.end(JSON.stringify(result));})
            }
        }).catch(err=>{console.log('DbService ERROR: '+err)});
    }
    deleteAuditoriums(a, res){
        Auditorium.findOne({where:{auditorium:a}})
        .then(result=>{
            if(result!=null){
                Auditorium.destroy({where:{auditorium:a}})
                .then((records) => {res.end(JSON.stringify(result));})
            }else{
                throw 'there is no such auditorium';
            }
        }).catch(err=>{res.writeHead(400); res.end(JSON.stringify({error: err}))});
    }
}

module.exports = new DataBaseService();