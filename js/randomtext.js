/* function for calculating age */
function calculateAge(dob)
{ 
	return new Date(Date.now() - dob.getTime()).getFullYear() - 1970;
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
		'80s anime enthusiast',
		'brainfuck extraordinaire',
		'command line wizard',
		'computer science student',
		'dedicated vegetarian',
		'devoted unix fanboy',
		'downhill longboarder',
		'drum and bass dj',
		'private coding tutor',
		'full stack developer',
		'playstation 2 player in ' + new Date().getFullYear(),
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
