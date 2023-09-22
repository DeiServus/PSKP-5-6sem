const rds = require('redis');

const client = rds.createClient({url:'redis://localhost:6379'});

client.on('ready', ()=>{
    console.log('ready');
});
client.on('error',err=>{
    console.log(err);
});
client.on('connect',()=>{
    console.log('connect');
});
client.on('end',()=>{
    console.log('end');
});

(async ()=>{
    await client.connect();
    await client.set('i', 0);
    let start = performance.now();
    for (let index = 0; index < 10000; index++) {
        await client.incr('i');
    }
    let finish = performance.now();
    console.log(finish-start);
    start = performance.now();
    for (let index = 0; index < 10000; index++) {
        await client.decr(`i`);
    }
    finish = performance.now();
    console.log(finish-start);
    await client.quit();
})()