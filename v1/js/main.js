/* ============================================================
   Esteem Dental — All-on-X
   Motion reproduced from the Dentistry X Framer template:
   · reveal        opacity 0→1 + translateY(100px)→0, 0.1s stagger
   · pop           scale(0)→scale(1) for icons
   · nav           fixed, hides on scroll down, blurs once scrolled
   · pinned tracks sticky section + translateX smoothed with a lerp
   · text reveal   word-by-word opacity .4→1 across scroll progress
   · accordions    numbered list + FAQ
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Lenis smooth scrolling ---------- */
  var lenis = null;
  if (!reduced && typeof Lenis === 'function') {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 1. Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-fade, .pop');
  if (reduced) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });

    /* Anything already on screen at load reveals straight away — the negative
       rootMargin above would otherwise hold back content sitting low in the
       first viewport (the hero sits at the bottom of a 900px stage). */
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    });

    /* auto 0.1s stagger ladder for siblings with no explicit --d */
    document.querySelectorAll('.rows, .cta-cards, .care-cards').forEach(function (group) {
      var i = 0;
      group.querySelectorAll(':scope > .reveal').forEach(function (el) {
        if (!el.style.getPropertyValue('--d')) {
          el.style.setProperty('--d', (i * 0.1).toFixed(1) + 's');
          i++;
        }
      });
    });
  }

  /* ---------- 2. Nav ---------- */
  var navWrap = document.getElementById('navWrap');
  var lastY = window.scrollY, navTicking = false;
  function onNavScroll() {
    var y = window.scrollY;
    navWrap.classList.toggle('scrolled', y > 10);
    if (!navWrap.classList.contains('open')) {
      if (y > lastY && y > 200) navWrap.classList.add('hidden');
      else navWrap.classList.remove('hidden');
    }
    lastY = y; navTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!navTicking) { requestAnimationFrame(onNavScroll); navTicking = true; }
  }, { passive: true });

  /* ---------- 3. Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var panel = document.getElementById('mobilePanel');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = navWrap.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) { open ? lenis.stop() : lenis.start(); }
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navWrap.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });
  }

  /* ---------- 4. Accordions (numbered list + FAQ) ---------- */
  function wireAccordion(btnSel, itemSel) {
    document.querySelectorAll(btnSel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest(itemSel);
        var wasOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll(itemSel + '.open').forEach(function (o) {
          o.classList.remove('open');
        });
        if (!wasOpen) item.classList.add('open');
      });
    });
  }
  wireAccordion('.acc-q', '.acc-item');
  wireAccordion('.faq-q', '.faq-item');

  /* ---------- 5. Card sliders ----------
     The template pins these sections and scrubs them with the page scroll.
     Here they are ordinary sliders — arrows, drag and snap — so nobody has
     to scroll through a carousel to reach the next section. */
  document.querySelectorAll('[data-track]').forEach(function (track) {
    var section = track.closest('section');
    var btns = section ? section.querySelectorAll('.sld-btn') : [];

    function step() {
      var first = track.firstElementChild;
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      return first.getBoundingClientRect().width + gap;
    }
    function sync() {
      var max = track.scrollWidth - track.clientWidth - 1;
      btns.forEach(function (b) {
        var dir = +b.dataset.dir;
        b.disabled = dir < 0 ? track.scrollLeft <= 1 : track.scrollLeft >= max;
      });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: +b.dataset.dir * step(), behavior: reduced ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();

    /* pointer drag for mouse users (touch already pans natively) */
    var down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0;
      startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startLeft - dx;
    });
    function release() {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
      sync();
    }
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('pointerleave', release);
    /* swallow the click that ends a drag so cards do not navigate */
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  /* ---------- 6. Word-by-word text reveal ----------
     Template values: opacity .4 → 1, scroll offset "start 1 → end .3" */
  var trNodes = document.querySelectorAll('[data-reveal-text]');
  if (trNodes.length && !reduced) {
    trNodes.forEach(function (node) {
      var words = node.textContent.split(/(\s+)/);
      node.textContent = '';
      words.forEach(function (w) {
        if (!w.trim()) { node.appendChild(document.createTextNode(w)); return; }
        var s = document.createElement('span');
        s.className = 'tr-word';
        s.textContent = w;
        node.appendChild(s);
      });
    });
    var trTicking = false;
    function paintText() {
      trNodes.forEach(function (node) {
        var r = node.getBoundingClientRect();
        var vh = window.innerHeight;
        var start = vh, end = vh * 0.3;
        var p = (start - r.top) / Math.max(1, (start - end) + r.height);
        p = Math.min(1, Math.max(0, p));
        var spans = node.querySelectorAll('.tr-word');
        var n = spans.length;
        spans.forEach(function (s, i) {
          var a = i / n, b = (i + 1) / n;
          var local = Math.min(1, Math.max(0, (p - a) / Math.max(0.0001, b - a)));
          s.style.opacity = (0.4 + 0.6 * local).toFixed(3);
        });
      });
      trTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!trTicking) { requestAnimationFrame(paintText); trTicking = true; }
    }, { passive: true });
    window.addEventListener('resize', paintText, { passive: true });
    paintText();
  }

  /* ---------- 7. Anchor offset for the fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      } else {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: reduced ? 'auto' : 'smooth'
        });
      }
    });
  });

})();
