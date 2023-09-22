const express = require('express');
const transportationController = require('../controllers/transportationController');

const transportationRouter = express.Router();

transportationRouter.get('/', transportationController.get);
transportationRouter.post('/', transportationController.add);
transportationRouter.put('/', transportationController.update);
transportationRouter.delete('/:id', transportationController.delete);
transportationRouter.get('/:id', transportationController.getById);

module.exports = transportationRouter;