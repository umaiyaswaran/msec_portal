/* ========================================
   MSEC Landing Page — Optimized JS
   ======================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== LOADER ===== */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.body.classList.remove('loading');
      document.documentElement.classList.remove('loading');
    }, prefersReducedMotion ? 200 : 1400);
  });

  /* ===== HEADER SCROLL ===== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ===== HAMBURGER ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('no-scroll', isActive);
    document.documentElement.classList.toggle('no-scroll', isActive);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    });
  });

  /* ===== SCROLL REVEAL ===== */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ===== COUNTERS ===== */
  const counterSection = document.querySelector('.about-counters');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.counter-number').forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target.toLocaleString() + '+';
      }
      requestAnimationFrame(tick);
    });

    document.querySelectorAll('.ring-fill').forEach((ring, i) => {
      const targets = [1500, 120, 10];
      const maxVal = targets[i] * 1.2;
      const circumference = 326.7;
      const offset = circumference - (circumference * (targets[i] / maxVal));
      setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
    });
  }

  if (counterSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(counterSection);
  }

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = header.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
