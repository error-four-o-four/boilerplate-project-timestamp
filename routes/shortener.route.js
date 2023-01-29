import dns from 'node:dns';
// import dnsPromise from 'node:dns/promises';
import bodyParser from 'body-parser';
import { Router } from 'express';

import { __dirname } from '../config.js';
import { addEntry, getUrl, getEntry } from '../controller/shortener.handler.js';

const dnsPromise = dns.promises;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const regexUrl = new RegExp(
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
);

const regexProtocol = new RegExp(/^https?/);

const urlInvalidResponse = { error: 'invalid url' };

const dnsLookupOptions = {
	family: 4,
	hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

const shortenerRoute = Router({ mergeParams: true });

shortenerRoute.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/shortener.html');
});

shortenerRoute.post('/api/shorturl', urlencodedParser, async function (req, res) {
	let { url } = req.body;

	if (!regexUrl.test(url)) {
		res.json(urlInvalidResponse);
		return;
	}

	if (regexProtocol.test(url)) {
		url = url
			.split('/')
			.splice(1)
			.filter((elt) => elt)
			.join('/');
	}

	try {
		await dnsPromise.lookup(url, dnsLookupOptions);
	} catch (error) {
		res.json(urlInvalidResponse);
		return;
	}

	const entry = await getEntry(url);

	if (entry !== null) {
		res.json(entry);
		return;
	}

	const newEntry = await addEntry(url);
	res.json(newEntry);
});

shortenerRoute.get('/api/shorturl/:short', async (req, res) => {
	try {
		const url = await getUrl(req.params.short);
		res.redirect(301, `http://${url}`);
	} catch (error) {
		res.json(error);
	}
});

export default shortenerRoute;
