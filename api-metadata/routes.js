import busboy from 'busboy';
import { Router } from 'express';

import { __dirname } from '../config.js';

const route = Router({ mergeParams: true });

route.get('/', (_, res) => {
	res.sendFile(__dirname + '/api-metadata/index.html');
});

route.post('/api/fileanalyse', async (req, res) => {
	const meta = {};
	const bb = busboy({ headers: req.headers });

	bb.on('file', (name, file, info) => {
		meta.name = info.filename;
		meta.type = info.mimeType;

		file.on('data', (data) => {
			meta.size = data.length;
		});
	});

	bb.on('close', () => {
		res.json(meta);
	});

	req.pipe(bb);
});

export default route;
