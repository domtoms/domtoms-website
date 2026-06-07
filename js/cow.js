const cow = [
	'            ^__^',
	'    _______/(oo)',
	'/\\/(       /(__)',
	'   | w----||',
	'   ||     ||'
];

const cactus = [
	'  |  ',
	'(_|_)',
	'  |  '
];

const stones = ['=', '-'];

const len = 35;
const fps = 30;

let ground = '';
let pos = 80;
let airtime = 0;
let frame = 0;
let tic = 0;

for (let i = 0; i < len; i++) {
	ground += stones[Math.floor(Math.random() * stones.length)];
}

function draw() {
	let out = '';

	let legs = '||     ||';
	if (!airtime) {
		legs = frame ? '╵|     ╵|' : '|╵     |╵';
		out += '<br>'.repeat(cactus.length);
	}
	cow[4] = '   ' + legs;

	for (let i = 0; i < cow.length; i++) {
		out += cow[i];
		if (!airtime && i >= cow.length - cactus.length) {
			let space = pos - cow[i].length;
			if (space < 0) {
				space = 0;
			}

			out += ' '.repeat(space);
			out += cactus[i - cow.length + cactus.length];
		}
		out += '<br>';
	}

	if (airtime) {
		for (let i = 0; i < cactus.length; i++) {
			let space = pos;
			let left = 0;
			if (pos <= 0) {
				space = 0;
				left = -pos;
			}

			out += ' '.repeat(space);
			out += cactus[i].substring(left);
			out += '<br>';
		}
	}

	out += ground;
	return out;
}

function update() {
	if (!airtime && pos === 18) {
		airtime = 30;
	}

	if (airtime) {
		airtime--;
	}

	pos--;

	if (pos <= -cactus[0].length) {
		pos = len + 60 + Math.floor(Math.random() * 60);
	}

	ground = ground.substring(1);
	ground += stones[Math.floor(Math.random() * stones.length)];

	tic++;

	if (tic >= fps / 2) {
		tic = 0;
		frame = 1 - frame;
	}

	game.innerHTML = draw().replace(/ /g, '&nbsp;');
}

setInterval(update, 1000 / fps);
