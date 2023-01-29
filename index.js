import express from 'express';
import cors from 'cors';

import { __dirname, port } from './config.js';

import timestampRoute from './routes/timestamp.route.js';
import whoamiRoute from './routes/whoami.route.js';
import shortenerRoute from './routes/shortener.route.js';
import exerciseRoute from './routes/exercise.route.js';
import metadataRoute from './routes/metadata.route.js';

const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.use('/timestamp', timestampRoute);
app.use('/whoami', whoamiRoute);
app.use('/shortener', shortenerRoute);
app.use('/exercise', exerciseRoute);
app.use('/metadata', metadataRoute);

app.get('*', function (req, res) {
	res.send('Oh no! Nothing found');
});

const listener = app.listen(port, function () {
	console.log(`Listening: http://localhost:${listener.address().port}`);
});
