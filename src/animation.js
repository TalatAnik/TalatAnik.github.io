// GSAP animation logic for the car model
import { gsap } from 'gsap';
import { model } from './scene.js'; // Assuming we export model

export function initAnimation() {
    // Wait for model to load, then animate with GSAP
    const checkModel = () => {
        if (model) {
            gsap.to(model.rotation, {
                y: '+=2', // Rotate 2 radians
                duration: 4,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true
            });
        } else {
            setTimeout(checkModel, 100);
        }
    };
    checkModel();
}