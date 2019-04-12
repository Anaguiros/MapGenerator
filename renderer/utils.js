import { randomWorld } from '../world.js';
import { showWorld } from './renderer.js';

function fade(id) {
    const element = document.getElementById(id);
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

document.getElementById('buttonReset').onclick = function () {
    randomWorld(0);
};
document.getElementById('buttonRandom').onclick = function () {
    randomWorld(9);
};
document.getElementById('buttonOptions').onclick = function () {
    fade('options');
};

document.getElementById('mapData').onchange = function () {
    showWorld();
};

document.getElementById('mapStyle').onchange = function () {
    showWorld();
};
