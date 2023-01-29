const form = document.forms[0];

const elts = {
	input: form.elements['inputfield'],
	data: form.elements['inputdata'],
};

const params = {};

elts.input.addEventListener('change', (e) => {
	const file = e.target.files[0];
	for (const key of ['name', 'type', 'size']) {
		params[key] = file[key];
	}

	elts.data.value = JSON.stringify(params);
});
