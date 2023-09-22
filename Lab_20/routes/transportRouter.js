const express = require('express');
const transportController = require('../controllers/transportController');

const transportRouter = express.Router();

transportRouter.get('/', transportController.get);
transportRouter.post('/', transportController.add);
transportRouter.put('/', transportController.update);
transportRouter.delete('/:id', transportController.delete);
transportRouter.get('/:id', transportController.getById);

module.exports = transportRouter;