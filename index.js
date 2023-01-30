import express from 'express';
import cors from 'cors';

import { __dirname, port } from './config.js';

import timestampRoute from './api-timestamp/routes.js';
import whoamiRoute from './api-whoami/routes.js';
import shortenerRoute from './api-shortener/routes.js';
import exerciseRoute from './api-exercise/routes.js';
import metadataRoute from './api-metadata/routes.js';


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
