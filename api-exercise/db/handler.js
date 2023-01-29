import db from './connector.js';

const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const createUser = async (name) => {
	for (const user of db.data.users) {
		if (user.username === name) {
			return {
				error: 'Username already exists.',
			};
		}
	}

	const uid = genRanHex(24);
	const user = {
		_id: uid,
		username: name,
	};

	await db.push(`/users[]`, user, true);
	await db.push(`/entries/${uid}`, [], true);

	return user;
};

const getAllUsers = async () => {
	return await db.getData('/users');
};

const getUserById = async (uid) => {
	const users = await getAllUsers();
	return users.find((user) => user._id === uid) || null;
};

const addEntry = async (uid, description, duration, date) => {
	await db.push(`/entries/${uid}[]`, { description, duration, date });
};

const getEntries = async (uid) => {
	return await db.getData(`/entries/${uid}`);
};

export default {
	createUser,
	getAllUsers,
	getUserById,
	addEntry,
	getEntries,
};
