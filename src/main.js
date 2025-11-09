import './styles.css';
import gsap from 'gsap';

// Smooth scroll-driven canvas transform (demo behavior)
const canvas = document.getElementById('canvas');
if (!canvas) {
  console.warn('No canvas element found.');
} else {
  // Initialize transform state with GSAP so later tweens are smooth
  gsap.set(canvas, { xPercent: -50, yPercent: -50, scale: 1 });

  // We'll compute target values from scroll and tween to them with GSAP
  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    ticking = false;
    const scrollY = lastY;
    const vh = window.innerHeight;
    const start = vh; // start scaling after section 1
    const end = vh * 2; // finish scaling by section 3
    const detachStart = end; // detachment begins after scaling
    const detachEnd = vh * 3; // done by section 4

    // compute target scale
    let targetScale = 1;
    if (scrollY > start && scrollY < end) {
      const progress = (scrollY - start) / (end - start);
      targetScale = 1 - 0.8 * progress; // 1 → 0.2
    } else if (scrollY >= end) {
      targetScale = 0.2;
    }

    // compute target translateY percentage (centered at -50)
    let targetY = -50;
    if (scrollY > detachStart && scrollY < detachEnd) {
      const progress = (scrollY - detachStart) / (detachEnd - detachStart);
      targetY = -50 - progress * 150; // moves up offscreen gradually
    } else if (scrollY >= detachEnd) {
      targetY = -200;
    }

    // Tween to the new target values smoothly; overwrite ensures a single tween
    gsap.to(canvas, {
      scale: targetScale,
      yPercent: targetY,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: true
    });
  }

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ensure correct on resize
  window.addEventListener('resize', () => {
    lastY = window.scrollY;
    update();
  });

  // initial update
  update();
}
