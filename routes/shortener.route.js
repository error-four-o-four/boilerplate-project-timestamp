import bodyParser from 'body-parser';
import { Router } from 'express';

import { __dirname } from '../config.js';
import { validateUrl, lookupDns } from '../middleware/shortener.middleware.js';
import controller from '../controller/shortener.controller.js';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const route = Router({ mergeParams: true });

route.get('/', (_, res) => {
	res.sendFile(__dirname + '/views/shortener.html');
});

route.use('/api/shorturl', urlencodedParser);

route.post('/api/shorturl', validateUrl, controller.post);

route.get('/api/shorturl/:short', controller.get);

export default route;
