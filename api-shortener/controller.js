import handler from './db/handler.js';

import { hasProtocol, lookupDns } from './middleware.js';

const validResponse = (referer, entry) => ({
	...entry,
	url: referer + `api/shorturl/${entry.short_url}`,
});

const post = async (req, res) => {
	const { referer } = req.headers;
	const { url } = req.body;

	const entry = await handler.getEntry(url);

	if (entry !== null) {
		console.log(`Found ${url} in database.\n`);
		res.json(validResponse(referer, entry));
		return;
	}

	// const lookup = await lookupDns(url);

	// if (lookup.error) {
	// 	res.json(lookup);
	// 	return;
	// }

	const newEntry = await handler.addEntry(url);
	res.json(validResponse(referer, newEntry));
};

const get = async (req, res) => {
	const { short } = req.params;

	try {
		const url = await handler.getUrl(short);

		if (url === null) {
			res.json({ error: 'Something went wrong.', data: { short, url } });
			return;
		}

		const redirected = hasProtocol(url) ? url : `http://${url}`;

		res.redirect(301, redirected);
	} catch (error) {
		res.json(error);
	}
};

export default {
	post,
	get,
};
