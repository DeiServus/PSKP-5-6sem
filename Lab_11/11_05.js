const rpc = require('rpc-websockets').Server;

let rpc_obj = new rpc({ port: 4000, host: 'localhost' });

rpc_obj.setAuth(credentials => credentials.login === 'admin' && credentials.password === 'admin');

rpc_obj.register('sum', sum).public();
rpc_obj.register('mul', mul).public();
rpc_obj.register('square', square).public()
rpc_obj.register('fib', fib).protected();
rpc_obj.register('fact', fact).protected();

function square() {
    if (arguments[0].length == 2) {
        return arguments[0][0] * arguments[0][1];
    }
    else
        return Math.PI * Math.pow(arguments[0][0], 2);
}

function sum() {
    let sum = 0;
    for (let i = 0; i < arguments[0].length; i++) {
        sum += parseInt(arguments[0][i]);
    }
    return sum;
}
function mul() {
    let mul = 1;
    for (var i = 0; i < arguments[0].length; i++) {
        mul *= parseInt(arguments[0][i]);
    }
    return mul;
}
function fib(n) {
    let currentSize = 0;
    let numbers = [];
    let cur = 0;
    let next = 1;
    while (currentSize < n) {
        numbers.push(cur + next);
        next += cur;
        cur = next - cur;
        currentSize++;
    }
    return numbers;
}

function fact(n) { return (Number(n) == 0 ? 1 : n * fact(n - 1)); }