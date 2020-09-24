// list of subheadings
const textItems =
[
	" retro anime enthusiast.",
	" reckless downhill longboarder.",
	" passionate games developer.",
	" computer science student.",
	" massive fucking nerd."
];

// global variables
var pos = 0;
var speed;
var rng;
var queue = [];

// booleans
var typing = 1;
var wait = 0;

// constants
const start = "Is a";
const typeSpeed = 100;
const eraseSpeed = 30;
const waitTime = 3000;
const htmlElement = "subheading";

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
	text = textItems[rng];
}

// type characters
function type()
{
	// type
	if (typing)
	{
		if (pos < text.length) {document.getElementById(htmlElement).innerHTML += text.charAt(pos); pos++;}
		else if (pos == text.length){speed = eraseSpeed; typing = 0; pos = 0; wait = 1; setTimeout(function(){wait = 0; type()}, waitTime);}
	}
	
	// erase
	else if (!typing)
	{
		if (pos < text.length + 1) {document.getElementById(htmlElement).innerHTML = start + text.substring(0, text.length - pos); pos++;}
		else if (pos == text.length + 1){speed = typeSpeed; typing = 1; pos = 0; randomWord();}
	}
	
	// loop function
	if (!wait) setTimeout(type, speed);
}

// run on page load
window.onload = function()
{
	speed = typeSpeed;
	initText();
}