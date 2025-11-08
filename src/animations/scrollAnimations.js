// GSAP ScrollTrigger animations for all sections
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // ===========================
  // Section 1 → Section 2: Horizontal Image Movement
  // ===========================
  const imageContainer = document.getElementById('imageContainer');
  
  gsap.to(imageContainer, {
    x: '50vw', // Move image to the right
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      // markers: true // Uncomment for debugging
    }
  });

  // ===========================
  // Section 3: Image Scale Down & Center
  // ===========================
  gsap.to(imageContainer, {
    scale: 0.3,
    x: 0, // Reset horizontal position (center)
    y: 0,
    scrollTrigger: {
      trigger: '#section3',
      start: 'top center',
      end: 'center center',
      scrub: true,
      // markers: true
    }
  });

  // Section 3: Image Scroll Out of View
  gsap.to(imageContainer, {
    y: '-100vh',
    scrollTrigger: {
      trigger: '#section3',
      start: 'center center',
      end: 'bottom top',
      scrub: true,
      // markers: true
    }
  });

  // ===========================
  // Section 3: Text Animate In (Triggered, not scrolled)
  // ===========================
  const section3Text = document.getElementById('section3Text');
  
  gsap.from(section3Text, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#section3',
      start: 'top center',
      toggleActions: 'play none none none'
      // markers: true
    }
  });

  // ===========================
  // Section 4: Columns Animate In from Sides
  // ===========================
  const leftColumn = document.getElementById('leftColumn');
  const rightColumn = document.getElementById('rightColumn');
  
  gsap.to(leftColumn, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#section4',
      start: 'top center',
      toggleActions: 'play none none none'
    }
  });

  gsap.to(rightColumn, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#section4',
      start: 'top center',
      toggleActions: 'play none none none'
    }
  });

  // ===========================
  // Footer: Animate In Last
  // ===========================
  const footer = document.getElementById('footer');
  
  gsap.to(footer, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#section4',
      start: 'center center',
      toggleActions: 'play none none none'
    }
  });
}