const rds = require('redis');

const client = rds.createClient({url:'redis://localhost:6379'});

client.on('ready', ()=>{console.log('ready');});
client.on('error',err=>{console.log(err);});
client.on('connect',()=>{console.log('connect');});
client.on('end',()=>{console.log('end');});

(async()=>{
    await client.connect();

    let start = performance.now();
    for (let n = 0; n < 10000; n++) {
        await client.hSet(`${n}`, n.toString(), JSON.stringify({id: n, val :`val-${n}`}));
    }
    let finish = performance.now();
    console.log(finish-start);

    start = performance.now();
    for (let n = 0; n < 10000; n++) {
        await client.hGet(`${n}`, n.toString());
    }
    finish = performance.now();
    console.log(finish-start);
    
    await client.quit();
})()