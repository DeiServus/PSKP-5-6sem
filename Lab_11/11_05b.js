const rpcC = require('rpc-websockets').Client;
const async = require('async');

const rpc = new rpcC('ws://localhost:4000');
rpc.on('open', () => 
{ 
    async.parallel(
        {
            squery1: ()=>{rpc.call('square', [3]).then(answer => console.log('square(3): ' + answer));},
            squery2: ()=>{rpc.call('square', [5, 4]).then(answer => console.log('square(5,4): ' + answer));},
            sum: ()=>{rpc.call('sum', [2]).then(answer => console.log('sum(2): ' + answer));},
            sum2: ()=>{rpc.call('sum', [2, 4, 6, 8, 10]).then(answer => console.log('sum(2, 4, 6, 8, 10): ' + answer));},
            mul1: ()=>{rpc.call('mul', [3]).then(answer => console.log('mul(3): ' + answer));},
            mul2: ()=>{rpc.call('mul', [3, 5, 7, 9, 11, 13]).then(answer => console.log('mul(3, 5, 7, 9, 11, 13): ' + answer));},
            fib1: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then(login =>
                {   
                    if (login) {
                        rpc.call('fib', 1).then(answer => console.log('fib(1): ' + answer));}
                    else console.log('Unauthorized');
                });},
            fib2: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then( login =>
                {   if (login) {
                    rpc.call('fib', 2).then(answer => console.log('fib(2): ' + answer));}
                else console.log('Unauthorized');
                });},
            fib3: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then( login =>
                {   if (login) {
                    rpc.call('fib', 7).then(answer => console.log('fib(7): ' + answer));}
                else console.log('Unauthorized');
                });},
            fact1: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then( login =>
                {   if (login) {
                    rpc.call('fact', 0).then(answer => console.log('fact(0): ' + answer));}
                else console.log('Unauthorized');
                });},
            fact2: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then( login =>
                {   if (login) {
                    rpc.call('fact', 5).then(answer => console.log('fact(5): ' + answer));}
                else console.log('Unauthorized');
                });},
            fact3: ()=>{rpc.login({login: 'admin', password: 'admin'})
                .then( login =>
                {   if (login) {
                    rpc.call('fact', 10).then(answer => console.log('fact(10): ' + answer));}
                else console.log('Unauthorized');
                });},
        });
});