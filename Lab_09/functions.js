const url = require('url');
const fs = require('fs');
const { parse } = require("querystring");
const mp = require('multiparty');
const { parseString } = require("xml2js");
const xmlbuilder = require('xmlbuilder');

function ServerModule(server){

    this.server = server;
this.informationFunc = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('Excercise 1');
}

this.parameterFunc = (req, res) => {
    if (typeof url.parse(req.url, true).query.x != 'undefined' && typeof url.parse(req.url, true).query.y != 'undefined') {
        let x = parseInt(url.parse(req.url, true).query.x);
        let y = parseInt(url.parse(req.url, true).query.y);
        if (Number.isInteger(x) && Number.isInteger(y)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(` ${x} + ${y} = ${x + y}\n`);
            res.end();
        }
        else {
            throw new Error('not a number');
        }
    }
    else {
        throw new Error('set the parameters');
    }
}

this.postParameters = (req, res) => {
    let buf = '';
    req.on('data', chunk => { buf += chunk.toString(); });
    req.on('end', () => {
        let body = parse(buf);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end((body.x +', '+ body.y +', '+ body.s).toString());
    });
}

this.postJsonParameters = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    let data = '';

    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => {
        data = JSON.parse(data);
        let result = {};
        result.__comment = 'Ответ. Лабораторная работа 8/10';
        result.x_plus_y = data.x + data.y;
        result.concatination_s_and_o = `${data.s}: ${data.o.name} ${data.o.surname}`;
        result.length_m = data.m.length;
        res.end(JSON.stringify(result, null, 2));
    })
}

this.xmlFunc = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
    let xmlString = '';

    req.on('data', data => { xmlString += data.toString(); });
    req.on('end', () => {
        parseString(xmlString, (err, result) => {
            if (err) {
                res.end(`<result>parseString returned error: ${err}</result>`);
                return;
            }
            let sum = 0;
            let mess = '';
            result.request.x.forEach(el => { sum += Number.parseInt(el.$.value); })
            result.request.m.forEach(el => { mess += el.$.value; })

            let xmlDoc = xmlbuilder.create('response')
                .att('id', +result.request.$.id + 10)
                .att('request', result.request.$.id);
            xmlDoc.ele('sum', { element: 'x', sum: `${sum}` });
            xmlDoc.ele('concat', { element: 'm', result: `${mess}` });
            rc = xmlDoc.toString({ pretty: true });

            res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
            res.end(xmlDoc.toString({ pretty: true }));
        });
    })
}


this.uploadPOST = (req, res) => {
    let form = new mp.Form({ uploadDir: './static' });
    form.on('file', (name, file) => {
        res.writeHead(200, { 'Content-Type': 'text/html;  charset="UTF-8"' });
        res.end(`Файл =${file.originalFilename} сохранен в  ${file.path}`);
    });
    form.on('error', (err) => { res.end('Error') });
    form.parse(req);
}

this.readFromFile = (req, res) => {
    console.log(`Запрошенный адрес: ${req.url}`);
    const filePath = req.url.split('/')[2];
    console.log(filePath);
    fs.access(filePath, fs.constants.R_OK, err => {
        if (err) {
            res.statusCode = 404;
            res.end("Resourse not found!");
        }
        else {
            fs.createReadStream(filePath).pipe(res);
        }
    });
}

}
module.exports = server => new ServerModule(server);