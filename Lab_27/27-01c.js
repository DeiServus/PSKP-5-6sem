const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const { ClientDH } = require('./27-01m.js');

(async () => {
	try {
		let res = await axios.get('http://localhost:3000/');

		const clientDH = new ClientDH(res.data)
		const clientContext = null;
		const secret = clientDH.getSecret(res.data);

		res = await axios.post('http://localhost:3000/resource', {clientContext  });
		const text = res.data;
		console.log(res.data);
		const decipher = crypto.createDecipher('aes256', secret.toString());
		const decrypted = decipher.update(text, 'hex', 'utf-8') + decipher.final('utf-8');
		fs.writeFileSync('27-01c.txt', decrypted);
		console.log('Wrote to 27-01c.txt');
	} catch (err) {
		console.error(err);
	}
})();