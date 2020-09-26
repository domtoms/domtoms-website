// get canvas
var c = document.getElementById("bg");
var ctx = c.getContext("2d");

// images
var bg = new Image(); bg.src = "bg.png"
var miku = new Image(); miku.src = "miku.png";
var leek = new Image(); leek.src = "leek.png";
var bomb = new Image(); bomb.src = "bomb.png";
var boom = new Image(); boom.src = "boom.png";

// audio
var boomsfx = new Audio("boom.wav");
var leeksfx = new Audio("leek.wav");
var playsfx = new Audio("play.wav");

// global variables
var scroll = 0;
var init = 0;
var game = 0;
var frame = 0;
var keys = {};
var mov = 1;
var dead = 0;
var deathFrame = 0;
var sprites = [];
var drawChar = 1;

// objects and classes
var player =
{
	x: 0,
	y: 0,
}

class pickup
{
	constructor(x, y, img)
	{
		this.x = x;
		this.y = y;
		this.img = img;
		sprites.push(this);
	}
}

// update loop
function update()
{
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// update scroll
	scroll += 0.5;
	if (scroll > bg.width) scroll = 0;
	var rScroll = Math.round(scroll);
	
	// draw bg
	for (var w = -1; w < c.width/bg.width; w++)
	{
		for (var h = -1; h < c.height/bg.height; h++)
		{
			ctx.drawImage(bg, w * bg.width + rScroll, h * bg . height + rScroll);
		}
	}
	
	// game
	if (init)
	{
		if (drawChar)
		{
			// draw player
			ctx.drawImage(
				miku,
				frame * (miku.width/2),
				mov * (miku.height/2),
				miku.width/2,
				miku.height/2,
				Math.round(player.x),
				Math.round(player.y),
				miku.width/2,
				miku.height/2
			);
		}
		
		// enterance cutscene
		if (!game)
		{
			// walk in
			if (player.y > c.height - 60) player.y--;
			else
			{
				game = 1;
				spawnItem();
			}
		}
		
		// controls
		else if (game)
		{
			if (!dead)
			{
				// movement variables
				movX = 0;
				movY = 0;
				
				// keyboard inputs
				if (keys.w || keys.ArrowUp)    movY--;
				if (keys.s || keys.ArrowDown)  movY++;
				if (keys.a || keys.ArrowLeft)  movX--;
				if (keys.d || keys.ArrowRight) movX++;
				
				// move player
				player.x += movX;
				player.y += movY;
				
				// animate player
				if (!movX && !movY) mov = 0;
				else mov = 1;
				
				// wrap around edges
				if (player.x > c.width) player.x = 0 - (miku.width/2);
				if (player.x < -miku.width/2) player.x = c.width;
				if (player.y > c.height) player.y = 0 - (miku.height/2);
				if (player.y < -miku.height/2) player.y = c.height;
				
				// array of sprites to delete
				var delArr = [];
				
				// pickups
				for (var i = 0; i < sprites.length; i++)
				{
					// draw pickups
					ctx.drawImage(sprites[i].img, Math.round(sprites[i].x), Math.round(sprites[i].y));
					sprites[i].y++;
					
					// cleanup offscreen sprites
					if (sprites[i].y > c.height) delArr.push(i);
					
					// collision
					if (player.x + (miku.width/2)  > sprites[i].x && player.x < (sprites[i].x + sprites[i].img.width) &&
						player.y + (miku.height/2) > sprites[i].y && player.y < (sprites[i].y + sprites[i].img.height))
					{
						// bomb
						if (sprites[i].img == bomb)
						{
							boomsfx.play();
							dead = 1;
							setTimeout(animateExplosion, 1000/8);
						}
						
						// leek
						else
						{
							leeksfx.play();
							delArr.push(i);
						}
					}
				}
				
				// delete pickups
				for (var i = 0; i < delArr.length; i++)
				{
					sprites.splice(delArr[i], 1);
				}
			}
			
			else if (dead)
			{
				ctx.drawImage(
					boom,
					deathFrame * (boom.width / 8),
					0,
					boom.width / 8,
					boom.height,
					Math.round(player.x + (miku.width / 4)  - (boom.width / 16)),
					Math.round(player.y + (miku.height / 4) - (boom.height / 2)),
					boom.width / 8,
					boom.height
				);
			}
		}
	}
}

// init game
function gameInit()
{
	// set init boolean
	if (init) return;
	init = 1;
	
	// hide webpage
	document.getElementById("headerText").classList.remove("visible");
	document.getElementById("footer").classList.remove("visible");
	document.getElementById("headerText").classList.add("hidden");
	document.getElementById("footer").classList.add("hidden");
	
	// reset variables
	frame = 0;
	keys = {};
	mov = 1;
	sprites = [];
	dead = 0;
	deathFrame = 0;
	drawChar = 1;
	
	// play sound
	playsfx.play();
	
	// set player starting pos
	player.x = (c.width/2) - (miku.width/4);
	player.y = c.height + miku.height;
}

function death()
{
	// show webpage
	document.getElementById("headerText").classList.remove("hidden");
	document.getElementById("footer").classList.remove("hidden");
	document.getElementById("headerText").classList.add("visible");
	document.getElementById("footer").classList.add("visible");
	
	// reset variables
	init = 0;
	game = 0;
}

// on window resize
window.onresize = function()
{
	// resize the canvas
	resizeCanvas();
}

function resizeCanvas()
{
	// resize canvas
	c.width = window.innerWidth / 4;
	c.height = window.innerHeight / 4;
}

// set sprite frame
function animFrame()
{
	if (frame) frame = 0;
	else frame = 1;
}

// initialize bg
function initBg()
{
	resizeCanvas();
	setInterval(update, 1000/60);
	setInterval(animFrame, 1000/4);
}

// spawn more sprites
function spawnItem()
{
	// return if not in game
	if (!game) return; 
	
	// pick sprite
	var sprite;
	if (Math.round(Math.random())) sprite = leek;
	else sprite = bomb;
	
	// add to array
	var item = new pickup(Math.random() * c.width - (sprite.width/2), -Math.random() * 100, sprite);
	var timeout = (Math.random() * 2) + 1;
	setTimeout(spawnItem, 500 * timeout);
}

function animateExplosion()
{
	// hide player in explosion
	if (deathFrame == 4)
	{
		drawChar = 0;
	}
	
	// end game on anim end
	if (deathFrame > 7)
	{
		setTimeout(death, 500);
		return;
	}
	
	// continue animation
	deathFrame++;
	setTimeout(animateExplosion, 1000/8);
}

// keyboard inputs
onkeydown = function(e)
{
	keys[e.key] = 1;
}

// update key object on key up
onkeyup = function(e)
{
	keys[e.key] = 0;
}

// disable right click
c.oncontextmenu = function(e)
{
	e.preventDefault();
	e.stopPropagation();
}