const url = require('url');
const fs = require('fs');
const xmlBuilder = require('xmlbuilder');
const multiParty = require('multiparty');
const { parse } = require('querystring');
const parseString = require('xml2js').parseString;

function StaticHandler(server, sockets) {
    this.server = server;
    this.sockets = sockets;
    const regexNumber = new RegExp('^[0-9]+$');

    this.handleMain = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Список запросов: </h1>'+'<h2>' +
            '1)connection <br/>' + '2)connection?set=set <br/>' +
            '3)headers <br/> ' + '4)parameter?x=x&y=y<br/>' +
            '5)parameter/x/y <br/>' + '6)close <br/>' + '7)socket <br/>' +
            '8)req-data <br/>' + '9)resp-status?code=c&mess=m <br/>' +
            '10)upload <br/>' + '11)formparameter <br/>' + '12)json <br/>' +
            '13)xml <br/>' + '14)files <br/>' +
            '</h2>');
    }

    this.handleConnection = (req, res) => {
        let setParameter = url.parse(req.url, true).query.set;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (!setParameter)
            res.end(`<h1>KeepAliveTimeout = ${this.server.keepAliveTimeout}</h1>`);
        else if (regexNumber.test(setParameter)) {
            this.server.keepAliveTimeout = +url.parse(req.url, true).query.set;
            res.end(`<h1>Установлено новое значение параметра KeepAliveTimeout = ${this.server.keepAliveTimeout}</h1>`);
        } else res.end(`<h1>WARNING! Неверный формат keepAliveTimeout.</h1>`);
    }

    this.handleHeaders = (req, res) => {
        res.setHeader('MyHeader', 'HeaderValue');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h1>Заголовки запроса:</h1>');
        for (key in req.headers) {
            res.write(`${key}: ${req.headers[key]}<br/>`);
        }
        res.write('<br/><h1>Заголовки ответа:</h1>');
        let resHeaders = res.getHeaders();
        for (key in resHeaders) {
            res.write(`${key}: ${resHeaders[key]}<br/>`);
        }
        res.end();
    }

    this.handleParameter = (req, res) => {
        let x1 = url.parse(req.url, true).query.x;
        let y1 = url.parse(req.url, true).query.y;
        let x2 = url.parse(req.url).pathname.split('/')[2];
        let y2 = url.parse(req.url).pathname.split('/')[3];
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (regexNumber.test(x1) && regexNumber.test(y1)) {
            res.end(`<h1>
                        x = ${x1}; y = ${y1} <br/>
                        sum  => ${+x1 + +y1} <br/>
                        sub  => ${x1 - y1} <br/>
                        mult => ${x1 * y1} <br/>
                        div  => ${x1 / y1}
                    </h1>`);
        }
        else if (x2 != 'undefined' && y2 != 'undefined') {
            if (regexNumber.test(x2) && regexNumber.test(y2)) {
                res.end(`<h1>
                        x = ${x2}; y = ${y2} <br/>
                        sum  => ${+x2 + +y2} <br/>
                        sub  => ${x2 - y2} <br/>
                        mult => ${x2 * y2} <br/>
                        div  => ${x2 / y2}
                    </h1>`);
            }
            else {
                res.end(`<h1>WARNING! Ошибка с параметрами</h1>`);
            }
        } else res.end(`<h1>WARNING! Ошибка с параметрами</h1>`);
    }

    this.handleClose = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        setTimeout(() => {
            for (const socket of this.sockets.values()) {
                socket.destroy();
            }
            this.server.close();
        }, 10000);
        res.end('<h1>Прощай через 10 секунд.</h1>');
    }

    this.handleSocket = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>
                    Client socket info: ${res.socket.remotePort}, ${res.socket.remoteAddress} <br/>
                    Server socket info: ${res.socket.localPort}, ${res.socket.localAddress} <br/>
                </h1>`);
    }

    this.handleReqData = (req, res) => {
        let buf = '';
        let i = 0;
        res.setHeader('Transfer-Encoding', 'Chunked');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        req.on('data', (data) => {
            res.write(`<h3>Порция №${++i}. => ${data.length}</h3>`);
            buf += data;
        });
        req.on('end', () => {
            res.write(`<h3>Полный объем => ${buf.length}</h3>`);
            res.end();
        });
    }

    this.handleRespStatus = (req, res) => {
        let statusCode = url.parse(req.url, true).query.code;
        let statusMessage = url.parse(req.url, true).query.mess;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (statusCode === undefined || statusMessage === undefined || statusMessage=="") {
            res.end('<h1>WARNING! Где параметры?!</h1>')
        }
        else if(statusCode<99 || statusCode>599){
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>WARNING! Диапозон</h1>')
        }
        else if (regexNumber.test(statusCode)) {
            res.writeHead(statusCode, statusMessage, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h1>StatusCode ${statusCode}: ${statusMessage}</h1>`);
        }
        else {
            res.end(`<h1>WARNING! Ошибка с параметрами</h1>`);
        }
    }

    this.handleFormParameter = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile("index.html", (err, data) => {
                if (err) {
                    res.writeHead(400, {});
                    res.end("Ошибка при чтении");
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(data);
            });
        }
        else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                let parm = parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(parm));
            });
        }
        else {
            res.writeHead(408, 'Неподходящий метод', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Неподходящий метод</h1>');
        }
    }

    /*{
        "_comment": " Запрос.Лабораторная работа 8/10",
        "x": 1,
        "y": 2,
        "s": "Сообщение",
        "m":["a","b","c","d"],
        "o":{"surname":"Иванов", "name":"Иван"}
    }*/
    this.handleJson = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        let data = '';
        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => {
            data = JSON.parse(data);
            let result = {};
            result._comment = "Ответ.Лабораторная работа 8/10";
            result.x_plus_y = data.x + data.y;
            result.concatination_s_and_o = `${data.s}: ${data.o.name} ${data.o.surname}`;
            result.length_m = data.m.length;
            res.end(JSON.stringify(result));
        })
    }

    /*<request id = "28">
    <x value = "1"/>
    <x value = "2"/>
    <m value = "a"/>
    <m value = "b"/>
    <m value = "c"/>
    </request>*/
    this.handleXml = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        let xmlString = '';
        req.on('data', data => { xmlString += data.toString(); });
        req.on('end', () => {
            parseString(xmlString, (err, result) => {
                if (err) {
                    res.end(`<result>WARNING! parseString вернул ошибку: ${err}</result>`);
                    return;
                }
                let sum = 0;
                let mess = '';
                result.request.x.forEach(el => { sum += Number.parseInt(el.$.value); })
                result.request.m.forEach(el => { mess += el.$.value; })
                let xmlDoc = xmlBuilder.create('response')
                    .att('id', +result.request.$.id + 10)
                    .att('request', result.request.$.id);
                xmlDoc.ele('sum', { element: 'x', result: `${sum}` });
                xmlDoc.ele('concat', { element: 'm', result: `${mess}` });
                res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
                res.end(xmlDoc.toString({ pretty: true }));
            });
        })
    }

    this.handleUpload = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (req.method === 'GET') {
            res.end(fs.readFileSync('C:/Users/Ильюха/Desktop/3 курс/NODEJS/Lab_08/upload.html'))
        }
        else if (req.method === 'POST') {
            let form = new multiParty.Form({ uploadDir: './static' });
            form.on('file', () => {
                console.log("Все ок")
            });
            form.on('error', err => { res.end(`<h1>WARNING! Ошибка в form. Error: ${err}</h1>`) });
            form.on('close', () => {
                res.end('<h1>Файл загружен.</h1>');
            });
            form.parse(req);
        }
        else {
            res.writeHead(408, 'Неподходящий метод', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>WARNING! Неподходящий метод.</h1>');
        }
    }

    this.handleFiles = (req, res) => {
        let filename = url.parse(req.url).pathname.split('/')[2];
        if (filename === undefined) {
            fs.readdir('./static', (err, files) => {
                if (err) {
                    res.end('<h1>WARNING! Не удалось найти ./static<h1>');
                    return;
                }
                res.setHeader('X-static-files-count', `${files.length}`);
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>Количество файлов в папке static: ${files.length}.`);
            });
        }
        else {
            try {
                res.end(fs.readFileSync(`static/${filename}`));
            }
            catch (err) {
                res.writeHead(404, 'Resource not found', { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>WARNING! Resource not found.</h1>')
            }
        }
    }
    this.handleIncorrectURL = (req, res) => {
        res.writeHead(410, 'Incorrect URL', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>WARNING! Enter one of the correct URLs.</h1>')
    }
    this.handleIncorrectMethod = (req, res) => {
        res.writeHead(409, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>WARNING! Incorrect request method.</h1>')
    }
}


module.exports = (server, sockets) => {return new StaticHandler(server, sockets)};