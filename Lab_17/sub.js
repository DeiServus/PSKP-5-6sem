const redis = require('redis');

	const client = redis.createClient({url:'redis://localhost:6379'});

(async () => {

	client.on('error', err => {
		console.log('Error ' + err);
	});
	await client.connect();
	await client.subscribe('ch1', (message, channel) => {
		console.log(`Сообщение ${message} от ${channel}`);
	});

	setTimeout(async()=>{await client.disconnect()}, 10000);
})()