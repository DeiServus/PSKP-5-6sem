const dbService = require('./DbService');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const { client } = require('./DbService');

exports.getFaculties = (req, res) => {
    dbService.getAllByTableName('faculty').then(records => res.end(JSON.stringify(records)))
        .catch(error => {
            HTTP400(req, res, { message: 'There is no such record!' });
        });
}

exports.getPulpits = (req, res) => {
    dbService.getAllByTableName('pulpit').then(records => res.end(JSON.stringify(records)))
        .catch(error => {
            HTTP400(req, res, { message: 'There is no such record!' });
        });
}

exports.getFaculty = (req, res, param) => {
    dbService.getFaculty(param).then(records => res.end(JSON.stringify(records)))
        .catch(error => {
            HTTP400(req, res, { message: 'There is no such record!' });
        });
}

exports.getPulpit = (req, res, param) => {
    dbService.getPulpit(param).then(records => res.end(JSON.stringify(records)))
        .catch(error => {
            HTTP400(req, res, { message: 'There is no such record!' });
        });
}

exports.getPulpitsByFaculty = (req, res, param) => {
    try
    {
        let result = '';
        let i = 1;
        param.forEach(async el => {
            await dbService.getPulpitByFaculty(el).then(records => {
                if (records.length === 0)
                    HTTP400(req, res, { message: 'incorrect param' });
                else{
                    result += JSON.stringify(records);
                    if (i === param.length)
                        res.end(result);
                    i++;
                }
            }).catch(error => {
                HTTP400(req, res, { message: 'There is no such record!' });
            });
        }
        );
    }catch(e){
        HTTP400(req, res, { message: e.message });
    }
}

exports.postPulpits = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        body = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        dbService.insertField('pulpit', body).then(record => res.end(JSON.stringify(record)))
            .catch(error => { HTTP400(req, res, { message: 'Record have already existed' }); });
    });
}

exports.postFaculties = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        body = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        dbService.insertField('faculty', body).then(record => res.end(JSON.stringify(record)))
            .catch(error => { HTTP400(req, res, { message: 'Record have already existed' }); });
    });
}

exports.putPulpits = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        body = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        dbService.updateField('pulpit', body).then(record => res.end(JSON.stringify(record)))
            .catch(error => { HTTP400(req, res, { message: 'There is no such record!' }); });
    });
}

exports.putFaculties = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        body = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        dbService.updateField('faculty', body).then(record => res.end(JSON.stringify(record)))
            .catch(error => { HTTP400(req, res, { message: 'There is no such record!' }); });
    });
}

exports.deletePulpit = (req, res, param) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    dbService.getPulpit(param).then(
    dbService.deleteField('pulpit', param).then(records => {
        res.end(JSON.stringify(records));
    })).
        catch(error => { HTTP400(req, res, { message: 'There is no such record!' }) });
}

exports.deleteFaculty = (req, res, param) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    dbService.getFaculty(param).then(record=>{
    if(record!=undefined){
    dbService.deleteField('faculty', param).then(records => {
        res.end(JSON.stringify(records));
    })}
    else HTTP400(req, res, { message: 'There is no such record!' })}).
        catch(error => { HTTP400(req, res, { message: 'There is no such record!' }) });
}

exports.transaction = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        body = JSON.parse(body);
        console.log(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const connStr = 'mongodb+srv://admin:admin@cluster0.dkmge1d.mongodb.net/BSTU';
        const client = new MongoClient(connStr);
        let session;
        (async () => {
            await client.connect();
            const transactionOptions = {
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            }
            session = client.startSession();
            session.startTransaction(transactionOptions);
            const collection = client.db().collection('pulpit');
            for (let i = 0; i < body.length; i++) {
                const el = body[i];
                const checkpulp = await collection.findOne({pulpit: el.pulpit});
                if (checkpulp) throw new Error("ошибка!");
                console.log(el);
                await collection.insertOne(el, { session });
            }
            await session.commitTransaction();
            await session.endSession();
        })().catch(async(error)=>{
                console.log(error.message);
                await session.abortTransaction();
            }).finally(async () => { await client.close(); });
        res.end('transaction is done');
    });
}

let HTTP400 = (req, res, error) => {
    let message = `[${req.method}] Bad Request [400]`;
    let errInfo = {
        error: `Bad Request [400] - ${error.message}`,
        method: req.method,
        url: decodeURI(req.url)
    }
    console.log(message);
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}