/* define the sprites here  */
let char = [
	'            ^__^',
	'    _______/(oo)',
	'/\\/(       /(__)',
	'   | w----||    ',
	'   ||     ||    '
];

let obstacle = [
	'  |  ',
	'(_|_)',
	'  |  '
];

let stones = ['=', '-'];
let ground = '';

/* global variables */
let len = 60;      /* length of road */
let dist = 100;    /* distance from obstacle */
let airtime = 0;   /* time player has left airborne */
let dead = false;  /* is the player dead? */
let score = 0;     /* total points earned by player */
let high;          /* players high score */
let speed = 1;     /* speed of gameplay */
let tic = 0;       /* tic counter used for leg animation */
let fps = 30;      /* how many frames to render a second */
let frame = 0;     /* frame of leg animation */
let awoke = false; /* has the game been started? */
let element;       /* game canvas */
let container;     /* div containing game canvas */

function draw()
{
	/* string to store current frame */
	let out = '';

	/* frame for leg animation */
	let legs = '||     ||';

	/* if player isn't jumping */
	if (airtime <= 0)
	{
		/* die on collision */
		if (dist < char[0].length)
		{
			/* death sprite */
			char[1] = char[1].substring(0, 13) + 'xx' + char[1].substring(13 + 2);
			char[3] = char[3].substring(0, 14) + 'U' + char[3].substring(14 + 1);

			/* keep player airborne if died above obstacle */
			if (dist < char[0].length - speed)
			{
				airtime = 1;
			}

			/* update high score */
			if (score > high)
			{
				high = score;
				localStorage.setItem('high', score);
			}

			dead = true;
		}

		/* don't do these things if dead and airborne */
		if (!(dead && airtime))
		{
			/* animate legs on ground */
			if (!frame)
			{
				legs = '|╵     |╵';
			}

			else
			{
				legs = '╵|     ╵|';
			}

			/* add whitespace to account for jump height */
			out += '<br>'.repeat(obstacle.length);
		}
	}

	/* apply leg animation */
	char[4] = char[4].substring(0, 3) + legs + char[4].substring(3 + 9);

	/* iterate through character sprite line by line */
	for (let i = 0; i < char.length; i++)
	{
		/* add current line of character to output */
		out += char[i];

		/* add obstacle on same line if player isn't jumping */
		if (i >= char.length - obstacle.length && airtime <= 0)
		{
			let space = dist - char[i].length;
			if (space <= 0)
			{
				space = 0;
			}

			out += ' '.repeat(space) + obstacle[i - char.length + obstacle.length];
		}

		out += '<br>';
	}

	/* draw obstacle below player if jumping */
	if (airtime > 0)
	{
		for (let i = 0; i < obstacle.length; i++)
		{
			/* allow to seamlessly roll off canvas */
			space = dist;
			cutoff = 0;
			if (dist <= 0)
			{
				space = 0;
				cutoff = Math.abs(dist);
			}

			out += ' '.repeat(space) + obstacle[i].substr(cutoff, obstacle[i].length) + '<br>';
		}
	}

	/* update the score */
	out += ground + '<br>' + ' score: ' + score + '<br>' + ' high score: ' + high;
	return out;
}


function update()
{
	if (!dead)
	{
		/* update frame counter */
		tic++;

		/* scroll the obstacle towards the player */
		dist -= speed;

		/* increase score for every frame alive */
		score++;

		/* speed up game every 1000 points */
		if (speed <= 3)
		{
			speed = Math.ceil(score / 1000);
		}

		/* update and draw the ground */
		ground = ground.substring(speed);
		for (let i = 0; i < speed; i++)
		{
			ground += stones[Math.floor(Math.random() * stones.length)];
		}

		/* decrease players airtime if jumping */
		if (airtime > 0)
		{
			airtime--;
		}

		/* reset distance when obstacle goes off screen */
		if (dist <= -obstacle[0].length)
		{
			dist = len * 1.75 + Math.floor(Math.random() * 30);
		}

		/* update frame */
		if (tic > Math.ceil(fps / (speed + 1)))
		{
			tic = 0;
			frame = 1 - frame;
		}
	}

	/* update the game canvas */
	element.innerHTML = draw().replace(/ /g, '&nbsp;');
}

function awake()
{
	/* can't wake the game up twice */
	if (awoke)
	{
		return;
	}

	awoke = true;

	/* set high score */
	high = localStorage.getItem('high') || 0;

	/* get game canvas */
	element = document.getElementById('game');

	/* generate ground texture */
	worldgen();

	/* handle mobile device */
	if (mobile())
	{
		/* hide the links  */
		document.getElementById('links').style.display = 'none';
	}

	/* begin the update loop */
	setInterval(update, 1000/fps);
}

function worldgen()
{
	/* generate the initial ground texture */
	for (let i = 0; i < len; i++)
	{
		ground += stones[Math.floor(Math.random() * stones.length)];
		ground = stones[Math.floor(Math.random() * stones.length)].repeat(len);
	}
}

function reset()
{
	/* regenerate ground texture */
	worldgen();

	/* reset game variables */
	speed = 1;
	score = 0;
	dist = 100;
	airtime = 0;
	dead = false;

	/* reset sprite */	
	char[1] = char[1].substring(0, 13) + 'oo' + char[1].substring(13 + 2);
	char[3] = char[3].substring(0, 14) + ' ' + char[3].substring(14 + 1);
}

function input()
{
	/* wake game */
	if (!awoke)
	{
		awake();
		return;
	}

	/* jump if not dead */
	if (!dead)
	{
		if (airtime <= 0)
		{
			airtime = 30;
		}
	}

	/* reset game if dead */
	else
	{
		reset();
	}
}

function mobile()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

onkeyup = function(e)
{
	if (e.code == "Space")
	{
		input();
	}
}

ontouchstart = function(e)
{
	input();
}
