const express = require('express');
const contactService= require('../controllers/contacts.js');

module.exports = () => {
    let router = express.Router();
    
    router.get('/', contactService.getIndex);
    router.get('/add', contactService.getAdd);
    router.post('/add', contactService.postAdd);
    router.get('/update', contactService.getUpdate);
    router.post('/update', contactService.postUpdate);
    router.post('/delete', contactService.postDelete);

    return router;
}