const base = window.location.origin + '/shortener';
const wrap = document.getElementById('shortener');

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
		const url = 'https://freeCodeCamp.org';
		const urlVariable = Date.now();
		const fullUrl = `${url}/?v=${urlVariable}`;

		const response = await fetch(base + '/api/shorturl', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `url=${fullUrl}`,
		});
		if (response.ok) {
			const { short_url, original_url } = await response.json();
			chai.assert.isNotNull(short_url);
			chai.assert.strictEqual(original_url, `${url}/?v=${urlVariable}`);
			resolveTest(true, resolve);
		} else {
			console.error(`${response.status} ${response.statusText}`);
			resolveTest(false, resolve);
		}
	},
	// async (resolve) => {
	// 	const url = 'https://freeCodeCamp.org';
	// 	const urlVariable = Date.now();
	// 	const fullUrl = `${url}/?v=${urlVariable}`;
	// 	let shortenedUrlVariable;
	// 	const postResponse = await fetch(url + '/api/shorturl', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	// 		body: `url=${fullUrl}`,
	// 	});
	// 	if (postResponse.ok) {
	// 		const { short_url } = await postResponse.json();
	// 		shortenedUrlVariable = short_url;
	// 	} else {
	// 		throw new Error(`${postResponse.status} ${postResponse.statusText}`);
	// 	}
	// 	const getResponse = await fetch(url + '/api/shorturl/' + shortenedUrlVariable, {
	// 		mode: 'cors',
	// 		headers: {
	// 			'Access-Control-Allow-Origin': '*',
	// 		},
	// 	});
	// 	if (getResponse) {
	// 		const { redirected, url } = getResponse;
	// 		chai.assert.isTrue(redirected);
	// 		chai.assert.strictEqual(url, fullUrl);
	// 		resolveTest(true, resolve);
	// 	} else {
	// 		// throw new Error(`${getResponse.status} ${getResponse.statusText}`);
	// 		console.error(`${getResponse.status} ${getResponse.statusText}`);
	// 		resolveTest(false, resolve);
	// 	}
	// },

	async (resolve) => resolveTest(false, resolve),
];

for (const test of tests) {
	const span = createSpan();
	const duration = 300;

	await delay(duration);

	const result = await new Promise((resolve) => test(resolve));

	span.innerHTML = result.content;

	await delay(duration);
}
