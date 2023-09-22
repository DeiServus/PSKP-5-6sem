const cargoService = require('../services/cargoService');

exports.get = async (request, response) => {
    try {
        let data = await cargoService.getCargoes();
        response.render('cargo', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }
}

exports.add = async (request, response) => {
    try {
        await cargoService.addCargo(request.body);
        let data = await cargoService.getCargoes();
        response.render('cargo', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.update = async (request, response) => {
    try {
        await cargoService.updateCargo(request.body);
        let data = await cargoService.getCargoes();
        response.render('cargo', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.delete = async (request, response) => {
    try {
        await cargoService.deleteCargo(+request.params.id);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.getById = async (request, response) => {
    try {
        let data = await cargoService.getCargoById(+request.params.id);
        response.json(data);
    } catch (error) {
        response.status(500).json({error: error.message});
    }
}