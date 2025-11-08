// Entry point for Portfolio Website - Phase 1// Entry point for the 3D Portfolio

import './styles.css';import './styles.css';

import { initScrollAnimations } from './animations/scrollAnimations.js';import { initScene } from './scene.js';

import gsap from 'gsap';

// Initialize scroll animations when DOM is readyimport { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener('DOMContentLoaded', () => {

  initScrollAnimations();gsap.registerPlugin(ScrollTrigger);

});
// Initialize the application
async function init() {
    await initScene();

    // Use GSAP + ScrollTrigger to scale the canvas container until it reaches 200px width
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Wait until next frame to ensure canvas is appended and measured
    await new Promise((r) => requestAnimationFrame(r));

    const canvas = container.querySelector('canvas');
    let canvasWidth = (canvas && canvas.clientWidth) ? canvas.clientWidth : 0;
    if (!canvasWidth && canvas) {
        // try bounding box
        const rect = canvas.getBoundingClientRect();
        canvasWidth = rect.width || window.innerWidth;
    }
    if (!canvasWidth) canvasWidth = window.innerWidth;

    const targetWidth = 200; // pixels
    const targetScale = Math.min(1, targetWidth / canvasWidth);

    // Debug: canvasWidth and targetScale calculated
    // console.log('ScrollScale setup — canvasWidth:', canvasWidth, 'targetScale:', targetScale);

    // Create a ScrollTrigger that scales container from 1 -> targetScale as the user scrolls through #content
    const tween = gsap.to(container, {
        scale: targetScale,
        ease: 'none',
        paused: true,
        onUpdate() {
            // ensure transform-origin is centered
            container.style.transformOrigin = 'center center';
        }
    });

    ScrollTrigger.create({
        trigger: '#content',
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.5}`,
        scrub: true,
        onUpdate(self) {
            // map progress (0..1) to tween progress
            const p = self.progress;
            tween.progress(p);
        }
    });

    // Refresh triggers after a short delay to ensure layout is stable
    setTimeout(() => ScrollTrigger.refresh(), 200);
}

init();