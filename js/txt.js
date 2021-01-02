// get the current year
const year = new Date().getFullYear();

// list of subheadings
const textItems =
[
	"retro anime enthusiast",
	"boarderline suicidal longboarder",
	"casual indie game developer",
	"computer science student",
	"massive fucking nerd",
	"caffeine and nicotine addict",
	"former graphic designer wannabe",
	"Playstation 2 player in " + year,
	"bisexual, probably",
	"jobseeker, please hire me",
	"brainfuck extraordinaire"
	"intolerable GNU/Linux fanboy"
];

// constants
const start = "is a";
const typeSpeed = 100;
const eraseSpeed = 30;
const waitTime = 3000;
const htmlElement = "subheading";

// global variables
var pos = 0;
var rng;
var queue = [];
var speed = typeSpeed;

// booleans
var typing = 1;
var wait = 0;

// type sentence starter
function initText()
{	
	document.getElementById(htmlElement).innerHTML += start.charAt(pos); pos++;
	if (document.getElementById(htmlElement).innerHTML.length == start.length)
	{
		pos = 0;
		randomWord();
		type();
		return;
	}
	setTimeout(initText, speed);
}

// pick a random subheading
function randomWord()
{
	if (queue.length == textItems.length) queue = [rng];
	rng = Math.floor((Math.random() * textItems.length));

	for (var i = 0; i < queue.length; i++)
	{
		while (rng == queue[i])
		{
			rng = Math.floor((Math.random() * textItems.length))
			i = 0;
		}
	}

	queue.push(rng);
	text = " " + textItems[rng] + ".";
}

// type characters
function type()
{
	// type
	if (typing)
	{
		if (pos < text.length)
		{
			document.getElementById(htmlElement).innerHTML += text.charAt(pos);
			pos++;
		}
		else if (pos == text.length)
		{
			speed = eraseSpeed; typing = 0;
			pos = 0;
			wait = 1;
			setTimeout(function()
			{
				wait = 0;
				type()
			},
			waitTime);
		}
	}
	
	// erase
	else if (!typing)
	{
		if (pos < text.length + 1)
		{
			document.getElementById(htmlElement).innerHTML = start + text.substring(0, text.length - pos);
			pos++;
		}
		else if (pos == text.length + 1)
		{
			speed = typeSpeed;
			typing = 1;
			pos = 0;
			randomWord();
		}
	}
	
	// loop function
	if (!wait) setTimeout(type, speed);
}
