const { forms } = document;

const elts = {
	users: document.getElementById('users'),
	uname: forms['user-form'].elements['uname'],
	uid: forms['exercise-form'].elements['uid'],
	desc: forms['exercise-form'].elements['desc'],
	dur: forms['exercise-form'].elements['dur'],
	date: forms['exercise-form'].elements['date'],
};

const base = window.location.origin + window.location.pathname

setDefaultDateValue();
listAllUsers();

addValidationListeners();

addSubmitUserListener();
addSubmitExerciseListener();

function setDefaultDateValue() {
	const today = new Date();
	elts.date.value = today.toISOString().split('T')[0];
}

async function listAllUsers() {
	const response = await fetch(base + 'api/users');
	const users = await response.json();

	for (const user of users) {
		const elt = document.createElement('li');
		elt.innerHTML = `<span>${user._id}</span> - <strong>${user.username}</strong>`;
		elts.users.appendChild(elt);
	}
}

function addValidationListeners() {
	for (const elt of Object.values(elts)) {
		if (elt.nodeName !== 'INPUT') continue;

		elt.addEventListener('input', (e) => {
			if (elt.checkValidity() || elt.value === '') {
				elt.classList.remove('invalid');
				return;
			}

			elt.classList.add('invalid');
		});

		elt.addEventListener('blur', (e) => {
			const elt = e.target;

			if (elt.reportValidity()) {
				elt.classList.remove('invalid');
				return;
			}

			elt.classList.add('invalid');
		});
	}
}

function addSubmitUserListener() {
	forms['user-form'].addEventListener('submit', function () {

		this.action = `${base}api/users/`;
		this.submit();
	});
}

function addSubmitExerciseListener() {
	forms['exercise-form'].addEventListener('submit', function () {
		const userId = elts.uid.value;

		this.action = `${base}api/users/${userId}/exercises`;
		this.submit();
	});
}
