// get canvas
var c = document.getElementById("bg");
var ctx = c.getContext("2d");

// images
var bg = new Image();
bg.src = "bg.png"

// global variables
var scroll = 0;

// update loop
function update()
{
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// update scroll
	scroll += 0.1;
	if (scroll > bg.width)
	{
		scroll = 0;
	}
	
	// draw bg
	for (var w = -1; w < c.width/bg.width; w++)
	{
		for (var h = -1; h < c.height/bg.height; h++)
		{
			ctx.drawImage(bg, w * bg.width + Math.round(scroll), h * bg . height + Math.round(scroll));
		}
	}
}

// on window resize
window.onresize = function()
{
	resizeCanvas();
}

function resizeCanvas()
{
	// resize canvas
	c.width = window.innerWidth / 4;
	c.height = window.innerHeight / 4;
}

// initialize bg
function initBg()
{
	resizeCanvas();
	setInterval(update);
}