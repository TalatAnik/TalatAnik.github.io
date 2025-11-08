// Simple emissive toon shader material
// Produces a black-or-white emissive color based on the luminance of the sampled texture
import * as THREE from 'three';

export function createEmissiveToonMaterial(texture = null, options = {}) {
    const threshold = options.threshold !== undefined ? options.threshold : 0.5;
    const emissiveIntensity = options.emissiveIntensity !== undefined ? options.emissiveIntensity : 1.0;

    const uniforms = {
        map: { value: texture },
        useMap: { value: texture ? 1 : 0 },
        threshold: { value: threshold },
        emissiveIntensity: { value: emissiveIntensity }
    };

    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Fragment shader: sample map (if present), compute luminance and threshold to B/W
    const fragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform sampler2D map;
        uniform int useMap;
        uniform float threshold;
        uniform float emissiveIntensity;

        // Rec.709 luminance
        float luminance(vec3 c) {
            return dot(c, vec3(0.2126, 0.7152, 0.0722));
        }

        void main() {
            vec3 base = vec3(1.0);
            if (useMap == 1) {
                vec4 tex = texture2D(map, vUv);
                // Assume texture already in sRGB space (handled by three)
                base = tex.rgb;
            }

            float L = luminance(base);
            // Step produces 0.0 or 1.0 based on threshold
            float bw = step(threshold, L);
            // Invert the clamping so white becomes black and black becomes white
            vec3 emissive = mix(vec3(1.0), vec3(0.0), bw) * emissiveIntensity;

            gl_FragColor = vec4(emissive, 1.0);
        }
    `;

    const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: false,
        // Use basic settings that behave well with textures
        depthTest: true,
        depthWrite: true
    });

    // Allow three to set the correct color space for the map when assigned
    mat.defines = mat.defines || {};

    return mat;
}
