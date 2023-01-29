const getTimestamp = (_, res) => {
	const date = new Date();
	res.json({ unix: date.valueOf(), utc: date.toUTCString() });
}

const parseTimestamp = (req, res) => {
	const { timestamp } = req.params;

	// check unix format
	if (/^\d*$/.test(timestamp) && timestamp.length === 13) {
		const date = new Date(parseInt(timestamp));
		res.json({ unix: date.valueOf(), utc: date.toUTCString() });
		return;
	}

	// check date format
	const date = new Date(timestamp);
	if (date instanceof Date && !isNaN(date.valueOf())) {
		res.json({ unix: date.valueOf(), utc: date.toUTCString() });
		return;
	}

	res.json({ error: 'Invalid Date' });
}

export default {
	getTimestamp,
	parseTimestamp
}