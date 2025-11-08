// GSAP ScrollTrigger animations - SIMPLIFIED
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  console.log('🎬 Initializing scroll animations...');
  
  const canvas = document.getElementById('canvas');
  console.log('🎨 Canvas found:', canvas);
  
  // Canvas stays fixed through sections 1, 2, 3
  // Scales down when section 4 (contact) appears
  gsap.to(canvas, {
    scale: 0.3,
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      markers: true,
      onUpdate: (self) => {
        console.log('Canvas scale:', Math.round(self.progress * 100) + '%');
      }
    }
  });
  
  console.log('✅ Canvas animation ready');

  setTimeout(() => ScrollTrigger.refresh(), 100);
}
