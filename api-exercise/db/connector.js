import { JsonDB, Config } from 'node-json-db';

const dbFile = './api-exercise/db/db';
const db = new JsonDB(new Config(dbFile));

const root = await db.getData('/');

if (Object.keys(root).length === 0) {
	await db.push('/users', []);
}

export default db