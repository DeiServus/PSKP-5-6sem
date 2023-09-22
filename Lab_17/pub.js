const redis = require('redis');

(async () => {
	const client = redis.createClient({url:'redis://localhost:6379'});

	client.on('error', err => {
		console.log('Error ' + err);
	});

	await client.connect();

	await client.publish('ch1', 'message_1');
	await client.publish('ch1', 'message_2');

	await client.disconnect();
})()