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

  // --- Custom inverted cursor ---
  const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  let customCursor = null;
  if (!isCoarse) {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor hidden';
    document.body.appendChild(customCursor);
  }

  // Cursor movement smoothing
  let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
  let cursorVisible = false;
  // note: color sampling removed in favor of CSS mix-blend-mode; JS only handles movement/show/hide

  function showCursor() {
    if (!customCursor) return;
    customCursor.classList.remove('hidden');
    cursorVisible = true;
  }
  function hideCursor() {
    if (!customCursor) return;
    customCursor.classList.add('hidden');
    cursorVisible = false;
  }

  // Simple shrink-on-speed behavior (no squash/stretch):
  const BASE_CURSOR_SCALE = 1.2; // stationary size (slightly larger)
  let currentScale = BASE_CURSOR_SCALE;
  let targetScale = BASE_CURSOR_SCALE;
  let lastTargetPos = { x: 0, y: 0 };

  function rafCursor() {
    const lerp = 0.48; // snappy follow
    const dx = targetX - cursorX;
    const dy = targetY - cursorY;

    cursorX += dx * lerp;
    cursorY += dy * lerp;

    // smooth the scale towards targetScale
    currentScale += (targetScale - currentScale) * 0.22;

    if (customCursor) {
      customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) translateZ(0) scale(${currentScale})`;
    }

    requestAnimationFrame(rafCursor);
  }
  requestAnimationFrame(rafCursor);

  // Pointer move updates target coords and shows cursor. Also trigger immediate color update (throttled).
  if (customCursor) {
    let lastPointerUpdate = 0;
    function updateCursorFromEvent(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      showCursor();

      // compute instantaneous movement of pointer targets (since RAF is moving cursor toward target)
      const vx = e.clientX - lastTargetPos.x;
      const vy = e.clientY - lastTargetPos.y;
      lastTargetPos.x = e.clientX;
      lastTargetPos.y = e.clientY;

      const speed = Math.sqrt(vx * vx + vy * vy);

      // map speed to a shrink factor: faster motion => smaller cursor
      // tune: base 1.2 -> min 0.7. speed multiplier chosen to feel responsive.
      const newScale = Math.max(0.7, BASE_CURSOR_SCALE - Math.min(0.5, speed * 0.02));
      targetScale = newScale;
    }
    window.addEventListener('pointermove', updateCursorFromEvent, { passive: true });
    // hide on blur / leave
    window.addEventListener('pointerleave', () => { if (customCursor) hideCursor(); });
    window.addEventListener('pointerdown', () => { if (customCursor) customCursor.classList.add('active'); });
    window.addEventListener('pointerup', () => { if (customCursor) customCursor.classList.remove('active'); });
  }

  // color-sampling removed: CSS handles inversion using mix-blend-mode: difference

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

// Entrance animation for section 1 left column and rotating paragraph sentences
window.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('#section1 .col-left');
  if (!target) return;

  // Split non-paragraph nodes into words (we handle paragraph separately for rotation)
  const splitSelectors = 'h1,h2,h3,span';
  const nodes = Array.from(target.querySelectorAll(splitSelectors));

  nodes.forEach((node) => {
    // skip if node already contains .word spans
    if (node.querySelector('.word')) return;
    const text = node.textContent.trim();
    if (!text) return;

    const parts = text.split(/(\s+)/);
    const html = parts.map(part => {
      if (/^\s+$/.test(part)) return part; // preserve whitespace
      return `<span class="word">${part}</span>`;
    }).join('');
    node.innerHTML = html;
  });

  // Animate non-paragraph words in with a slight stagger after a short delay
  const words = target.querySelectorAll(':scope > h1 .word, :scope > h2 .word, :scope > h3 .word, :scope > span .word');
  if (words.length) {
    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.06,
      delay: 0.28
    });
  }

  // Rotating paragraph sentences for the first section
  const p = target.querySelector('p');
  if (p) {
    const sentences = [
      'I make websites that look like they know a secret.',
      'I specialise in tasteful chaos and caffeinated scripts.',
      'Design by day, ridiculous prototypes by night.',
      'I build things that politely steal attention.'
    ];

    let idx = 0;

    function renderSentence(i, instant = false) {
      const text = sentences[i];
      const parts = text.split(/(\s+)/);
      const html = parts.map(part => {
        if (/^\s+$/.test(part)) return part;
        return `<span class="word">${part}</span>`;
      }).join('');
      p.innerHTML = html;

      const w = p.querySelectorAll('.word');
      if (w.length) {
        gsap.fromTo(w, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: instant ? 0 : 0.12 });
      }
    }

    // initial render (slightly delayed so the page feels composed first)
    setTimeout(() => renderSentence(0, true), 320);

    // cycle every ~4s: animate out words, then swap and animate in
    const cycle = () => {
      const currentWords = p.querySelectorAll('.word');
      if (currentWords.length) {
        gsap.to(currentWords, {
          y: -10,
          opacity: 0,
          duration: 0.28,
          ease: 'power1.in',
          stagger: 0.02,
          onComplete: () => {
            idx = (idx + 1) % sentences.length;
            renderSentence(idx);
          }
        });
      } else {
        idx = (idx + 1) % sentences.length;
        renderSentence(idx);
      }
    };

    const interval = setInterval(cycle, 4000);
    // store interval on element so it can be cleared if needed later
    p.__rotateInterval = interval;
  }
});
