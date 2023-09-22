const resolver = {
    getFaculties: (args, db) => {
        return  (args.FACULTY) ? db.getFaculty(args, db) : db.getFaculties(args, db);
    },

    getPulpits: (args, db) => {
        return  (args.PULPIT) ?db.getPulpit(args, db) : db.getPulpits(args, db);
    },

    getSubjects: (args, db) => {
        return  (args.SUBJECT) ? db.getSubject(args, db) : db.getSubjects(args, db);
    },

    getTeachers: (args, db) => {
        return  (args.TEACHER) ? db.getTeacher(args, db) : db.getTeachers(args, db);
    },

    setFaculty: async (args, db) => {
        let res = await db.updateFaculty(args, db);
        return (res == null) ? db.insertFaculty(args, db) : res;
    },

    setPulpit: async (args, db) => {
        let res = await db.updatePulpit(args, db);
        return  (res == null) ? db.insertPulpit(args, db) : res;
    },

    setSubject: async (args, db) => {
        let res = await db.updateSubject(args, db);
        return  (res == null) ? db.insertSubject(args, db) : res;
    },

    setTeacher: async (args, db) => {
        let res = await db.updateTeacher(args, db);
        return (res == null) ? db.insertTeacher(args, db) : res;
    },

    delFaculty: (args, db) =>db.delFaculty(args, db),
    delPulpit: (args, db) => db.delPulpit(args, db),
    delSubject: (args, db) => db.delSubject(args, db),
    delTeacher: (args, db) => db.delTeacher(args, db),
    getTeachersByFaculty: (args, db) => db.getTeachersByFaculty(args, db),
    getSubjectsByFaculty: (args, db) => db.getSubjectsByFaculty(args, db)
};

module.exports = resolver;