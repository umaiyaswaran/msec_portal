/* ==============================
   MSEC Landing Page — Optimized JS
   ============================== */

(() => {
  'use strict';

  // ===== DETECT DEVICE =====
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== LOADER =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, prefersReducedMotion ? 200 : 1000);
  });

  // ===== PARTICLES (Optimized) =====
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animFrameId;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 200);
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 187 : 262;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,70%,${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    // Reduce count on mobile for performance
    const base = isMobile ? 25000 : 10000;
    const maxCount = isMobile ? 50 : 120;
    const count = Math.min(Math.floor((w * h) / base), maxCount);
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  // Only draw connecting lines on desktop
  function drawLines() {
    if (isMobile || isSmallScreen) return;
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy; // skip sqrt for perf
        if (dist < maxDist * maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - dist / (maxDist * maxDist))})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  // Throttle animation on mobile
  let lastFrame = 0;
  const frameInterval = isMobile ? 32 : 16; // ~30fps on mobile, 60fps on desktop

  function animateParticles(timestamp) {
    if (prefersReducedMotion) return;
    animFrameId = requestAnimationFrame(animateParticles);
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawLines();
  }

  if (!prefersReducedMotion) {
    animFrameId = requestAnimationFrame(animateParticles);
  }

  // Pause particles when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else if (!prefersReducedMotion) {
      animFrameId = requestAnimationFrame(animateParticles);
    }
  });

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL =====
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

  // ===== MODAL =====
  const portalData = {
    academics: {
      title: 'MSEC Academics',
      desc: 'The MSEC Academics portal is a comprehensive digital platform for managing all academic activities. Students can view their attendance records, check marks and grades, access timetables, and track their academic progress throughout the semester.',
      badge: 'Academics',
      link: 'https://msec-academics.vercel.app/login'
    },
    leave: {
      title: 'MSEC Leave Late Portal',
      desc: 'The Leave & Late Portal streamlines the process of submitting leave requests and late entry applications. Students can request permission digitally, upload supporting documents, and track the approval status in real time.',
      badge: 'Leave & Late',
      link: 'https://msec-academics.vercel.app/login'
    },
    hall: {
      title: 'MSEC Hall Booking',
      desc: 'The Hall Booking portal allows students and faculty to reserve seminar halls, classrooms, and event spaces for academic and cultural events. The system provides real-time availability and instant confirmation.',
      badge: 'Hall Booking',
      link: 'https://msec-connect.vercel.app/'
    }
  };

  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalBadge = document.getElementById('modalBadge');
  const modalLink = document.getElementById('modalLink');

  function openModal(key) {
    const data = portalData[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalBadge.textContent = data.badge;
    modalLink.href = data.link;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portal-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-card')) return;
      openModal(card.dataset.portal);
    });
  });

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ===== COUNTERS =====
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
      const offset = 283 - (283 * (targets[i] / (targets[i] * 1.2)));
      setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
    });
  }

  if (counterSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounters(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    obs.observe(counterSection);
  }

  // ===== SMOOTH SCROLL =====
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
