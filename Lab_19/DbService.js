const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const url = require('url'); 
const querystring = require('querystring'); 

const getPages = (req, res) => {
    let parsedUrl = url.parse(req.url); 
    let parsedQs = querystring.parse(parsedUrl.query); 
    return new Promise((resolve, reject) => {
        prisma.pULPIT.findMany({
            skip: (parseInt(parsedQs.page) - 1)*10,
            take: 10,
            select: {
                PULPIT: true,
                PULPIT_NAME: true,
                FACULTY: true,
                _count: true
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getCount = (req, res) => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.aggregate({
            where: {},
            _count: {
                PULPIT: true
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getFaculties = () => {
    return new Promise((resolve, reject) => {
        prisma.fACULTY.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getPulpits = () => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getPulpitsWithTeachersCount = () => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.findMany({
            include:{
                _count:{
                    select:{
                        PULPIT: true,
                        PULPIT_NAME: true,
                        FACULTY: true,
                        _count: true
                    }
                }
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getSubjects = () => {
    return new Promise((resolve, reject) => {
        prisma.sUBJECT.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getTeachers = () => {
    return new Promise((resolve, reject) => {
        prisma.tEACHER.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getAuditoriumTypes = () => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM_TYPE.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getAuditoriums = () => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM.findMany().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getSubjectsByFaculty = (faculty) => {
    return new Promise((resolve, reject) => {
        prisma.fACULTY.findMany({
            select: {
                FACULTY: true,
                PULPIT_PULPIT_FACULTYToFACULTY: {
                    select: {
                        PULPIT: true,
                        SUBJECT_SUBJECT_PULPITToPULPIT: {
                            select: {
                                SUBJECT_NAME: true
                            }
                        }
                    }
                }
            },
            where: {
                FACULTY: faculty
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getAuditoriumsByAuditoriumType = (auditoriumType) => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM_TYPE.findMany({
            select: {
                AUDITORIUM_TYPE: true,
                AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
                    select: {
                        AUDITORIUM: true
                    }
                }
            },
            where: {
                AUDITORIUM_TYPE: auditoriumType
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getAuditoriumsWithComp1 = () => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM.findMany({
            where: {
                AND: {
                    AUDITORIUM_TYPE: 'ЛК',
                    AUDITORIUM_NAME: {
                        endsWith: '-1'
                    }
                }
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getPuplitsWithoutTeachers = () => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.findMany({
            include: {
                TEACHER_TEACHER_PULPITToPULPIT: true
            },
            where: {
                TEACHER_TEACHER_PULPITToPULPIT: {
                    none: {}
                }
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getPulpitsWithVladimir = () => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.findMany({
            include: {
                TEACHER_TEACHER_PULPITToPULPIT: true
            },
            where: {
                TEACHER_TEACHER_PULPITToPULPIT: {
                    some: {
                        TEACHER_NAME: { contains: 'Владимир' }
                    }
                }
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getAuditoriumsSameCount = () => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM.groupBy({
            by: ['AUDITORIUM_CAPACITY', 'AUDITORIUM_TYPE'],
            _count: {
                _all: true,
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const getFluentAPI = () => {
    return new Promise((resolve, reject) => {
        prisma.fACULTY.findUnique({
            where: {
                FACULTY: 'ИДиП'
            }
        }).PULPIT_PULPIT_FACULTYToFACULTY().then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const postFaculty = (faculty) => {
    console.log(faculty.FACULTY_NAME);
    return new Promise((resolve, reject) => {
        console.log(faculty.PULPITS);
        prisma.fACULTY.create({
            data: {
                FACULTY: faculty.FACULTY,
                FACULTY_NAME: faculty.FACULTY_NAME,
                PULPIT_PULPIT_FACULTYToFACULTY: {
                    create: faculty.PULPITS.map(pulpit => ({
                      PULPIT: pulpit.PULPIT,
                      PULPIT_NAME: pulpit.PULPIT_NAME
                    }))
                }
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
        
    })
}

const postPulpit = (pulpit) => {
    return new Promise((resolve, reject) => {
        prisma.pULPIT.create({
                    data: {
                        PULPIT: pulpit.PULPIT,
                        PULPIT_NAME: pulpit.PULPIT_NAME,
                        FACULTY_PULPIT_FACULTYToFACULTY: {
                            connectOrCreate: {
                                where: {
                                    FACULTY: pulpit.FACULTY
                                },
                                create: {
                                    FACULTY: pulpit.FACULTY,
                                    FACULTY_NAME: pulpit.FACULTY_NAME
                                }
                            }
                        }
                    }
                }).then(fac => {
            resolve(fac)})
        .catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const postSubject = (subject) => {
    return new Promise((resolve, reject) => {
        prisma.sUBJECT.create({
            data: {
                SUBJECT: subject.SUBJECT,
                SUBJECT_NAME: subject.SUBJECT,
                PULPIT: subject.PULPIT
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const postTeacher = (teacher) => {
    return new Promise((resolve, reject) => {
        prisma.tEACHER.create({
            data: {
                TEACHER: teacher.TEACHER,
                TEACHER_NAME: teacher.TEACHER_NAME,
                PULPIT: teacher.PULPIT
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const postAuditoriumType = (auditoriumType) => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM_TYPE.create({
            data: {
                AUDITORIUM_TYPE: auditoriumType.AUDITORIUM_TYPE,
                AUDITORIUM_TYPENAME: auditoriumType.AUDITORIUM_TYPENAME
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const postAuditorium = (auditorium) => {
    return new Promise((resolve, reject) => {
        prisma.aUDITORIUM.create({
            data: {
                AUDITORIUM: auditorium.AUDITORIUM,
                AUDITORIUM_NAME: auditorium.AUDITORIUM_NAME,
                AUDITORIUM_CAPACITY: auditorium.AUDITORIUM_CAPACITY,
                AUDITORIUM_TYPE: auditorium.AUDITORIUM_TYPE
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putFaculty = (faculty) => {
    return new Promise((resolve, reject) => {
        prisma.fACULTY.update({
            where: {
                FACULTY: faculty.FACULTY
            },
            data: {
                FACULTY: faculty.FACULTY,
                FACULTY_NAME: faculty.FACULTY_NAME
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putPulpit = (pulpit) => {
    return new Promise((resolve, reject) => {
        prisma.PULPIT.update({
            where: {
                PULPIT: pulpit.PULPIT
            },
            data: {
                PULPIT: pulpit.PULPIT,
                PULPIT_NAME: pulpit.PULPIT_NAME,
                FACULTY: pulpit.FACULTY
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putSubject = (subject) => {
    return new Promise((resolve, reject) => {
        prisma.SUBJECT.update({
            where: {
                SUBJECT: subject.SUBJECT
            },
            data: {
                SUBJECT: subject.SUBJECT,
                SUBJECT_NAME: subject.SUBJECT_NAME,
                PULPIT: subject.PULPIT
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putTeacher = (teacher) => {
    return new Promise((resolve, reject) => {
        prisma.TEACHER.update({
            where: {
                TEACHER: teacher.TEACHER
            },
            data: {
                TEACHER: teacher.TEACHER,
                TEACHER_NAME: teacher.TEACHER_NAME,
                PULPIT: teacher.PULPIT
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putAuditoriumType = (auditoriumType) => {
    return new Promise((resolve, reject) => {
        prisma.AUDITORIUM_TYPE.update({
            where: {
                AUDITORIUM_TYPE: auditoriumType.AUDITORIUM_TYPE
            },
            data: {
                AUDITORIUM_TYPE: auditoriumType.AUDITORIUM_TYPE,
                AUDITORIUM_TYPENAME: auditoriumType.AUDITORIUM_TYPENAME
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const putAuditorium = (auditorium) => {
    return new Promise((resolve, reject) => {
        prisma.AUDITORIUM.update({
            where: {
                AUDITORIUM: auditorium.AUDITORIUM
            },
            data: {
                AUDITORIUM: auditorium.AUDITORIUM,
                AUDITORIUM_NAME: auditorium.AUDITORIUM_NAME,
                AUDITORIUM_CAPACITY: auditorium.AUDITORIUM_CAPACITY,
                AUDITORIUM_TYPE: auditorium.AUDITORIUM_TYPE
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deleteFaculty = (faculty) => {
    return new Promise((resolve, reject) => {
        prisma.FACULTY.delete({
            where: {
                FACULTY: faculty
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deletePulpit = (pulpit) => {
    return new Promise((resolve, reject) => {
        prisma.PULPIT.delete({
            where: {
                PULPIT: pulpit
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deleteSubject = (subject) => {
    return new Promise((resolve, reject) => {
        prisma.SUBJECT.delete({
            where: {
                SUBJECT: subject
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deleteTeacher = (teacher) => {
    return new Promise((resolve, reject) => {
        prisma.TEACHER.delete({
            where: {
                TEACHER: teacher
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deleteAuditoriumType = (auditoriumType) => {
    return new Promise((resolve, reject) => {
        prisma.AUDITORIUM_TYPE.delete({
            where: {
                AUDITORIUM_TYPE: auditoriumType
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const deleteAuditorium = (auditorium) => {
    return new Promise((resolve, reject) => {
        prisma.AUDITORIUM.delete({
            where: {
                AUDITORIUM: auditorium
            }
        }).then(fac => resolve(fac)).catch(err => {
            reject({status: 400, message: err});
        })
    })
}

const transaction = () => {
    return new Promise((resolve, reject) => {
            prisma.$transaction(() => {
                prisma.AUDITORIUM.updateMany({
                    data: {
                        AUDITORIUM_CAPACITY: {
                            increment: 100
                        }
                    }
                }).then().catch(err => {
                    reject({status: 400, message: err});
                })
                /*setTimeout(() => {*/
                    throw new Error('transaction rollback');
                /*}, 10000);*/
                /*setTimeout(() => {
                    prisma.AUDITORIUM.findMany().then(fac => resolve(fac)).catch(err => {
                        reject({status: 400, message: err});
                    })
                }, 1000);*/
            }).catch(err =>{
                console.log(`${err}`);
                reject(err);
            })
    })
}

module.exports.dbService = {
    getPulpitsWithTeachersCount,
    getPages,
    getCount,
    getFaculties,
    getPulpits,
    getSubjects,
    getTeachers,
    getAuditoriumTypes,
    getAuditoriums,
    getSubjectsByFaculty,
    getAuditoriumsByAuditoriumType,
    getAuditoriumsWithComp1,
    getPuplitsWithoutTeachers,
    getPulpitsWithVladimir,
    getAuditoriumsSameCount,
    getFluentAPI,
    postFaculty,
    postPulpit,
    postSubject,
    postTeacher,
    postAuditoriumType,
    postAuditorium,
    putFaculty,
    putPulpit,
    putSubject,
    putTeacher,
    putAuditoriumType,
    putAuditorium,
    deleteFaculty,
    deletePulpit,
    deleteSubject,
    deleteTeacher,
    deleteAuditoriumType,
    deleteAuditorium,
    transaction
}
