// Entry point for the 3D Portfolio
import './styles.css';
import { initScene } from './scene.js';
import { initAnimation } from './animation.js';

// Initialize the application
function init() {
    initScene();
    initAnimation();
}

init();