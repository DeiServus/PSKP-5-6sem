const udp = require('dgram');
const PORT = 4000;

let server = udp.createSocket('udp4');


server.on('message', (msg, info) => {
    console.log(`Server: от клиента получено ${msg.toString()} (${msg.length} байт)`);
    server.send(`ECHO: ${msg}`, info.port, info.address, err => {
        if (err) {server.close();}
        else console.log('Server: данные отправляем клиенту');
    });
})

server.on('listening', () => {
    console.log(`Server: слушает порт `  + server.address().port);
    console.log(`Server: ip сервера `  + server.address().address);
    console.log(`Server: семейство(IP4/IP6) `  + server.address().family);
});

server.on('error', error => {
    console.log('Ошибка ' + error);
    server.close();
});

server.on('close', () => { console.log('Server: сокет закрыт'); });

server.bind(PORT);