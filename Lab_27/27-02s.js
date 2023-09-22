const express = require('express');
const fs = require('fs');
const { ServerSign } = require('./27-03m.js')

const app = express();
const PORT = 3000;

const rs = fs.readFileSync('./27-01s.txt', 'utf8');

app.get('/student', (req, res) => {
    if (req.headers['accept'] !== 'application/json') {
        res.status(409).send('Invalid request');
        return;
    }

    let ss = new ServerSign();
    ss.getSignContext(rs, (signcontext) => {
        res.json(signcontext);
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});