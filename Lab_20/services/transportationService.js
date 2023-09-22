const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getTransportations = () => {
    return new Promise((resolve, reject) => {
        prisma.transportation.findMany().then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const addTransportation = (tr) => {
    return new Promise((resolve, reject) => {
        prisma.transportation.create({
            data: {
                cargo_id: +tr.cargo_id,
                transport_id: +tr.transport_id,
                client_id: +tr.client_id,
                fromCity: tr.fromCity,
                toCity: tr.toCity,
                price: parseFloat(tr.price),
                start_date: tr.start_date.toDateString,
                end_date: tr.end_date.toDateString
            }
        }).then(x => {
            console.log(x.price)
            resolve(x)}).catch(err => {
            reject(err);
        })
    })
}

const updateTransportation = (tr) => {
    return new Promise((resolve, reject) => {
        prisma.transportation.update({
            where: {
                id: +tr.id,
            },
            data: {
                cargo_id: +tr.cargo_id,
                transport_id: +tr.transport_id,
                client_id: +tr.client_id,
                fromCity: tr.fromCity,
                toCity: tr.toCity,
                price: parseFloat(tr.price),
                start_date: tr.start_date.toDateString,
                end_date: tr.end_date.toDateString
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const deleteTransportation = (id) => {
    console.log('Service');
    return new Promise((resolve, reject) => {
        prisma.transportation.delete({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const getTransportationById = (id) => {
    return new Promise((resolve, reject) => {
        prisma.transportation.findUnique({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getTransportations,
    addTransportation,
    updateTransportation,
    deleteTransportation,
    getTransportationById
}