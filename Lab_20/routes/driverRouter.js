const express = require('express');
const driverController = require('../controllers/driverController');

const driverRouter = express.Router();

driverRouter.get('/', driverController.get);
driverRouter.post('/', driverController.add);
driverRouter.put('/', driverController.update);
driverRouter.delete('/:id', driverController.delete);
driverRouter.get('/:id', driverController.getById);

module.exports = driverRouter;