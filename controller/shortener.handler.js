import { JsonDB, Config } from 'node-json-db';

const dbConfig = new Config('./json-dbs/short-urls');
const db = new JsonDB(dbConfig);

const root = await db.getData('/');

if (Object.keys(root).length === 0) {
	await db.push('/entries', []);
}

const objEntry = (index) => ({
	original_url: db.data.entries[index],
	short_url: index + 1,
});

export const getEntry = async (url) => {
	const index = db.data.entries.findIndex((elt) => elt === url);

	if (index < 0) return null;

	return objEntry(index)
};

export const addEntry = async (url) => {
	const index = db.data.entries.length;

	await db.push(`/entries[]`, url, true);

	return objEntry(index)
};

export const getUrl = async (short) => {
	const entries = await db.getData('/entries');
	console.log(entries, entries[short - 1]);
	return entries[short - 1] || null;
}
