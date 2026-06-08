const yearsSince = date => {
	const today = new Date();
	let years = today.getFullYear() - date.getFullYear();
	if (
		today.getMonth() < date.getMonth() ||
		(today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
	) {
		years--;
	}

	return years;
};

const phrases = [
	`${yearsSince(new Date(2000, 10, 3))} year old from cambridge`,
	'command line wizard',
	'flac hoarder',
	'jungle and techno dj',
	'london based games dev',
	`ps2 player in ${new Date().getFullYear()}`,
	`swe @ jagex`,
	`uea graduate`,
	`vegetarian of ${yearsSince(new Date(2021, 4, 19))} years`,
	'vim purist'
];

window.addEventListener("load", () => {
	const text = document.getElementById('typewriter');
	const history = [];
	const historyLen = Math.ceil(phrases.length / 2);

	const update = () => {
		let phrase;
		do {
			phrase = phrases[Math.floor(Math.random() * phrases.length)];
		} while (history.includes(phrase));

		history.unshift(phrase);
		if (history.length > historyLen) {
			history.pop();
		}

		text.innerHTML = phrase;
	};

	text.style.animation = 'typing 6s linear infinite';
	text.style.width = '0';

	update();

	if (text.onanimationiteration !== undefined) {
		text.style.animationIterationCount = 'infinite';
	}

	text.onanimationiteration = e => {
		if (e.animationName === 'typing') {
			update();
		}
	};
});

