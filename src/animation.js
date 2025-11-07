// GSAP animation logic for render target
import { gsap } from 'gsap';
import { renderer } from './scene.js';

export function initAnimation() {
    // Example: Animate the canvas element
    const canvas = renderer.domElement;
    gsap.to(canvas, {
        rotation: 360,
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
    });
}