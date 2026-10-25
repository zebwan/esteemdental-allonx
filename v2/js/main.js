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
  var revealEls = document.querySelectorAll('.reveal, .reveal-fade, .pop, .slide-r');
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

  /* ---------- 1b. Hero film ----------
     It is muted, looped and inline, so autoplay is allowed - but a tab that
     loads in the background, or a browser that has paused media, leaves it
     stopped. Nudge it on load and whenever the tab comes back. */
  (function () {
    var v = document.querySelector('.hero-media video');
    if (!v) return;
    function nudge() { if (v.paused) { v.play().catch(function () {}); } }
    nudge();
    v.addEventListener('loadeddata', nudge);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) nudge(); });
    window.addEventListener('pageshow', nudge);
  })();

  /* ---------- 1c. Button icons and WhatsApp labels ----------
     The arrows are decoration, so hide them from the accessible name. The
     label on a WhatsApp button says what it is for rather than where it
     goes, so the accessible name adds that - unless it already says so. */
  [].forEach.call(document.querySelectorAll('.btn > i, .nav-link-cta .arr'), function (i) {
    i.setAttribute('aria-hidden', 'true');
  });
  [].forEach.call(document.querySelectorAll('a[data-wa]'), function (a) {
    if (a.getAttribute('aria-label')) return;
    /* textContent still carries the arrow, aria-hidden or not, so read the
       link without its icon */
    var copy = a.cloneNode(true);
    [].forEach.call(copy.querySelectorAll('i, .arr'), function (n) { n.remove(); });
    var label = (copy.textContent || '').replace(/\s+/g, ' ').trim();
    a.setAttribute('aria-label', /whatsapp/i.test(label) ? label : label + ' on WhatsApp');
  });

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

  /* ---------- 5. Sliders + patient carousel ---------- */

  /* a) one slider for the parts of the treatment and the treatment stages.
        It advances itself, and you can take it over with the dots, the
        arrows, a swipe or the arrow keys. */
  [].forEach.call(document.querySelectorAll('[data-sld]'), function (sld) {
    var track = sld.querySelector('.sld-track');
    var items = [].slice.call(sld.querySelectorAll('.sld-item'));
    var dots  = sld.querySelector('.sld-dots');
    if (!track || items.length < 2) return;

    var i = 0, timer = null;
    var hold = parseInt(sld.getAttribute('data-sld-auto'), 10) || 0;

    items.forEach(function (it, k) {
      it.setAttribute('role', 'group');
      it.setAttribute('aria-roledescription', 'slide');
      it.setAttribute('aria-label', (k + 1) + ' of ' + items.length);
    });

    var buttons = [];
    if (dots) {
      items.forEach(function (it, k) {
        var b = document.createElement('button');
        b.className = 'sld-dot' + (k ? '' : ' is-on');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', k ? 'false' : 'true');
        b.setAttribute('aria-label', 'Go to ' + (k + 1) + ' of ' + items.length);
        b.addEventListener('click', function () { go(k); restart(); });
        dots.appendChild(b);
        buttons.push(b);
      });
    }

    function paint() {
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      buttons.forEach(function (b, k) {
        b.classList.toggle('is-on', k === i);
        b.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      items.forEach(function (it, k) { it.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    }
    function go(n) { i = (n + items.length) % items.length; paint(); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() {
      stop();
      if (hold && !reduced) timer = setInterval(function () { go(i + 1); }, hold);
    }

    sld.querySelectorAll('[data-sld-dir]').forEach(function (b) {
      b.addEventListener('click', function () { go(i + (+b.dataset.sldDir)); restart(); });
    });

    /* hold still while it is being read or pointed at */
    sld.addEventListener('pointerenter', stop);
    sld.addEventListener('pointerleave', restart);
    sld.addEventListener('focusin', stop);
    sld.addEventListener('focusout', restart);

    /* swipe */
    var x0 = null, dx = 0;
    sld.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      x0 = e.clientX; dx = 0; stop();
    });
    sld.addEventListener('pointermove', function (e) { if (x0 !== null) dx = e.clientX - x0; });
    function release() {
      if (x0 === null) return;
      if (Math.abs(dx) > 44) go(i + (dx < 0 ? 1 : -1));
      x0 = null; dx = 0; restart();
    }
    sld.addEventListener('pointerup', release);
    sld.addEventListener('pointercancel', release);

    sld.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(i + 1); restart(); }
      else if (e.key === 'ArrowLeft') { go(i - 1); restart(); }
    });

    paint();
    restart();
  });

  /* c) patient carousel */
  (function () {
    var car = document.querySelector('[data-carousel]');
    if (!car) return;
    var track = car.querySelector('[data-ptrack]');
    var slides = [].slice.call(track.children);
    var now = car.querySelector('[data-pnow]');
    var total = car.querySelector('[data-ptotal]');
    var btns = [].slice.call(car.querySelectorAll('[data-pdir]'));
    var idx = 0;
    if (total) total.textContent = slides.length;

    function paint() {
      if (now) now.textContent = idx + 1;
      btns.forEach(function (b) {
        var d = +b.dataset.pdir;
        b.disabled = d < 0 ? idx === 0 : idx === slides.length - 1;
      });
    }
    function goTo(i) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
      paint();
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { goTo(idx + (+b.dataset.pdir)); });
    });
    /* keep the counter honest if someone swipes instead */
    var t = null;
    track.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var mid = track.scrollLeft + track.clientWidth / 2;
        slides.forEach(function (sl, i) {
          var l = sl.offsetLeft - track.offsetLeft;
          if (mid >= l && mid < l + sl.offsetWidth) { idx = i; }
        });
        paint();
      }, 120);
    }, { passive: true });

    /* pointer drag for mouse users */
    var down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startLeft - dx;
    });
    function release() { if (!down) return; down = false; track.classList.remove('dragging'); }
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('pointerleave', release);
    track.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);

    paint();
    window.addEventListener('resize', paint, { passive: true });
  })();

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
