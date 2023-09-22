const udp = require('dgram');
const HOST = 'localhost';
const PORT = 4000;
let client = udp.createSocket('udp4');
let message = 'message from client';

client.on('message', msg => {
    console.log(`Client: от сервера получено ${msg.toString()} (${msg.length} байт)`);
    client.close();
});

client.send(message, PORT, HOST, error => {
    if (error) {
        console.log('Ошибка ' + error.message);
        client.close();
    }
    else
        console.log('Client: Сообщению отправлено серверу');
});

client.on('error', error => {
    console.log('Ошибка ' + error.message);
    client.close();
});

client.on('close', () => { console.log('Closed'); });