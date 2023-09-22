const transportService = require('../services/transportService');

exports.get = async (request, response) => {
    try {
        let data = await transportService.getTransports();
        response.render('transport', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.add = async (request, response) => {
    try {
        console.log('controller')
        await transportService.addTransport(request.body);
        let data = await clientService.getTransports();
        response.render('transport', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.update = async (request, response) => {
    try {
        await transportService.updateTransport(request.body);
        let data = await transportService.getTransports();
        response.render('transport', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.delete = async (request, response) => {
    try {
        await transportService.deleteTransport(+request.params.id);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.getById = async (request, response) => {
    try {
        let data = await transportService.getTransportById(+request.params.id);
        response.json(data);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}