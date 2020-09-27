// get canvas
const c = document.getElementById("bg");
const ctx = c.getContext("2d");

// images
const bg = new Image(); bg.src = "img/bg.png"
const miku = new Image(); miku.src = "img/miku.png";
const leek = new Image(); leek.src = "img/leek.png";
const bomb = new Image(); bomb.src = "img/bomb.png";
const boom = new Image(); boom.src = "img/boom.png";
const touch = new Image(); touch.src = "img/touch.png";

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
var score = 0;
var hiScore = 0;
var touchscreen = 0;
var mobile = 0;
var itemSpeed = 1;

// touchscreen buttons
const buttons = [
	{x: 22, y: 52, opacity: 0.4},
	{x: 36, y: 38, opacity: 0.4},
	{x: 22, y: 24, opacity: 0.4},
	{x: 08, y: 38, opacity: 0.4},
];

var touchPos = {
	x: undefined,
	y: undefined,
};

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
		this.add = 1;
		
		// check if overlap
		for (var i = 0; i < sprites.length; i++)
		{
			if (this.x + this.img.width >  sprites[i].x && this.x < sprites[i].x + sprites[i].img.width &&
				this.y + this.img.height > sprites[i].y && this.y < sprites[i].y + sprites[i].img.height)
			{
				this.add = 0;
				break;
			}
		}
		if (this.add) sprites.push(this);
		
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
				if (keys.w || keys.ArrowUp) movY--;
				if (keys.s || keys.ArrowDown) movY++;
				if (keys.a || keys.ArrowLeft) movX--;
				if (keys.d || keys.ArrowRight) movX++;
				
				// touch inputs
				for (var i = 0; i < buttons.length; i++)
				{
					// reset opacity
					buttons[i].opacity = 0.4;
					
					// on touch
					if (touchPos.x > buttons[i].x && touchPos.x < buttons[i].x + touch.width && touchPos.y >
					   (c.height - buttons[i].y) && touchPos.y < (c.height - buttons[i].y) + touch.height)
					{
						buttons[i].opacity = 0.8;
						
						switch(i)
						{
							case 0: movY--; break;
							case 1: movX++; break;
							case 2: movY++; break;
							case 3: movX--; break;
						}
					}
				}
				
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
					sprites[i].y += itemSpeed;
					
					// cleanup offscreen sprites
					if (sprites[i].y > c.height) delArr.push(i);
					
					// collision
					if (player.x + (miku.width/2)  > sprites[i].x && player.x < (sprites[i].x + sprites[i].img.width) &&
						player.y + (miku.height/2) > sprites[i].y && player.y < (sprites[i].y + sprites[i].img.height))
					{
						// leek
						if (sprites[i].img == leek)
						{
							score++;
							if (itemSpeed < 2 && !(score % 5)) itemSpeed += 0.05;
							console.log(itemSpeed);
							var leeksfx = new Audio("sfx/leek.mp3");
							leeksfx.play();
							delArr.push(i);
						}
						
						// bomb
						else
						{
							var boomsfx = new Audio("sfx/boom.mp3");
							boomsfx.play();
							dead = 1;
							setTimeout(animateExplosion, 1000/8);
						}
					}
				}
				
				// delete pickups
				for (var i = 0; i < delArr.length; i++)
				{
					sprites.splice(delArr[i] - i, 1);
				}
				
				// score text
				ctx.fillStyle = "white";
				ctx.font = "10px Roboto";
				ctx.fillText("Score: " + score, 10, 18);
				ctx.fillText("Hi-Score: " + hiScore, 10, 28);
				
				// touch buttons 
				if (touchscreen && mobile)
				{	
					// up button
					ctx.globalAlpha = buttons[0].opacity;
					ctx.drawImage(touch, 22, c.height - 52);
					
					// right button
					ctx.globalAlpha = buttons[1].opacity;
					ctx.translate(52, c.height - 38);
					ctx.rotate(90 * Math.PI / 180);
					ctx.drawImage(touch, 0, 0);
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					
					// down button
					ctx.globalAlpha = buttons[2].opacity;
					ctx.translate(38, c.height - 8);
					ctx.rotate(180 * Math.PI / 180);
					ctx.drawImage(touch, 0, 0);
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					
					// left button
					ctx.globalAlpha = buttons[3].opacity;
					ctx.translate(8, c.height - 22);
					ctx.rotate(270 * Math.PI / 180);
					ctx.drawImage(touch, 0, 0);
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					
					ctx.globalAlpha = 1;
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
	score = 0;
	itemSpeed = 1;
	
	// play sound
	var playsfx = new Audio("sfx/play.mp3");
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
	
	// update high score
	if (score > hiScore) hiScore = score;
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
	// set canvas size
	resizeCanvas();
	
	// check if device has touchscreen
	if ("ontouchstart" in window) touchscreen = true;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) mobile = true;
	
	// begin loops
	setInterval(update, 1000/60);
	setInterval(animFrame, 1000/4);
}

// spawn more sprites
function spawnItem()
{
	// return if not in game
	if (!game) return; 
	
	// pick how many items to spawn
	var items = Math.ceil(window.innerWidth / 500);
	
	for (var i = 0; i < items; i++)
	{		
		// pick sprite
		var sprite;
		if (Math.round(Math.random())) sprite = leek;
		else sprite = bomb;
		
		// add to array
		var item = new pickup(Math.random() * c.width - (sprite.width/2), -Math.random() * 300, sprite);
	}
	
	// queue next spawn
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

// touchscreen input
if ("ontouchstart" in window)
{
	ontouchstart = function(e)
	{	
		touchPos.x = e.touches[0].clientX / (window.innerWidth / c.width);
		touchPos.y = e.touches[0].clientY / (window.innerHeight / c.height);
	}
}

if ("ontouchend" in window)
{
	ontouchend = function(e)
	{
		touchPos.x = undefined;
		touchPos.y = undefined;
	}
}