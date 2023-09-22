const transportationService = require('../services/transportationService');

exports.get = async (request, response) => {
    try {
        let data = await transportationService.getTransportations();
        response.render('transportation', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.add = async (request, response) => {
    try {
        await transportationService.addTransportation(request.body);
        let data = await transportationService.getTransportations();
        response.render('transportation', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.update = async (request, response) => {
    try {
        await transportationService.updateTransportation(request.body);
        let data = await transportationService.getTransportations();
        response.render('transportation', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.delete = async (request, response) => {
    try {
        console.log('Controller');
        await transportationService.deleteTransportation(+request.params.id);
    } catch (error) {
        response.status(500).json({error: error.message});
    }
}

exports.getById = async (request, response) => {
    try {
        let data = await transportationService.getTransportationById(+request.params.id);
        response.json(data);
    } catch (error) {
        response.status(500).json({error: error.message});
    }
}