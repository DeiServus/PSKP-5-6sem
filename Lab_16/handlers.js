const { graphql, buildSchema } = require('graphql');

const { HTTP404, HTTP405, HTTP400 } = require('./errors');

const schema = buildSchema(require('fs').readFileSync('./schema.gql').toString());
const { DB } = require('./DbService');
const resolver = require('./resolver');

const db = DB((err) => {
    if (err) {
        console.log(err);
    }
});

exports.http_handler = (req, res) => {
    switch (req.method) {
        case 'POST': post_handler(req, res); break;
        default: HTTP405(req, res);
    }
}

const post_handler = (req, res) => {
    let result = '';
    req.on('data', (data) => { result += data; });
    req.on('end', () => {
        const obj = JSON.parse(result);
        obj.query
            ? graphql(schema, obj.query, resolver, db, obj.variables ? obj.variables : {})
                .then((body) => {
                    res.writeHead(200, { "Content-type": "application/json; charset=utf-8", });
                    res.end(JSON.stringify(body));
                })
                .catch((err) => { HTTP400(req, res, err); })
            : graphql(schema, obj.mutation, resolver, context, obj.variables ? obj.variables : {})
                .then((body) => {
                    res.writeHead(200, { "Content-type": "application/json; charset=utf-8", });
                    res.end(JSON.stringify(body));
                })
                .catch((err) => {
                    if(err.message=='Everything is fine'){
                        res.writeHead(200, { "Content-type": "application/json; charset=utf-8", });
                        res.end('Everything is fine');
                    } else
                    HTTP400(req, res, err); })
    });
}


