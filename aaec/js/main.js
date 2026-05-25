/* AAEC — main.js — Production v1.0 */
(function () {
  'use strict';

  /* ── Mobile nav ── */
  const burger  = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-menu');
  const shade   = document.querySelector('.nav-shade');

  function openNav()  { burger.classList.add('open'); navMenu.classList.add('open'); shade.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeNav() { burger.classList.remove('open'); navMenu.classList.remove('open'); shade.classList.remove('open'); document.body.style.overflow=''; }

  if (burger) {
    burger.addEventListener('click', () => burger.classList.contains('open') ? closeNav() : openNav());
    shade.addEventListener('click', closeNav);
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function setActive() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  /* ── Scroll-reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  /* ── Scroll-to-top button ── */
  const scrollBtn = document.querySelector('.scroll-top');
  function handleScroll() {
    if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 400);
    setActive();
  }
  if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── Smooth anchor scroll (offset for sticky nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('.nav').offsetHeight + 8;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ── Lazy-load images ── */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; });
  } else {
    const lazyObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.src = e.target.dataset.src; lazyObs.unobserve(e.target); } });
    });
    document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));
  }

  /* ── Stats counter animation ── */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const val = Math.floor(progress * target);
      el.textContent = (val > 0 && target > 1 ? '+' + val : val > 0 ? val : el.dataset.val) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (target > 1 ? '+' + target : target) + suffix;
    };
    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    let counted = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat h2[data-count]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        });
      }
    }, { threshold: 0.5 }).observe(statsSection);
  }

})();
