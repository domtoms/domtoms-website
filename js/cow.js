const dude = [
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
const width = 35;
const fps = 30;
const density = 60;

let ground = '';
let pos = 80;
let airtime = 0;
let frame = 0;
let tic = 0;

for (let i = 0; i < width; i++) {
	ground += stones[Math.floor(Math.random() * stones.length)];
}

function draw() {
	let out = '';

	let legs = '||     ||';
	if (!airtime) {
		legs = frame ? '╵|     ╵|' : '|╵     |╵';
		out += '<br>'.repeat(cactus.length);
	}
	dude[4] = '   ' + legs;

	for (let i = 0; i < dude.length; i++) {
		out += dude[i];
		if (!airtime && i >= dude.length - cactus.length) {
			let space = pos - dude[i].length;
			if (space < 0) {
				space = 0;
			}

			out += ' '.repeat(space);
			out += cactus[i - dude.length + cactus.length];
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
		pos = width + density + Math.floor(Math.random() * density);
	}

	ground = ground.substring(1);
	ground += stones[Math.floor(Math.random() * stones.length)];

	tic++;

	if (tic >= fps / 2) {
		tic = 0;
		frame = 1 - frame;
	}

	cow.innerHTML = draw().replace(/ /g, '&nbsp;');
}

window.addEventListener("load", () => {
	const cow = document.getElementById('cow');
	cow.style.display = 'block';
	setInterval(update, 1000 / fps);
});

