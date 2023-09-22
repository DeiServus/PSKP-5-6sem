const WS = require('ws');
const fs = require('fs');
const socket = new WS('ws:/localhost:4000');

socket.on('open', ()=>{
    const duplex = WS.createWebSocketStream(socket);
    let file = fs.createWriteStream(`./new_file.txt`);
    duplex.pipe(file);
});