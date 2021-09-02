// function for calculating age
function calculateAge(dob)
{ 
	return new Date(Date.now() - dob.getTime()).getFullYear() - 1970;
}

// function for getting new phrase
function getPhrase(phrases)
{
	return phrases[Math.floor(Math.random() * phrases.length)];
}

// function for updating text
function updateText(text, phrases, history, historyLen)
{
	// get a new phrase
	let phrase = getPhrase(phrases);

	// ensure phrase isn't in history
	while (history.indexOf(phrase) != -1)
	{
		phrase = getPhrase(phrases);
	}

	// add current phrase to history
	history.unshift(phrase);

	// lets forget history
	if (history.length > historyLen)
	{
		history.pop();
	}

	// update the text
	text.innerHTML = phrase;
}

// run function on page load
window.onload = () =>
{
	// array of text to display
	const phrases =
	[
		calculateAge(new Date(2000, 11, 3)) + " year old from cambridge",
		"brainfuck extrodonaire",
		"caffeine and nicotine addict",
		"command line wizard",
		"computer science student",
		"dedicated vegetarian",
		"devoted unix fanboy",
		"part-time game developer",
		"playstation 2 player in " + new Date().getFullYear(),
		"retro anime enthusiast",
		"skilled downhill longboarder",
	];

	// array to store history
	let history = [];

	// int to store history length
	const historyLen = Math.ceil(phrases.length/2);

	// variable to store text element
	let text = document.getElementById("typewriter");

	// enable animation (so it won't play without js)
	text.style.animationDuration = "6s";

	// set first text value
	updateText(text, phrases, history, historyLen);

	// run on animation loop
	text.onanimationiteration = (anim) =>
	{
		// update text if typing animation
		if (anim.animationName == "typing")
		{
			updateText(text, phrases, history, historyLen);
		}
	};
}
