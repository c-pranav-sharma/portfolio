/* ==========================================================================
   C. Pranav Sharma — portfolio interactions
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------- Theme ---------- */
  const themeToggle = $('#themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fcfcfd' : '#0a0b0d');
  }

  const stored = (function () {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  })();

  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const panel   = $('#mobilePanel');

  if (menuBtn && panel) {
    const setMenu = (open) => {
      panel.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };

    menuBtn.addEventListener('click', () => setMenu(!panel.classList.contains('open')));
    panel.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 780) setMenu(false); });
  }

  /* ---------- Nav state + scroll progress ---------- */
  const nav      = $('#nav');
  const progress = $('#scrollProgress');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealables = $$('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-links a');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Copy email ---------- */
  const pill = $('#emailPill');
  const hint = $('#copyHint');
  const EMAIL = 'pranavsharma.chouduru@gmail.com';

  function flashCopied() {
    if (!pill || !hint) return;
    pill.classList.add('copied');
    hint.textContent = 'copied';
    setTimeout(() => {
      pill.classList.remove('copied');
      hint.textContent = 'copy';
    }, 1800);
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  if (pill) {
    pill.addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(EMAIL)
          .then(flashCopied)
          .catch(() => { if (legacyCopy(EMAIL)) flashCopied(); });
      } else if (legacyCopy(EMAIL)) {
        flashCopied();
      }
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
