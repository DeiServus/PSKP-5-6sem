import { createClient } from 'webdav';
import express from 'express';
import fs from 'fs';

const client = createClient('https://webdav.yandex.ru', {
	username: 'huitebe',
	password: 'huitebe'
});

const app = express();
const PORT = 3000;

app.post('/md/:path', async (req, res) => {
	const path = '/' + req.params.path;
	try {
		if (await client.exists(path)) {
			res.status(408).send('Directory exists');
		} else {
			await client.createDirectory(path);
			res.status(200).send('Directory created');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/rd/:path', async (req, res) => {
	const path = '/' + req.params.path;
	try {
		if (await client.exists(path)) {
			await client.deleteFile(path);
			res.status(200).send('Directory removed');
		} else {
			res.status(404).send('Directory doesn\'t exist');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/up/:name', async (req, res) => {
	const file = req.params.name;
	try {
		if (await client.exists(file)) {
			await client.deleteFile(file);
		}

		const readStream = fs.createReadStream(file);
		if (await client.putFileContents(req.params.name, readStream)) {
			res.status(200).send('File uploaded');
		} else {
			res.status(408).send('File cannot be uploaded');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/down/:name', async (req, res) => {
	const file = '/' + req.params.name;
	try {
		if (await client.exists(file)) {
			const downloadFilePath = './' + file;
			const readStream = client.createReadStream(file);
			const writeStream = fs.createWriteStream(downloadFilePath);
			readStream.pipe(writeStream);
			res.status(200).send('File downloaded');
		} else {
			res.status(404).send('File doesn\'t exist');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/del/:name', async (req, res) => {
	const file = '/' + req.params.name;
	try {
		if (await client.exists(file)) {
			await client.deleteFile(file);
			res.status(200).send('File deleted');
		} else {
			res.status(404).send('File doesn\'t exist');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/copy/:source/:destination', async (req, res) => {
	const sourcePath = '/' + req.params.source;
	const destinationPath = '/' + req.params.destination;

	try {
		if (await client.exists(sourcePath)) {
			await client.copyFile(sourcePath, destinationPath);
			res.status(200).send('File copied');
		} else {
			res.status(404).send('File doesn\'t exist');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/move/:source/:destination', async (req, res) => {
	const sourcePath = '/' + req.params.source;
	const destinationPath = '/' + req.params.destination;

	try {
		if (await client.exists(sourcePath)) {
			await client.moveFile(sourcePath, destinationPath);
			res.status(200).send('File moved');
		} else {
			res.status(404).send('File doesn\'t exist');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});