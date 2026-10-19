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

  /* ---------- 5. Tab groups + patient carousel ---------- */

  /* a) parts of the treatment */
  var FEATURES = [
    ['How the pieces work together.',
     'Implants sit in the jawbone and support a connected set of replacement teeth. The implants, your new teeth and your bite need to be planned together \u2014 not as separate parts.',
     'assets/img/step-2.webp', 'A connected full-arch restoration supported by implants', true],
    ['The implant.',
     'Titanium dental implants are placed in the jawbone to support the connected replacement teeth. During healing, the surrounding bone integrates with the implants to provide a stable foundation.',
     'assets/img/fan-fixture.webp', 'A single titanium implant seated in the jawbone'],
    ['A connected set of teeth.',
     'The replacement teeth are made as one connected full-arch restoration. High-strength zirconia is used for its strength, durability and natural appearance.',
     'assets/img/step-4.webp', 'A connected full arch of replacement teeth'],
    ['What does \u201cX\u201d mean?',
     'The \u201cX\u201d refers to the number of implants used to support the full arch. Commonly, four or six implants may be used, depending on the individual treatment plan.',
     'assets/img/hero.jpg', 'A full-arch bridge supported by multiple implants']
  ];

  /* b) treatment stages */
  var STEPS = [
    ['Understand your starting point.',
     'A clinical examination, CBCT scan and digital scans provide a detailed view of your teeth, gums, jawbone and bite. These records allow the implant positions and replacement teeth to be planned together before surgery, with your anatomy, function and final restoration considered from the beginning.',
     'assets/img/step-1.jpg', 'A 3D scan reviewed for digital planning'],
    ['Implant surgery based on your treatment plan.',
     'The implants are placed during one surgical appointment. A custom-made surgical guide or dynamic navigation may be used to help the dentist place the implants according to the digital plan with greater precision.',
     'assets/img/step-3.jpg', 'Guided implant placement during surgery'],
    ['Temporary fixed teeth may be fitted on the same day.',
     'When conditions allow, temporary fixed teeth can be fitted on the same day as implant surgery, so you can have fixed teeth while the implants heal.',
     'assets/img/fan-sameday.jpg', 'A fixed temporary bridge in place on the implants'],
    ['Allow time for healing.',
     'Over the following months, the implants integrate with the surrounding bone while the gum tissues heal and adapt.',
     'assets/img/fan-healing.jpg', 'How an implant integrates with the jawbone'],
    ['Fit and maintain the final teeth.',
     'When healing and clinical checks indicate readiness, the final full-arch restoration can be fitted. Its design considers appearance, bite, function and cleaning access. Regular professional maintenance remains important after treatment.',
     'assets/img/step-5.jpg', 'The finished full-arch restoration in place']
  ];

  function wireTabs(btnSel, data, els, onIndex) {
    var btns = [].slice.call(document.querySelectorAll(btnSel));
    if (!btns.length || !els.img) return;
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-on')) return;
        btns.forEach(function (b) { b.classList.remove('is-on'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('is-on'); btn.setAttribute('aria-selected', 'true');
        var d = data[i];
        /* fade out, swap, fade back in — a crossfade reads calmer than a jump */
        els.media.classList.add('swap'); els.copy.classList.add('swap');
        setTimeout(function () {
          els.title.textContent = d[0];
          els.desc.textContent = d[1];
          var vid = document.getElementById('featVid');
          if (vid && els.img.id === 'featImg') {
            /* the clinic's clip is only 412x224, so it is shown here at close to
               its own size rather than blown up across the hero */
            var useVideo = !!d[4];
            vid.hidden = !useVideo;
            els.img.hidden = useVideo;
            if (useVideo) { vid.play().catch(function () {}); } else { vid.pause(); }
          }
          els.img.src = d[2];
          els.img.alt = d[3];
          if (onIndex) onIndex(i);
          els.media.classList.remove('swap'); els.copy.classList.remove('swap');
        }, 300);
      });
    });
  }

  wireTabs('.feat-tab', FEATURES, {
    img: document.getElementById('featImg'),
    title: document.getElementById('featTitle'),
    desc: document.getElementById('featDesc'),
    media: document.querySelector('.feat-media'),
    copy: document.querySelector('.feat-copy')
  });

  var stepCount = document.getElementById('stepCount');
  wireTabs('.step-tab', STEPS, {
    img: document.getElementById('stepImg'),
    title: document.getElementById('stepTitle'),
    desc: document.getElementById('stepDesc'),
    media: document.querySelector('.steps-media'),
    copy: document.querySelector('.steps-copy')
  }, function (i) {
    if (stepCount) stepCount.textContent = 'Step ' + (i + 1) + ' of ' + STEPS.length;
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

  /* ---------- 5b. Hero slider ---------- */
  (function () {
    var stage = document.querySelector('[data-hero]');
    if (!stage) return;
    var slides = [].slice.call(stage.querySelectorAll('.hslide'));
    var dots = [].slice.call(stage.querySelectorAll('.hdot'));
    if (slides.length < 2) return;
    var i = 0, timer = null, HOLD = 5600;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (sl, k) {
        var on = k === i;
        sl.classList.toggle('is-on', on);
        var v = sl.querySelector('video');
        if (v) { on ? v.play().catch(function () {}) : v.pause(); }
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-on', k === i);
        d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }
    function start() { if (!reduced) { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, HOLD); } }
    function stop() { clearInterval(timer); }

    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { show(k); start(); });
    });
    stage.addEventListener('pointerenter', stop);
    stage.addEventListener('pointerleave', start);
    /* don't animate a slider nobody is looking at */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.2 }).observe(stage);
    } else { start(); }
    show(0);
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
