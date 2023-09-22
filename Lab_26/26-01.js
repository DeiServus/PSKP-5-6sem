const https = require('https');
const fs = require('fs')

const options = {
	key: fs.readFileSync('LAB.key').toString(),
	cert: fs.readFileSync('LAB.crt').toString()
}

https.createServer(options, (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end('<h1>Hello from HTTPS</h1>');
}).listen(3000, () => {
	console.log('Server started at https://ria:3000');
});