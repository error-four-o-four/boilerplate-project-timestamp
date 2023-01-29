import bodyParser from 'body-parser';
import { Router } from 'express';

import { __dirname } from '../config.js';

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const metadataRoute = Router({ mergeParams: true });

metadataRoute.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/metadata.html');
});

metadataRoute.post('/api/fileanalyse', urlencodedParser, async (req, res) => {
	const data = JSON.parse(req.body.data);
	res.json(data);
});

export default metadataRoute;
