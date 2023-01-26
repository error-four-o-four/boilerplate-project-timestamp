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

app.get('/api/:timestamp', function (req, res) {
	const date = new Date(req.params.timestamp);
	const isDate = date instanceof Date && !isNaN(date.valueOf());

	if (!isDate) {
		res.json({ unix: null, utc: null });
		return;
	}

	res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

app.get('*', function (req, res) {
	res.send('Oh no! Nothing found');
});

const listener = app.listen(5173, function () {
	console.log(`Listening: http://localhost:${listener.address().port}`);
	// console.log('Your app is listening on port ' + listener.address().port);
});
