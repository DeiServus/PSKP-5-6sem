const rpcC = require('rpc-websockets').Client;

const rpc = new rpcC('ws://localhost:4000');

rpc.on('open', () =>
{
    rpc.call('square', [3]).then(answer => console.log('square(3): ' + answer));
    rpc.call('square', [5, 4]).then(answer => console.log('square(5,4): ' + answer));
    rpc.call('sum', [2]).then(answer => console.log('sum(2): ' + answer));
    rpc.call('sum', [2, 4, 6, 8, 10]).then(answer => console.log('sum(2, 4, 6, 8, 10): ' + answer));
    rpc.call('mul', [3]).then(answer => console.log('mul(3): ' + answer));
    rpc.call('mul', [3, 5, 7, 9, 11, 13]).then(answer => console.log('mul(3, 5, 7, 9, 11, 13): ' + answer));
    rpc.login({login: 'admin1', password: 'adming'})
        .then(login => {
            if (login) {
                rpc.call('fib', 1).then(answer => console.log('fib(1): ' + answer));
                rpc.call('fib', 2).then(answer => console.log('fib(2): ' + answer));
                rpc.call('fib', 7).then(answer => console.log('fib(7): ' + answer));
                rpc.call('fact', 0).then(answer => console.log('fact(0): ' + answer));
                rpc.call('fact', 5).then(answer => console.log('fact(5): ' + answer));
                rpc.call('fact', 10).then(answer => console.log('fact(10): ' + answer));
            }
            else console.error('Unauthorized');
        }).then('error',(err)=>console.error('Error with auth'));
}).on('error', (err)=>{
    console.error('err');
});