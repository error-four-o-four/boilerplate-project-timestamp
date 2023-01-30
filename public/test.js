const url = window.location.origin + '/metadata';
const wrap = document.getElementById('metadata');

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
	// You can submit a form that includes a file upload.
	// The form file input field has the name attribute set to upfile.
	async (resolve) => {
		const site = await fetch(url);
		const data = await site.text();
		const doc = new DOMParser().parseFromString(data, 'text/html');
		chai.assert(doc.querySelector('input[type="file"]'));
		chai.assert(doc.querySelector('input[name="upfile"]'));
		resolveTest(true, resolve);
	},
	// When you submit a file, you receive the file name, type, and size in bytes within the JSON response.
	async (resolve) => {
		const formData = new FormData();
		const fileData = await fetch('https://cdn.freecodecamp.org/weather-icons/01d.png');
		const file = await fileData.blob();
		formData.append('upfile', file, 'icon');
		const data = await fetch(url + '/api/fileanalyse', {
			method: 'POST',
			body: formData,
		});
		const parsed = await data.json();
		chai.assert.property(parsed, 'size');
		chai.assert.equal(parsed.name, 'icon');
		chai.assert.equal(parsed.type, 'image/png');
		resolveTest(true, resolve);
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
