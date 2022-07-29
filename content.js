let canPlaySound = false;

const soundTypeVolume = {
	mouse: 0.02,
	keyboard: 0.05,
	tab: 0.05,
};

function playSound(sound, type) {
	if (type == 'mouse') chrome.runtime.sendMessage({ type: 'click' }); 
	
	const soundPath = chrome.runtime.getURL(sound);
	var audio = new Audio(soundPath);
	audio.volume = soundTypeVolume[type] ?? 1;
	return audio.play().then(() => canPlaySound = true);
}



/* -= Mouse =- */

const mouseSounds = {
	down: '/sounds/mouse/down.mp3',
	up: '/sounds/mouse/up.mp3',
	click: '/sounds/mouse/click.mp3',
	scroll: '/sounds/mouse/scroll.mp3',
}

window.addEventListener('pointerdown', () => playSound(mouseSounds.down, 'mouse'));
window.addEventListener('pointerup', () => playSound(mouseSounds.up, 'mouse'));
window.addEventListener('dragend', () => playSound(mouseSounds.up, 'mouse'));
// window.addEventListener('wheel', () => playSound(mouseSounds.scroll, 'mouse'));



/* -= Keyboard =- */

const keyboardSounds = [
	'/sounds/keyboard/1.mp3',
	'/sounds/keyboard/2.mp3',
	'/sounds/keyboard/3.mp3',
	'/sounds/keyboard/4.mp3',
	'/sounds/keyboard/5.mp3',
	'/sounds/keyboard/6.mp3',
];

let keys = {};

window.addEventListener('blur', () => keys = {});

window.addEventListener('keyup', (event) => delete keys[event.code]);

window.addEventListener('keydown', (event) => {
	if (keys[event.code]) return;
	keys[event.code] = true;

	const keystroke = keyboardSounds[Math.floor(Math.random() * keyboardSounds.length)];
	playSound(keystroke, 'keyboard');
});



/* -= Tab =- */

const tabSounds = {
	open: mouseSounds.up,
	close: mouseSounds.down,
	changed: mouseSounds.up,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type == 'tab') {
		if (request.action == 'open') playSound(tabSounds.open, 'tab');
		else if (request.action == 'close') playSound(tabSounds.close, 'tab');
		else if (request.action == 'changed') playSound(tabSounds.changed, 'tab');
		sendResponse(canPlaySound);
		return;
	}
	sendResponse();
});