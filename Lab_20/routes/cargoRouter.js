const express = require('express');
const cargoController = require('../controllers/cargoController');

const cargoRouter = express.Router();

cargoRouter.get('/', cargoController.get);
cargoRouter.post('/', cargoController.add);
cargoRouter.put('/', cargoController.update);
cargoRouter.delete('/:id', cargoController.delete);
cargoRouter.get('/:id', cargoController.getById);

module.exports = cargoRouter;