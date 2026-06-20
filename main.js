/* ===========================================
   MOONLINE MEDIA — MAIN JS (multi-page site)
   Vanilla JS only. No dependencies.
=========================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================
     1. SCROLL PROGRESS BAR
  ========================================= */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* =========================================
     2. NAVBAR SCROLL STATE + MOBILE MENU
  ========================================= */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 40) navbar.classList.add('is-scrolled');
      else navbar.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!navToggle || !mobileNav) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function openMobile() {
      mobileNav.classList.add('is-open');
      backdrop.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMobile() {
      mobileNav.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      isOpen ? closeMobile() : openMobile();
    });
    backdrop.addEventListener('click', closeMobile);
    mobileNav.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', closeMobile);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobile();
    });
  }

  /* =========================================
     3. SMOOTH SCROLL FOR IN-PAGE ANCHORS ONLY
     (anchors like "services.html#creative" navigate
     normally to the new page; only same-page "#id"
     links get smooth-scroll treatment.)
  ========================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 86;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* =========================================
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
  ========================================= */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .fade-in, .scale-in');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const groups = {};
    revealEls.forEach((el) => {
      const parentKey = el.closest('section') ? (el.closest('section').id || 'global') : 'global';
      groups[parentKey] = groups[parentKey] || [];
      groups[parentKey].push(el);
    });
    Object.values(groups).forEach((group) => {
      group.forEach((el, i) => {
        if (el.style.getPropertyValue('--stagger')) return; // respect manually-set stagger
        el.style.setProperty('--stagger', Math.min(i * 0.07, 0.35) + 's');
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));

    // Hero elements reveal immediately on load, not gated by scroll.
    // Individual timing is handled by each element's CSS --stagger value.
    document.querySelectorAll('.hero .reveal-up').forEach((el) => {
      observer.unobserve(el);
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  }

  /* =========================================
     5. ANIMATED COUNTERS
  ========================================= */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = prefix + target + suffix;
      }
      if (reduceMotion) el.textContent = prefix + target + suffix;
      else requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  /* =========================================
     6. FAQ ACCORDION
  ========================================= */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        document.querySelectorAll('.faq-question').forEach((b) => {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling.style.maxHeight = null;
        });

        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* =========================================
     7. CONTACT FORM VALIDATION + REAL SUBMIT
     Sends the message to the site owner's inbox via
     FormSubmit (https://formsubmit.co) — no backend
     required. Falls back to a normal form POST if the
     fetch call is blocked for any reason.
  ========================================= */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const success = document.getElementById('formSuccess');
    const errorBanner = document.getElementById('formError');
    const submitBtn = form.querySelector('.form-submit');

    function setError(input, message) {
      const group = input.closest('.form-group');
      const errorEl = form.querySelector(`.form-error[data-for="${input.id}"]`);
      if (message) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = message;
      } else {
        group.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
      }
    }

    function validate() {
      let valid = true;
      const name = form.querySelector('#cf-name');
      const email = form.querySelector('#cf-email');
      const message = form.querySelector('#cf-message');

      if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false; }
      else setError(name, '');

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        setError(email, 'Please enter a valid email address.');
        valid = false;
      } else setError(email, '');

      if (!message.value.trim() || message.value.trim().length < 10) {
        setError(message, 'Tell us a little more (10+ characters).');
        valid = false;
      } else setError(message, '');

      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      if (errorBanner) errorBanner.classList.remove('is-visible');

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then((res) => {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          if (res.ok) {
            success.classList.add('is-visible');
            form.reset();
            setTimeout(() => success.classList.remove('is-visible'), 6000);
          } else {
            throw new Error('Non-OK response from form endpoint');
          }
        })
        .catch(() => {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          // Fallback: do a normal (non-AJAX) form submit so the
          // message still reaches the owner's inbox even if the
          // fetch call was blocked (e.g. by an ad blocker). The
          // plain POST flow uses FormSubmit's standard endpoint
          // rather than the /ajax/ variant.
          if (errorBanner) {
            errorBanner.classList.add('is-visible');
          }
          form.action = form.action.replace('/ajax/', '/');
          HTMLFormElement.prototype.submit.call(form);
        });
    });

    ['cf-name', 'cf-email', 'cf-message'].forEach((id) => {
      const el = form.querySelector('#' + id);
      if (el) el.addEventListener('input', () => setError(el, ''));
    });
  }

  /* =========================================
     8. BACK TO TOP
  ========================================= */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* =========================================
     9. FOOTER YEAR
  ========================================= */
  function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =========================================
     10. HERO PARALLAX (desktop only, subtle)
  ========================================= */
  function initHeroParallax() {
    const stack = document.querySelector('.hero-visual-stack');
    const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth <= 980;
    if (!stack || isTouch || reduceMotion) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const rect = stack.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientX - cx) / rect.width) * 14;
      targetY = ((e.clientY - cy) / rect.height) * 14;
    });

    function animate() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      stack.style.transform = `rotateY(${curX}deg) rotateX(${-curY}deg)`;
      requestAnimationFrame(animate);
    }
    stack.style.transformStyle = 'preserve-3d';
    animate();
  }

  /* =========================================
     11. HERO VIDEO FALLBACK SAFETY NET
     If the hero video hasn't started playing within
     a few seconds (blocked, slow, or unreachable CDN),
     fall back to the gradient panel instead of a stalled
     black box.
  ========================================= */
  function initHeroVideoFallback() {
    const panel = document.getElementById('heroVideoPanel');
    const video = panel ? panel.querySelector('video') : null;
    if (!panel || !video) return;

    let started = false;
    video.addEventListener('playing', () => { started = true; });

    setTimeout(() => {
      if (!started) panel.classList.add('video-fallback');
    }, 4000);
  }

  /* =========================================
     INIT ALL
  ========================================= */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initFAQ();
    initContactForm();
    initBackToTop();
    initFooterYear();
    initHeroParallax();
    initHeroVideoFallback();
  });
})();
