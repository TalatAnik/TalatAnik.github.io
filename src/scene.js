// Three.js scene setup and render target
import * as THREE from 'three';

let scene, camera, renderer, renderTarget;

export function initScene() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create render target
    renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    // Append canvas to DOM
    document.getElementById('app').appendChild(renderer.domElement);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
    }
    animate();
}

export { scene, camera, renderer, renderTarget };