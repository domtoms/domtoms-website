// get canvas
var c = document.getElementById("bg");
var ctx = c.getContext("2d");

// images
var bg = new Image();
bg.src = "bg.png"

// global variables
var scroll = 0;
var init = 0;

// update loop
function update()
{
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// update scroll
	scroll += 0.5;
	if (scroll > bg.width)
	{
		scroll = 0;
	}
	
	var rScroll = Math.round(scroll);
	
	// draw bg
	for (var w = -1; w < c.width/bg.width; w++)
	{
		for (var h = -1; h < c.height/bg.height; h++)
		{
			ctx.drawImage(bg, w * bg.width + rScroll, h * bg . height + rScroll);
		}
	}
}

// init game
function gameInit()
{
	if (init) return;
	init = 1;
	document.getElementById("headerText").className += "hidden";
	document.getElementById("footer").className += "hidden";
}

// on window resize
window.onresize = function()
{
	resizeCanvas();
}

function resizeCanvas()
{
	// resize canvas
	c.width = window.innerWidth / 5;
	c.height = window.innerHeight / 5;
}

// initialize bg
function initBg()
{
	resizeCanvas();
	setInterval(update, 1000/60);
}

// disable right click
c.oncontextmenu = function(e)
{
	e.preventDefault();
	e.stopPropagation();
}