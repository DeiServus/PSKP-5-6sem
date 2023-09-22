const clientService = require('../services/clientService');

exports.get = async (request, response) => {
    try {
        let data = await clientService.getClients();
        response.render('client', {
            data
        });
        return data;
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.add = async (request, response) => {
    try {
        console.log(JSON.stringify(request.body.n1));
        const string = JSON.stringify({name:request.body.n1, email: request.body.e1, password: request.body.p1});
        await clientService.addClient(string);
        let data = await clientService.getClients();
        response.render('client', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.update = async (request, response) => {
    try {
        await clientService.updateClient(request.body);
        let data = await clientService.getClients();
        response.render('client', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.delete = async (request, response) => {
    try {
        await clientService.deleteClient(+request.params.id);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.getById = async (request, response) => {
    try {
        let data = await clientService.getClientById(+request.params.id);
        response.json(data);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}