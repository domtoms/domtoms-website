/* function for calculating age */
function calculateAge(dob)
{
	/* what is today? */
	const today = new Date();

	/* how old am i? */
	let age = today.getFullYear() - dob.getFullYear();
	const monthDifference = today.getMonth() - dob.getMonth();

	/* have i had my birthday this year? */
	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate()))
	{
		age--;
	}
	return age;
}

/* function for calculating years since a specific date */
function yearsSince(date)
{
	/* what is today? */
	const today = new Date();

	/* how long has it been? */
	let years = today.getFullYear() - date.getFullYear();
	const monthDifference = today.getMonth() - date.getMonth();

	/* has it been yet? */
	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate()))
	{
		years--;
	}
	return years;
}

/* function for getting new phrase */
function getPhrase(phrases)
{
	return phrases[Math.floor(Math.random() * phrases.length)];
}

/* function for updating text */
function updateText(text, phrases, history, historyLen)
{
	/* get a new phrase */
	let phrase = getPhrase(phrases);

	/* ensure phrase isn't in history */
	while (history.indexOf(phrase) != -1)
	{
		phrase = getPhrase(phrases);
	}

	/* add current phrase to history */
	history.unshift(phrase);

	/* lets forget history */
	if (history.length > historyLen)
	{
		history.pop();
	}

	/* update the text */
	text.innerHTML = phrase;
}

/* run function on page load */
window.onload = () =>
{
	/* array of text to display */
	const phrases = [
		calculateAge(new Date(2000, 11, 3)) + ' year old from cambridge',
		'brainfuck extraordinaire',
		'command line wizard',
		'computing science graduate',
		'downhill longboarder',
		'flac hoarder',
		'full stack developer',
		'jungle and techno dj',
		'private coding tutor',
		'playstation 2 player in ' + new Date().getFullYear(),
		'unix fanboy',
		'vegetarian of ' + yearsSince(new Date(2021, 4, 19)) + ' years',
	];

	/* array to store history */
	let history = [];

	/* int to store history length */
	const historyLen = Math.ceil(phrases.length/2);

	/* variable to store text element */
	let text = document.getElementById('typewriter');

	/* set first text value */
	updateText(text, phrases, history, historyLen);

	/* enable looping animation if end can be detected */
	if (text.onanimationiteration !== undefined)
	{
		text.style.animationIterationCount = 'infinite';
	}

	/* run on animation loop */
	text.onanimationiteration = (anim) =>
	{
		/* update text if typing animation */
		if (anim.animationName == 'typing')
		{
			updateText(text, phrases, history, historyLen);
		}
	};
}
