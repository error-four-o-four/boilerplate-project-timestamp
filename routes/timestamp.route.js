import { Router } from 'express';

const timestampRoute = Router({mergeParams: true});

timestampRoute.get('/api', function (req, res) {
	const date = new Date();
	res.json({ unix: date.valueOf(), utc: date.toUTCString() });
})

timestampRoute.get('/api/:timestamp', function (req, res) {
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

export default timestampRoute;