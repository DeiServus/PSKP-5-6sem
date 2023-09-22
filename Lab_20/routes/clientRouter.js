const express = require('express');
const clientController = require('../controllers/clientController');

const clientRouter = express.Router();

clientRouter.get('/', clientController.get);
clientRouter.post('/', clientController.add);
clientRouter.put('/', clientController.update);
clientRouter.delete('/:id', clientController.delete);
clientRouter.get('/:id', clientController.getById);

module.exports = clientRouter;