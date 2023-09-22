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

client.connect().
then(()=>{client.quit();}).
catch(err=>{console.log(err)});