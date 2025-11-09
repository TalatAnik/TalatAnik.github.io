import './styles.css';
import gsap from 'gsap';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Add a JS marker class so we only apply JS-only styles when scripts run.
document.documentElement.classList.add('js');

// Smooth scroll-driven canvas transform (demo behavior)
const canvas = document.getElementById('canvas');
if (!canvas) {
  console.warn('No canvas element found.');
} else {
  // Initialize transform state with GSAP so later tweens are smooth
  gsap.set(canvas, { xPercent: -50, yPercent: -50, scale: 1 });

  // Initialize Lenis for smooth scrolling (per official README)
  let lastY = 0;
  let ticking = false;

  const lenis = new Lenis({
    autoRaf: true,
    smooth: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  // mark that Lenis is active so CSS can hide the native scrollbar
  document.documentElement.classList.add('lenis-active');
  document.body.classList.add('lenis-active');

  // Create custom overlay scrollbar (only thumb visible)
  const scrollbar = document.createElement('div');
  scrollbar.className = 'custom-scrollbar hidden';
  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  scrollbar.appendChild(thumb);
  document.body.appendChild(scrollbar);

  function updateCustomScrollbar() {
    // lenis.limit is the maximum scroll value (documentHeight - viewportHeight)
    const limit = lenis.limit || 0;
    const scroll = lenis.scroll || 0;
    const vh = window.innerHeight;
    const trackHeight = Math.max(scrollbar.clientHeight, 32);

    if (limit <= 0) {
      // no scrolling needed
      scrollbar.classList.add('hidden');
      return;
    }

    scrollbar.classList.remove('hidden');

    // thumb height: proportion of viewport to total document height
    const totalHeight = limit + vh;
    const ratio = vh / totalHeight;
    const minThumb = 24;
    const thumbHeight = Math.max(Math.round(trackHeight * ratio), minThumb);

    // thumb position: 0..(trackHeight - thumbHeight)
    const maxTop = trackHeight - thumbHeight;
    const top = Math.round((scroll / limit) * maxTop) || 0;

    thumb.style.height = thumbHeight + 'px';
    thumb.style.transform = `translateY(${top}px)`;

    // Attempt to compute an inverted color from the element currently under the thumb
    try {
  const rect = scrollbar.getBoundingClientRect();
  const thumbCenterX = rect.left + rect.width / 2;
  const thumbCenterY = rect.top + top + thumbHeight / 2;
  // Temporarily hide the scrollbar so elementFromPoint hits underlying content
  const prevVisibility = scrollbar.style.visibility;
  scrollbar.style.visibility = 'hidden';
  let el = document.elementFromPoint(thumbCenterX, thumbCenterY);
  scrollbar.style.visibility = prevVisibility || '';
      // Try to sample pixel if the underlying element is a <canvas>
      let bgColor = null;
      if (el && el.tagName === 'CANVAS') {
        try {
          const crect = el.getBoundingClientRect();
          const cx = Math.floor((thumbCenterX - crect.left) * (el.width / crect.width));
          const cy = Math.floor((thumbCenterY - crect.top) * (el.height / crect.height));
          const ctx = el.getContext('2d');
          if (ctx) {
            const d = ctx.getImageData(Math.max(0, Math.min(el.width - 1, cx)), Math.max(0, Math.min(el.height - 1, cy)), 1, 1).data;
            bgColor = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
          }
        } catch (e) {
          // If sampling fails (e.g., WebGL canvas or CORS), ignore and fall back
          bgColor = null;
        }
      }

      // walk up until we find a non-transparent background (if canvas sampling didn't produce a color)
      while (!bgColor && el && el !== document.documentElement) {
        const cs = window.getComputedStyle(el);
        const bg = cs.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          bgColor = bg;
          break;
        }
        el = el.parentElement;
      }
      if (!bgColor) bgColor = window.getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';

      // parse rgb/rgba into [r,g,b]
      const m = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (m) {
        const srcR = parseInt(m[1], 10);
        const srcG = parseInt(m[2], 10);
        const srcB = parseInt(m[3], 10);

        // perceived brightness
        const bright = 0.299 * srcR + 0.587 * srcG + 0.114 * srcB;

        // inverted color
        const invR = 255 - srcR;
        const invG = 255 - srcG;
        const invB = 255 - srcB;

        // Choose final thumb color to guarantee contrast
        let finalR, finalG, finalB, finalA = 0.95;
        let borderColor = 'rgba(0,0,0,0.08)';

        if (bright > 220) {
          // very light background -> use dark thumb
          finalR = 20; finalG = 20; finalB = 20; finalA = 0.9;
          borderColor = 'rgba(255,255,255,0.08)';
        } else if (bright < 40) {
          // very dark background -> use light thumb
          finalR = 255; finalG = 255; finalB = 255; finalA = 0.95;
          borderColor = 'rgba(0,0,0,0.12)';
        } else {
          // for mid-tone backgrounds use the inverted color but nudge it towards higher contrast
          // blend inverted with either white or black depending on brightness
          const blendToWhite = bright < 128;
          const blendFactor = 0.22; // how strongly to blend
          if (blendToWhite) {
            finalR = Math.round(invR * (1 - blendFactor) + 255 * blendFactor);
            finalG = Math.round(invG * (1 - blendFactor) + 255 * blendFactor);
            finalB = Math.round(invB * (1 - blendFactor) + 255 * blendFactor);
            borderColor = 'rgba(0,0,0,0.08)';
          } else {
            finalR = Math.round(invR * (1 - blendFactor));
            finalG = Math.round(invG * (1 - blendFactor));
            finalB = Math.round(invB * (1 - blendFactor));
            borderColor = 'rgba(255,255,255,0.06)';
          }
        }

        thumb.style.background = `rgba(${finalR}, ${finalG}, ${finalB}, ${finalA})`;
        thumb.style.border = `1px solid ${borderColor}`;
        thumb.style.mixBlendMode = 'normal';
      } else {
        // fallback to a visible color
        thumb.style.background = 'rgba(255,255,255,0.95)';
        thumb.style.border = '1px solid rgba(0,0,0,0.06)';
        thumb.style.mixBlendMode = 'normal';
      }
    } catch (err) {
      // ignore and leave default thumb color
    }
  }

  // initial lenis scroll value
  lastY = lenis.scroll || 0;

  // Hook lenis scroll to update custom scrollbar
  // Show scrollbar while scrolling and schedule hide when idle
  let hideTimeout = null;
  function showScrollbar() {
    scrollbar.classList.remove('hidden');
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    hideTimeout = setTimeout(() => {
      scrollbar.classList.add('hidden');
    }, 900);
  }

  lenis.on('scroll', () => {
    updateCustomScrollbar();
    showScrollbar();
  });

  // Update custom scrollbar on resize
  window.addEventListener('resize', () => {
    updateCustomScrollbar();
  });

  // Initial update
  updateCustomScrollbar();

  // --- Drag-to-scroll handlers for the thumb ---
  let dragging = false;
  function onPointerDown(e) {
    e.preventDefault();
    dragging = true;
    thumb.classList.add('dragging');
    // stop the lenis animation to allow direct control
    if (typeof lenis.stop === 'function') lenis.stop();
    thumb.setPointerCapture(e.pointerId);
    showScrollbar();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const rect = scrollbar.getBoundingClientRect();
    const trackHeight = Math.max(scrollbar.clientHeight, 32);
    const thumbHeight = thumb.offsetHeight || 24;
    const maxTop = trackHeight - thumbHeight;
    let y = e.clientY - rect.top - thumbHeight / 2;
    y = Math.max(0, Math.min(maxTop, y));
    const limit = lenis.limit || 0;
    const ratio = maxTop <= 0 ? 0 : y / maxTop;
    const target = Math.round(ratio * (limit || 0));
    // scroll instantly to the target while dragging
    if (typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { immediate: true });
    }
    // update thumb position immediately for responsiveness
    thumb.style.transform = `translateY(${Math.round(y)}px)`;
    // update color based on new position
    updateCustomScrollbar();
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    thumb.classList.remove('dragging');
    try { thumb.releasePointerCapture(e.pointerId); } catch (err) {}
    if (typeof lenis.start === 'function') lenis.start();
    showScrollbar();
  }

  thumb.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

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

  // Update lastY from Lenis scroll event
  lenis.on('scroll', ({ scroll }) => {
    lastY = scroll;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  });

  // ensure correct on resize
  window.addEventListener('resize', () => {
    lastY = lenis.scroll || 0;
    update();
  });

  // initial update
  lastY = lenis.scroll || 0;
  update();
}

// Entrance animation for section 1 left column
window.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('#section1 .col-left');
  if (target) {
    gsap.to(target, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 });
  }
});
