import bodyParser from 'body-parser';
import validator from 'validator';
import { Router } from 'express';

import { __dirname } from '../config.js';
import { addEntry, createUser, getAllUsers, getEntries, getUserById } from '../controller/exercise.handler.js';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const exerciseRoute = Router({ mergeParams: true });

exerciseRoute.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/exercise.html');
});

exerciseRoute.post('/api/users', urlencodedParser, async (req, res) => {
	const name = validator.escape(req.body.username);
	const user = await createUser(name);

	res.json(user);
});

exerciseRoute.get('/api/users', async (req, res) => {
	const data = await getAllUsers();

	res.json(data);
});

exerciseRoute.post('/api/users/:_id/exercises', urlencodedParser, async (req, res) => {
	const uid = req.body[':_id'];

	const data = ['description', 'duration', 'date'].reduce((all, key) => {
		return {
			...all,
			[key]: validator.escape(req.body[key]),
		};
	}, {});

	const { description } = data;
	const duration = parseInt(data.duration);

	const timestamp = new Date(data.date);
	const unix = timestamp.valueOf();
	const date = timestamp.toDateString();

	await addEntry(uid, description, duration, unix, date);

	const user = await getUserById(uid);

	res.json({
		...user,
		description,
		duration,
		date,
	});
});

exerciseRoute.get('/api/users/:_id/logs', async (req, res) => {
	const uid = req.params._id;
	const user = await getUserById(uid);

	let data = await getEntries(uid);

	data = data.sort((a, b) => {
		return b.unix - a.unix;
	});

	if (req.query.from) {
		const min = new Date(req.query.from).valueOf() || 0;
		data = data.filter((entry) => entry.unix > min);
	}

	if (req.query.to) {
		const max = new Date(req.query.to).valueOf() || Infinity;
		data = data.filter((entry) => entry.unix < max);
	}

	if (req.query.limit) {
		data = data.slice(0, req.query.limit);
	}

	res.json({
		...user,
		count: data.length,
		log: data,
	});
});

export default exerciseRoute;
