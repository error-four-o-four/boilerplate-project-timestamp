import dns from 'node:dns';

const timestamp = () => `[${new Date().toLocaleTimeString()}]`;

const regexUrl = new RegExp(
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
);

const regexHttp = new RegExp(/^https?/);

export const hasProtocol = (url) => regexHttp.test(url);

const urlInvalidResponse = { error: 'invalid url' };

export const validateUrl = async (req, res, next) => {
	const { url } = req.body;

	console.log(`${timestamp()} checking url: ${url}\n`);

	if (!regexUrl.test(url)) {
		res.json(urlInvalidResponse);
		return;
	}

	next();
};

export const lookupDns = async (url) => {
	try {
		const lookupUrl = regexHttp.test(url)
			? url
					.split('/')
					.slice(1)
					.filter((elt) => elt)
					.join('/')
			: url;

		const dnsLookupOptions = {
			family: 4,
			hints: dns.ADDRCONFIG | dns.V4MAPPED,
		};

		const result = await dns.promises.lookup(lookupUrl, dnsLookupOptions);

		return result;
	} catch (error) {
		return { ...urlInvalidResponse, data: error };
	}
};
