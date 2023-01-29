import { randomUUID } from 'node:crypto';
import { JsonDB, Config } from 'node-json-db';

const dbPath = './json-dbs/exercise';
const dbConfig = new Config(dbPath);
const db = new JsonDB(dbConfig);

const root = await db.getData('/');

if (Object.keys(root).length === 0) {
	await db.push('/users', []);
}

export const createUser = async (name) => {
	for (const user of db.data.users) {
		if (user.username === name) {
			return {
				error: 'Username already exists.',
			};
		}
	}

	const uuid = randomUUID();
	const user = {
		_id: uuid,
		username: name,
	};

	await db.push(`/users[]`, user, true);
	await db.push(`/entries/${uuid}`, [], true);

	return user
};

export const getAllUsers = async () => {
	return await db.getData('/users');
};

export const getUserById = async (uid) => {
	const users = await getAllUsers();
	return users.find((user) => user._id === uid) || null;
}

export const addEntry = async (uid, description, duration, unix, date) => {
	await db.push(`/entries/${uid}[]`, { description, duration, unix, date });
};

export const getEntries = async (uid) => {
	return await db.getData(`/entries/${uid}`);
}
