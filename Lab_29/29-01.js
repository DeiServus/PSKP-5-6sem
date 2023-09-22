const JsonRPCSever = require('jsonrpc-server-http-nats');
const server = new JsonRPCSever();

const bin_validator = (params) => {
    console.log('validation', params);
    if (Array.isArray(params)) {
        if (params.length !== 2) throw new Error('Params must contain 2 values');
        if (!(typeof params[0] === 'number' && typeof params[1] === 'number')) {
            throw new Error('Params must contain only numbers');
        }
        if (params[1] === 0) {
            throw new Error('Can\'t divide by zero');
        }
        return {x: params[0], y: params[1]};
    }
    if (!(Object.hasOwn(params, 'x') && Object.hasOwn(params, 'y'))) {
        throw new Error('Params must contain property x and y');
    }
    if (!(typeof params.x === 'number' && typeof params.y === 'number')) {
        throw new Error('Params must contain only numbers');
    }
    if (params.y === 0) {
        throw new Error('Can\'t divide by zero');
    }
    return params;
}

const bin_variable_validator = (params) => {
    if (!Array.isArray(params)) {
        throw new Error('Params must be an array');
    }
    if (params.length === 0) {
        throw new Error('Params must contain at least one number');
    }
    if (!params.every(element => {
        return typeof element === 'number';
    })) {
        throw new Error('Params must contain only numbers');
    }
    return params;
}


server.on('div', bin_validator, (params, channel, resp) => { resp(null, params.x / params.y); });
server.on('proc', bin_validator, (params, channel, resp) => { resp(null, params.x / params.y * 100); });
server.on('sum', bin_variable_validator, (params, channel, resp) => { resp(null, params.reduce((acc, curr) => acc + curr, 0)); });
server.on('mul', bin_variable_validator, (params, channel, resp) => { resp(null, params.reduce((acc, curr) => acc * curr, 1)); });

server.listenHttp({ host: '127.0.0.1', port: 3000 }, () => { console.log('Server listening on http://localhost:3000') });