const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
app.use(express.json());
const swaggerFile = fs.readFileSync('./swagger.json', 'utf8');
const swaggerDocument = JSON.parse(swaggerFile);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const phonebookFile = './phonebook.json';

function readPhonebook() {
    try {
        const data = fs.readFileSync(phonebookFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read phonebook:', error);
        return [];
    }
}

function writePhonebook(phonebook) {
    try {
        const data = JSON.stringify(phonebook);
        fs.writeFileSync(phonebookFile, data, 'utf-8');
    } catch (error) {
        console.error('Failed to write phonebook:', error);
    }
}

app.get('/TS', (req, res) => {
    const phonebook = readPhonebook();
    res.json(phonebook);
});

app.post('/TS', (req, res) => {
    const { id, name, phoneNumber } = req.body;
    const newPhone = { id, name, phoneNumber };
    const phonebook = readPhonebook();
    phonebook.push(newPhone);
    writePhonebook(phonebook);
    res.sendStatus(201);
});

app.put('/TS', (req, res) => {
    const { id, name, phoneNumber } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    } else {
        phonebook[phoneIndex] = { id, name, phoneNumber };
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});

app.delete('/TS', (req, res) => {
    const { id } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    } else {
        phonebook.splice(phoneIndex, 1);
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/api-docs');
});
