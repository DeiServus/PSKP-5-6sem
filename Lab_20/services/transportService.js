const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getTransports = () => {
    return new Promise((resolve, reject) => {
        prisma.transport.findMany().then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const addTransport = (tr) => {
    return new Promise((resolve, reject) => {
        console.log('service')
        prisma.transport.create({
            data: {
                model: tr.model,
                number: tr.number,
                load_capacity: parseFloat(tr.load_capacity),
                volume: parseFloat(tr.volume)
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const updateTransport = (tr) => {
    return new Promise((resolve, reject) => {
        prisma.transport.update({
            where: {
                id: +tr.id
            },
            data: {
                load_capacity: +tr.load_capacity,
                volume: +tr.volume,
                model: tr.model,
                number: tr.number
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const deleteTransport = (id) => {
    return new Promise((resolve, reject) => {
        prisma.transport.delete({
            where: {
                id: +id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const getTransportById = (id) => {
    return new Promise((resolve, reject) => {
        prisma.transport.findUnique({
            where: {
                id: +id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getTransports,
    addTransport,
    updateTransport,
    deleteTransport,
    getTransportById
}