import db from './connector.js';

const objEntry = (index) => ({
	original_url: db.data.entries[index],
	short_url: index + 1,
});

const addEntry = async (url) => {
	const index = db.data.entries.length;

	await db.push(`/entries[]`, url, true);

	return objEntry(index)
};

const getEntry = async (url) => {
	const index = db.data.entries.findIndex((elt) => elt === url);

	if (index < 0) return null;

	return objEntry(index)
};


const getUrl = async (short) => {
	const entries = await db.getData('/entries');

	return entries[short - 1] || null;
}

export default {
	getEntry,
	addEntry,
	getUrl
}
