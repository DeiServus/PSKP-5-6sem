const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getClients = () => {
    return new Promise((resolve, reject) => {
        prisma.client.findMany().then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const addClient = (cl) => {
    return new Promise((resolve, reject) => {
        prisma.client.create({
            data: {
                name: cl.name,
                email: cl.email,
                password: cl.password
            }
        }).then(x => {
            console.log(x.name)
            resolve(x)}).catch(err => {
            reject(err);
        })
    })
}

const updateClient = (cl) => {
    return new Promise((resolve, reject) => {
        prisma.client.update({
            where: {
                id: +cl.id
            },
            data: {
                name: cl.name,
                email: cl.email,
                password: cl.password
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const deleteClient = (id) => {
    return new Promise((resolve, reject) => {
        prisma.client.delete({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

const getClientById = (id) => {
    return new Promise((resolve, reject) => {
        prisma.client.findUnique({
            where: {
                id: id
            }
        }).then(x => resolve(x)).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById
}