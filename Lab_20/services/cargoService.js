const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getCargoes = () => {
    return new Promise((resolve, reject) => {
        prisma.cargo.findMany().then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const addCargo = (cl) => {
    return new Promise((resolve, reject) => {
        prisma.cargo.create({
            data: {
                title: cl.title,
                volume: parseFloat(cl.volume),
                weight: parseFloat(cl.weight)
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const updateCargo = (cl) => {
    return new Promise((resolve, reject) => {
        prisma.cargo.update({
            where: {
                id: +cl.id
            },
            data: {
                title: cl.title,
                volume: parseFloat(cl.volume),
                weight: parseFloat(cl.weight)
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const deleteCargo = (id) => {
    return new Promise((resolve, reject) => {
        prisma.cargo.delete({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const getCargoById = (id) => {
    return new Promise((resolve, reject) => {
        prisma.cargo.findUnique({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getCargoes: getCargoes,
    addCargo: addCargo,
    updateCargo: updateCargo,
    deleteCargo: deleteCargo,
    getCargoById: getCargoById
}