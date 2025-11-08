// GSAP ScrollTrigger animations for all sections
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // ===========================
  // Intro Section: Text Fade In
  // ===========================
  gsap.to('.intro-title', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.intro-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.intro-text', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.intro-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // ===========================
  // Image Movement Through Sections
  // ===========================
  const imageContainer = document.getElementById('imageContainer');
  
  gsap.to(imageContainer, {
    x: '50vw',
    scrollTrigger: {
      trigger: '.intro-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // ===========================
  // Frontend Section: Animations
  // ===========================
  gsap.to('.frontend-section .section-title', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.frontend-section',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.frontend-section .skill-item', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.frontend-section',
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  });

  // ===========================
  // Backend Section: Animations
  // ===========================
  gsap.to('.backend-section .section-title', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.backend-section',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.backend-section .skill-item', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.backend-section',
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  });

  // ===========================
  // Footer: Final Animation
  // ===========================
  const footer = document.getElementById('footer');
  
  gsap.to(footer, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: footer,
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  });

  // Refresh ScrollTrigger to ensure proper positioning
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}