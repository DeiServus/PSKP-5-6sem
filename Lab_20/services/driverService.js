const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getDrivers = () => {
    return new Promise((resolve, reject) => {
        prisma.driver.findMany().then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const addDriver = (facility) => {
    return new Promise((resolve, reject) => {
        prisma.driver.create({
            data: {
                name: facility.name,
                exper: facility.exper,
                transportation_id: +facility.transportation_id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const updateDriver = (facility) => {
    return new Promise((resolve, reject) => {
        prisma.driver.update({
            where: {
                id: facility.id
            },
            data: {
                name: facility.name,
                exper: facility.exper,
                transportation_id: +facility.transportation_id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const deleteDriver = (id) => {
    return new Promise((resolve, reject) => {
        prisma.driver.delete({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const getDriverById = (id) => {
    return new Promise((resolve, reject) => {
        prisma.driver.findUnique({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getDrivers,
    addDriver,
    updateDriver,
    deleteDriver,
    getDriverById
}