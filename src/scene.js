// Three.js scene setup for rendering car model
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { createEmissiveToonMaterial } from './materials.js';
import { initControls } from './ui/controls.js';


let scene, camera, renderer, model;

export function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 30); // Moved further back

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Ensure correct color space for textures
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Append canvas to DOM
    document.getElementById('app').appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load GLTF/GLB model
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    loader.load(
        '/assets/car.glb', // Path to the GLTF file
        (gltf) => {
            console.log('Model loaded successfully', gltf);
            model = gltf.scene;
            model.scale.set(1, 1, 1); // Adjust scale if needed
            model.position.set(0, 0, 0);
            scene.add(model);

            // Load Palette texture and replace mesh materials with an emissive toon shader
            textureLoader.load(
                '/assets/Palette.png',
                (paletteTex) => {
                    paletteTex.encoding = THREE.sRGBEncoding;
                    paletteTex.needsUpdate = true;

                    // Collect meshes first (avoid creating new meshes while traversing)
                    const meshes = [];
                    model.traverse((n) => { if (n.isMesh) meshes.push(n); });

                    // For each mesh, create a toon emissive material using either the mesh's existing map or the palette texture
                    meshes.forEach((child) => {
                        console.log('Replacing material for mesh:', child.name || child.uuid);

                        // Determine source texture: prefer the mesh's own map if present
                        const sourceMap = (child.material && child.material.map) ? child.material.map : paletteTex;

                        // Create new shader material
                        const newMat = createEmissiveToonMaterial(sourceMap, { threshold: 0.5, emissiveIntensity: 1.0 });

                        // Preserve basic side/visibility settings
                        newMat.side = Array.isArray(child.material) ? THREE.FrontSide : (child.material.side || THREE.FrontSide);
                        newMat.visible = child.visible;

                        // Dispose old material safely
                        try {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => { if (m && m.dispose) m.dispose(); });
                            } else if (child.material && child.material.dispose) {
                                child.material.dispose();
                            }
                        } catch (e) {
                            console.warn('Error disposing old material:', e);
                        }

                        child.material = newMat;

                        // Add a simple black outline: a back-faced, slightly scaled copy of the mesh
                        try {
                            const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
                            // Reuse geometry where possible
                            const outlineMesh = new THREE.Mesh(child.geometry, outlineMat);
                            // Place outline as a child so it follows mesh transforms
                            outlineMesh.name = (child.name || child.uuid) + '_outline';
                            outlineMesh.scale.copy(child.scale).multiplyScalar(1.03);
                            outlineMesh.position.set(0, 0, 0);
                            outlineMesh.rotation.set(0, 0, 0);
                            child.add(outlineMesh);
                        } catch (e) {
                            console.warn('Failed to create outline for mesh', child.name || child.uuid, e);
                        }
                    });

                    console.log('Palette texture applied and toon materials created');

                    // Initialize on-screen controls to tweak threshold
                    try {
                        initControls(() => model, { initialThreshold: 0.5 });
                    } catch (e) {
                        console.warn('Could not initialize controls:', e);
                    }
                },
                undefined,
                (error) => {
                    console.error('Error loading Palette.png:', error);
                }
            );
        },
        (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading GLB:', error);
        }
    );

    // Animation loop (with slow model rotation for inspection)
    const clock = new THREE.Clock();
    const rotationSpeed = 0.1; // radians per second — small value for slow rotation

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        // Apply a very slow rotation so you can inspect the model
        if (model) {
            model.rotation.y += rotationSpeed * delta;
        }

        // Render scene to canvas
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export { scene, camera, renderer, model };