const base = window.location.origin + '/timestamp';
const wrap = document.getElementById('timestamp');

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
		const expected = {
			unix: 1482624000000,
		};

		const response = await fetch(base + '/api/2016-12-25');
		const data = await response.json();

		resolveTest(expected.unix === data.unix, resolve);
	},
	async (resolve) => {
		const expected = {
			utc: 'Sun, 25 Dec 2016 00:00:00 GMT',
		};

		const response = await fetch(base + '/api/2016-12-25');
		const data = await response.json();

		resolveTest(expected.utc === data.utc, resolve);
	},
	async (resolve) => {
		const expected = {
			unix: 1451001600000,
			utc: 'Fri, 25 Dec 2015 00:00:00 GMT',
		};

		const response = await fetch(base + '/api/1451001600000');
		const data = await response.json();

		const assert = expected.unix === data.unix && expected.utc === data.utc;

		resolveTest(assert, resolve);
	},
	async (resolve) => {
		const expected = {
			unix: 1317772800000,
			utc: 'Wed, 05 Oct 2011 00:00:00 GMT',
		};

		const response = await fetch(base + '/api/05 October 2011, GMT');
		const data = await response.json();

		const assert = expected.unix === data.unix && expected.utc === data.utc;

		resolveTest(assert, resolve);
	},
	async (resolve) => {
		const response = await fetch(base + '/api/this-is-not-a-date');
		const data = await response.json();

		const assert = data.error.toLowerCase() === 'invalid date';

		resolveTest(assert, resolve);
	},
	async (resolve) => {
		const response = await fetch(base + '/api');
		const data = await response.json();

		const assert = Math.abs(data.unix - Date.now()) < 20000;

		resolveTest(assert, resolve);
	},
	async (resolve) => {
		const response = await fetch(base + '/api');
		const data = await response.json();

		const serverTime = new Date(data.utc).getTime();
		const assert = Math.abs(serverTime - Date.now()) < 20000;

		resolveTest(assert, resolve);
	},
];

for (const test of tests) {
	const span = createSpan();
	const duration = 300;

	await delay(duration);

	const result = await new Promise((resolve) => test(resolve));

	span.innerHTML = result.content;

	await delay(duration);
}
