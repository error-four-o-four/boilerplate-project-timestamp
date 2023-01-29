import validator from 'validator';
import handler from '../handler/exercise.handler.js';

const createUser = async (req, res) => {
	const name = validator.escape(req.body.username);
	const user = await handler.createUser(name);

	res.json(user);
}

const getAllUsers = async (req, res) => {
	const data = await handler.getAllUsers();

	res.json(data);
};

const postExercise = async (req, res) => {
	const uid = req.body[':_id'];

	const data = ['description', 'duration', 'date'].reduce((all, key) => {
		return {
			...all,
			[key]: validator.escape(req.body[key]),
		};
	}, {});

	const { description } = data;
	const duration = parseInt(data.duration);
	const date = new Date(data.date).toDateString();

	await handler.addEntry(uid, description, duration, date);

	const user = await handler.getUserById(uid);

	res.json({
		...user,
		description,
		duration,
		date,
	});
};

const getLogs = async (req, res) => {
	const user = await handler.getUserById(req.params._id);

	let data = await handler.getEntries(user._id);

	data = data.sort((a, b) => {
		const unixA = new Date(a.date).valueOf();
		const unixB = new Date(a.date).valueOf();
		return unixB - unixA;
	});

	if (req.query.from) {
		const min = new Date(req.query.from).valueOf() || 0;
		data = data.filter((entry) => new Date(entry.date).valueOf() >= min);
	}

	if (req.query.to) {
		const max = new Date(req.query.to).valueOf() || Infinity;
		data = data.filter((entry) => new Date(entry.date).valueOf() <= max);
	}

	if (req.query.limit) {
		data = data.slice(0, req.query.limit);
	}

	res.json({
		...user,
		count: data.length,
		log: data,
	});
};

export default {
	createUser,
	getAllUsers,
	postExercise,
	getLogs
}
