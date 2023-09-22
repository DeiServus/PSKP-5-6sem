const mssql = require('mssql/msnodesqlv8');
const { HTTP400 } = require('./errors');
const config = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={SQL Server Native Client 11.0};' +
        'Server={DESKTOP-03DT0QB};' +
        'Database={UNIVER};' +
        'Trusted_Connection={yes};'
};

function DB(cb) {
    this.getFaculties = (args, context) => {
        return (new mssql.Request())
            .query('select * from FACULTY')
            .then((r) => { return r.recordset });
    };

    this.getPulpits = (args, context) => {
        return (new mssql.Request())
            .query('select * from PULPIT')
            .then((r) => { return r.recordset; });
    };

    this.getSubjects = (args, context) => {
        return (new mssql.Request())
            .query('select * from SUBJECT')
            .then((r) => { return r.recordset; });
    };

    this.getTeachers = (args, context) => {
        return (new mssql.Request())
            .query('select * from TEACHER')
            .then((r) => { return r.recordset; });
    };

    this.getFaculty = (args, context) => {
        return (new mssql.Request())
            .input('f', mssql.NVarChar, args.FACULTY)
            .query('select top(1) * from FACULTY where FACULTY = @f')
            .then((r) => { return r.recordset; });
    };

    this.getPulpit = (args, context) => {
        return (new mssql.Request())
            .input('p', mssql.NVarChar, args.PULPIT)
            .query('select top(1) * from PULPIT where PULPIT = @p')
            .then((r) => { return r.recordset; });
    };

    this.getSubject = (args, context) => {
        return (new mssql.Request())
            .input('s', mssql.NVarChar, args.SUBJECT)
            .query('select top(1) * from SUBJECT where SUBJECT = @s')
            .then((r) => { return r.recordset; });
    };

    this.getTeacher = (args, context) => {
        return (new mssql.Request())
            .input('t', mssql.NVarChar, args.TEACHER)
            .query('select top(1) * from TEACHER where TEACHER = @t')
            .then((r) => { return r.recordset; });
    };

    this.delFaculty = (args, context) => {
        return (new mssql.Request())
            .input('f', mssql.NVarChar, args.FACULTY)
            .query('delete from FACULTY where FACULTY = @f')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? new Error('there is no such record') : new Error('Everything is fine');
            });
    };

    this.delPulpit = (args, context) => {
        return (new mssql.Request())
            .input('p', mssql.NVarChar, args.PULPIT)
            .query('delete from PULPIT where PULPIT = @p')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.delSubject = (args, context) => {
        return (new mssql.Request())
            .input('s', mssql.NVarChar, args.SUBJECT)
            .query('delete from SUBJECT where SUBJECT = @s')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.delTeacher = (args, context) => {
        return (new mssql.Request())
            .input('t', mssql.NVarChar, args.TEACHER)
            .query('delete from TEACHER where TEACHER = @t')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.insertFaculty = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.FACULTY)
            .input('b', mssql.NVarChar, args.FACULTY_NAME)
            .query('insert FACULTY(FACULTY, FACULTY_NAME) values (@a, @b)')
            .then((r) => { return args });
    };

    this.insertPulpit = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.PULPIT)
            .input('b', mssql.NVarChar, args.PULPIT_NAME)
            .input('c', mssql.NVarChar, args.FACULTY)
            .query('insert PULPIT(PULPIT, PULPIT_NAME, FACULTY) values (@a, @b, @c)')
            .then((r) => { return args });
    };

    this.insertSubject = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.SUBJECT)
            .input('b', mssql.NVarChar, args.SUBJECT_NAME)
            .input('c', mssql.NVarChar, args.PULPIT)
            .query('insert SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values (@a, @b, @c)')
            .then((r) => { return args });
    };

    this.insertTeacher = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.TEACHER)
            .input('b', mssql.NVarChar, args.TEACHER_NAME)
            .input('c', mssql.NVarChar, args.PULPIT)
            .query('insert teacher(TEACHER, TEACHER_NAME, PULPIT) values (@a, @b, @c)')
            .then((r) => { return args });
    };

    this.updateFaculty = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.FACULTY)
            .input('b', mssql.NVarChar, args.FACULTY_NAME)
            .query('update FACULTY set FACULTY = @a, FACULTY_NAME = @b where FACULTY = @a')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.updatePulpit = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.PULPIT)
            .input('b', mssql.NVarChar, args.PULPIT_NAME)
            .input('c', mssql.NVarChar, args.FACULTY)
            .query('update PULPIT set PULPIT = @a, PULPIT_NAME = @b, FACULTY = @c where PULPIT = @a')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.updateSubject = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.SUBJECT)
            .input('b', mssql.NVarChar, args.SUBJECT_NAME)
            .input('c', mssql.NVarChar, args.PULPIT)
            .query('update SUBJECT set SUBJECT = @a, SUBJECT_NAME = @b, PULPIT = @c where SUBJECT = @a')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.updateTeacher = (args, context) => {
        return (new mssql.Request())
            .input('a', mssql.NVarChar, args.TEACHER)
            .input('b', mssql.NVarChar, args.TEACHER_NAME)
            .input('c', mssql.NVarChar, args.PULPIT)
            .query('update TEACHER set TEACHER = @a, TEACHER_NAME = @b, PULPIT = @c where TEACHER = @a')
            .then((r) => {
                return (r.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.getTeachersByFaculty = (args, context) => {
        return (new mssql.Request())
            .input('f', mssql.NVarChar, args.FACULTY)
            .query('select TEACHER.*, PULPIT.FACULTY from TEACHER ' +
                'inner join PULPIT on TEACHER.PULPIT = PULPIT.PULPIT ' +
                'inner join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY where FACULTY.FACULTY = @f')
            .then((r) => {
                let zaps = (obj) => {
                    return { TEACHER: obj.TEACHER, TEACHER_NAME: obj.TEACHER_NAME, PULPIT: obj.PULPIT }
                };
                let zapp = (obj) => {
                    return { FACULTY: obj.FACULTY, TEACHERS: [zaps(obj)] }
                };
                let rc = [];
                r.recordset.forEach((el, index) => {
                    if (index === 0)
                        rc.push(zapp(el));
                    else if (rc[rc.length - 1].FACULTY !== el.FACULTY)
                        rc.push(zapp(el));
                    else
                        rc[rc.length - 1].TEACHERS.push(zaps(el));
                });
                console.log(rc)
                return rc;
            })
    };

    this.getSubjectsByFaculty = (args, context) => {
        return new mssql.Request()
            .query(
                `select SUBJECT.*, PULPIT.PULPIT_NAME, PULPIT.FACULTY from SUBJECT 
            inner join PULPIT on subject.PULPIT = PULPIT.PULPIT 
            inner join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY 
            where FACULTY.FACULTY = '${args.FACULTY}'`
            )
            .then((result) => {
                const subjects = (obj) => {
                    return {SUBJECT: obj.SUBJECT,SUBJECT_NAME: obj.SUBJECT_NAME,PULPIT: obj.PULPIT,};
                };
                const pulpits = (obj) => {
                    return {PULPIT: obj.PULPIT,PULPIT_NAME: obj.PULPIT_NAME,FACULTY: obj.FACULTY,SUBJECTS: [subjects(obj)],};
                };
                const resultSet = [];

                resultSet.push(pulpits(result.recordset[0]));
                result.recordset.slice(1).forEach((item) => {
                    resultSet[resultSet.length - 1].PULPIT !== item.PULPIT
                        ? resultSet.push(pulpits(item))
                        : resultSet[resultSet.length - 1].SUBJECTS.push(subjects(item));
                });
                return resultSet;
            });
    };

    this.connect = mssql.connect(config, err => {
        err ? cb(err, null) : cb(null, this.connect);
    });
}

exports.DB = (cb) => { return new DB(cb) };