const driverService = require('../services/driverService');

exports.get = async (request, response) => {
    try {
        let data = await driverService.getDrivers();
        response.render('driver', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.add = async (request, response) => {
    try {
        await driverService.addDriver(request.body);
        let data = await driverService.getDrivers();
        response.render('driver', {
            data
        });
        
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.update = async (request, response) => {
    try {
        await driverService.updateDriver(request.body);
        let data = await driverService.getDrivers();
        response.render('driver', {
            data
        });
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.delete = async (request, response) => {
    try {
        await driverService.deleteDriver(+request.params.id);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}

exports.getById = async (request, response) => {
    try {
        let data = await driverService.getDriverById(+request.params.id);
        response.json(data);
    } catch (error) {
        response.status(500).json({error: error.message});
    }

}