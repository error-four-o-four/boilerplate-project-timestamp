const url = window.location.origin + '/exercise';
const wrap = document.getElementById('exercise');

const createSpan = () => {
	const elt = wrap.appendChild(document.createElement('span'));
	elt.textContent = 'testing ...';
	return elt;
};

const resolveTest = (passed, resolve) => {
	const content = passed ? '✅' : '❌';
	const message = passed ? 'passed' : 'failed';

	resolve({ content, message });
};

const delay = (duration = 300) => new Promise((resolveDelay) => setTimeout(() => resolveDelay(), duration));

const tests = [
	async (resolve) => {
		const res = await fetch(url + '/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=fcc_test_${Date.now()}`.substring(0, 29),
		});
		if (res.ok) {
			const { _id, username } = await res.json();
			const expected = {
				username,
				description: 'test',
				duration: 60,
				_id,
				date: 'Mon Jan 01 1990',
			};
			const addRes = await fetch(url + `/api/users/${_id}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `description=${expected.description}&duration=${expected.duration}&date=1990-01-01`,
			});
			chai.assert.isTrue(addRes.ok);
			if (!addRes.ok) {
				resolveTest(false, resolve);
				throw new Error(`${addRes.status} ${addRes.statusText}`);
			}
			resolveTest(true, resolve);
		} else {
			resolveTest(false, resolve);
			throw new Error(`${res.status} ${res.statusText}`);
		}
	},
	async (resolve) => {
		const res = await fetch(url + '/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=fcc_test_${Date.now()}`.substring(0, 29),
		});
		if (res.ok) {
			const { _id, username } = await res.json();
			const expected = {
				username,
				description: 'test',
				duration: 60,
				_id,
				date: 'Mon Jan 01 1990',
			};
			const addRes = await fetch(url + `/api/users/${_id}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `description=${expected.description}&duration=${expected.duration}&date=1990-01-01`,
			});
			if (addRes.ok) {
				const actual = await addRes.json();
				chai.assert.deepEqual(actual, expected);
				chai.assert.isString(actual.description);
				chai.assert.isNumber(actual.duration);
				chai.assert.isString(actual.date);
				resolveTest(true, resolve);
			} else {
				resolveTest(false, resolve);
				throw new Error(`${addRes.status} ${addRes.statusText}`);
			}
		} else {
			resolveTest(false, resolve);
			throw new Error(`${res.status} ${res.statusText}`);
		}
	},
	// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
	async (resolve) => {
		const res = await fetch(url + '/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=fcc_test_${Date.now()}`.substring(0, 29),
		});
		if (res.ok) {
			const { _id, username } = await res.json();
			const expected = {
				username,
				description: 'test',
				duration: 60,
				_id,
				date: new Date().toDateString(),
			};
			const addRes = await fetch(url + `/api/users/${_id}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `description=${expected.description}&duration=${expected.duration}`,
			});
			if (addRes.ok) {
				const logRes = await fetch(url + `/api/users/${_id}/logs`);
				chai.assert.isTrue(logRes.ok);
				if (!logRes.ok) {
					resolveTest(false, resolve);
					throw new Error(`${logRes.status} ${logRes.statusText}`);
				}
				resolveTest(true, resolve);
			} else {
				resolveTest(false, resolve);
				throw new Error(`${addRes.status} ${addRes.statusText}`);
			}
		} else {
			resolveTest(false, resolve);
			throw new Error(`${res.status} ${res.statusText}`);
		}
	},
	// The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
	async (resolve) => {
		const res = await fetch(url + '/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=fcc_test_${Date.now()}`.substring(0, 29),
		});
		if (res.ok) {
			const { _id, username } = await res.json();
			const expected = {
				username,
				description: 'test',
				duration: 60,
				_id,
				date: 'Mon Jan 01 1990',
			};
			const addRes = await fetch(url + `/api/users/${_id}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `description=${expected.description}&duration=${expected.duration}&date=1990-01-01`,
			});
			if (addRes.ok) {
				const actual = await addRes.json();
				chai.assert.deepEqual(actual, expected);
				chai.assert.isString(actual.description);
				chai.assert.isNumber(actual.duration);
				chai.assert.isString(actual.date);
				resolveTest(true, resolve);
			} else {
				resolveTest(false, resolve);
				throw new Error(`${addRes.status} ${addRes.statusText}`);
			}
		} else {
			resolveTest(false, resolve);
			throw new Error(`${res.status} ${res.statusText}`);
		}
	},
	async (resolve) => {
		// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
		const res = await fetch(url + '/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=fcc_test_${Date.now()}`.substring(0, 29),
		});
		if (res.ok) {
			const { _id, username } = await res.json();
			const expected = {
				username,
				description: 'test',
				duration: 60,
				_id,
				date: new Date().toDateString(),
			};
			const addRes = await fetch(url + `/api/users/${_id}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `description=${expected.description}&duration=${expected.duration}`,
			});
			if (addRes.ok) {
				const logRes = await fetch(url + `/api/users/${_id}/logs`);
				chai.assert.isTrue(logRes.ok);
				if (!logRes.ok) {
					resolveTest(false, resolve);
					throw new Error(`${logRes.status} ${logRes.statusText}`);
				}
				resolveTest(true, resolve);
			} else {
				resolveTest(false, resolve);
				throw new Error(`${addRes.status} ${addRes.statusText}`);
			}
		} else {
			resolveTest(false, resolve);
			throw new Error(`${res.status} ${res.statusText}`);
		}
	},
];

for (const test of tests) {
	const span = createSpan();
	const duration = 100;

	await delay(duration);

	const result = await new Promise((resolve) => test(resolve));

	span.innerHTML = result.content;

	await delay(duration);
}
