import express from 'express';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/', function (req, res) {
	const date = new Date();
	res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

app.get('/api/:timestamp', function (req, res) {
	const { timestamp } = req.params;

	if (/^\d*$/.test(timestamp) && timestamp.length === 13) {
		const date = new Date(parseInt(timestamp));
		res.json({ unix: date.valueOf(), utc: date.toUTCString() });
		return;
	}

	const date = new Date(timestamp);
	if (date instanceof Date && !isNaN(date.valueOf())) {
		res.json({ unix: date.valueOf(), utc: date.toUTCString() });
		return;
	}

	res.json({ error: 'Invalid Date' });
});

app.get('*', function (req, res) {
	res.send('Oh no! Nothing found');
});

const port = process.env.PORT || 5173;

const listener = app.listen(port, function () {
	console.log(`Listening: http://localhost:${listener.address().port}`);
});
