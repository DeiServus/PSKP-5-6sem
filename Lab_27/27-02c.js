const axios = require('axios');
const { ClientVerify } = require('./27-03m.js')
const fs = require('fs');

const options = {
    baseURL: 'http://localhost:3000',
    url: '/student',
    method: 'get',
    headers: {
        'Accept': 'application/json'
    }
};

axios(options)
    .then((response) => {
        const { data } = response;
        let cv = new ClientVerify(data);
        cv.verify(data, (result) => {
            fs.writeFileSync('27-02c.txt', data.test);
            console.log(result);
        })
    })
    .catch((error) => {
        console.error(error);
    });