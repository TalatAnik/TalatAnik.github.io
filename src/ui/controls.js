// Simple UI controls (no external libs) for tweaking shader uniforms
export function initControls(getModel, options = {}) {
    const initial = options.initialThreshold !== undefined ? options.initialThreshold : 0.5;

    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '16px';
    container.style.top = '16px';
    container.style.padding = '10px 12px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.fontFamily = 'sans-serif';
    container.style.fontSize = '13px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.style.backdropFilter = 'blur(4px)';

    const label = document.createElement('label');
    label.textContent = `Threshold: ${initial.toFixed(2)}`;
    label.style.display = 'block';
    label.style.marginBottom = '6px';

    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.max = '1';
    input.step = '0.01';
    input.value = String(initial);
    input.style.width = '160px';

    container.appendChild(label);
    container.appendChild(input);
    document.body.appendChild(container);

    function applyThreshold(value) {
        const model = getModel();
        if (!model) return;
        model.traverse((child) => {
            if (!child.isMesh) return;
            const mat = child.material;
            if (!mat) return;
            // ShaderMaterial created earlier exposes uniforms.threshold
            if (mat.uniforms && mat.uniforms.threshold) {
                mat.uniforms.threshold.value = value;
            }
        });
    }

    input.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        label.textContent = `Threshold: ${v.toFixed(2)}`;
        applyThreshold(v);
    });

    // Initialize
    applyThreshold(initial);

    return {
        el: container,
        setThreshold: (v) => { input.value = String(v); input.dispatchEvent(new Event('input')); }
    };
}
