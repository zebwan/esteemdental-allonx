/* Text entry kit: heading wipe, badge bar, rolling counter. Plain JS, no dependencies.
   Include once, after the markup:  <script src="text-entry.js"></script>
   Re-run on new content with  TextEntry.init(rootElement)  */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.76,0,.24,1)";

  function lines(el) { // split an element's content on <br> into line strings of HTML
    return el.innerHTML.split(/<br\s*\/?>/i).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function onView(el, threshold, fn) {
    if (!("IntersectionObserver" in window)) { fn(el); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(el); } });
    }, { threshold: threshold });
    io.observe(el);
  }

  /* Heading wipe. Each line gets two bars: bar 1 sweeps in and covers the text, bar 2 follows,
     then both leave to the right and uncover it. 2s per line, lines start 0.2s apart.
     Options: data-wipe-duration="2" (seconds), data-wipe-stagger="0.2", data-wipe-amount="0.35" */
  function wipe(el) {
    if (el.dataset.teDone) return; el.dataset.teDone = "1";
    var dur = parseFloat(el.getAttribute("data-wipe-duration")) * 1000 || 2000;
    var stagger = parseFloat(el.getAttribute("data-wipe-stagger"));
    if (isNaN(stagger)) stagger = .2;
    var amount = parseFloat(el.getAttribute("data-wipe-amount")) || .35;
    el.innerHTML = lines(el).map(function (h) {
      return '<span class="te-line"><span class="te-text">' + h + '</span><i class="te-b1"></i><i class="te-b2"></i></span>';
    }).join("");
    if (reduce || !Element.prototype.animate) return;
    [].forEach.call(el.querySelectorAll(".te-line"), function (line, i) {
      onView(line, amount, function () {
        var x = function (v) { return "translateX(" + v + "%)"; }, d = i * stagger * 1000;
        line.querySelector(".te-b1").animate([
          { transform: x(-100), offset: 0, easing: EASE }, { transform: x(0), offset: .25, easing: EASE },
          { transform: x(0), offset: .8, easing: EASE }, { transform: x(100), offset: 1 }
        ], { duration: dur, delay: d, fill: "forwards" });
        line.querySelector(".te-b2").animate([
          { transform: x(-100), offset: 0, easing: EASE }, { transform: x(-100), offset: .15, easing: EASE },
          { transform: x(0), offset: .4, easing: EASE }, { transform: x(0), offset: .6, easing: EASE },
          { transform: x(100), offset: .82, easing: EASE }, { transform: x(100), offset: 1 }
        ], { duration: dur, delay: d, fill: "forwards" });
      });
    });
  }

  /* Badge: a bar grows in from the left behind each line (0.5s) and the text changes colour.
     Fires when the whole badge is visible. */
  function badge(el) {
    if (el.dataset.teDone) return; el.dataset.teDone = "1";
    el.innerHTML = lines(el).map(function (h) { return '<span class="te-bl"><i></i><b>' + h + "</b></span>"; }).join("");
    onView(el, 1, function () { el.classList.add("te-in"); });
  }

  /* Rolling counter: each digit is a 0-9 column that rolls to its value, digits 0.08s apart.
     data-count="442" data-suffix="+" data-prefix="RM"  (size follows the element's font-size) */
  function counter(el) {
    if (el.dataset.teDone) return; el.dataset.teDone = "1";
    var v = el.getAttribute("data-count"), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    el.setAttribute("aria-label", pre + v + suf);
    var col = "<span class=\"te-col\">" + "0123456789".split("").map(function (n) { return "<span>" + n + "</span>"; }).join("") + "</span>";
    el.innerHTML = (pre ? "<span aria-hidden=\"true\">" + pre + "</span>" : "") +
      v.split("").map(function (c) { return /\d/.test(c) ? '<span class="te-dg" data-d="' + c + '" aria-hidden="true">' + col + "</span>" : '<span aria-hidden="true">' + c + "</span>"; }).join("") +
      (suf ? "<span aria-hidden=\"true\">" + suf + "</span>" : "");
    var roll = function () {
      [].forEach.call(el.querySelectorAll(".te-dg"), function (dg, i) {
        var c = dg.firstElementChild;
        c.style.transitionDelay = (i * .08) + "s";
        c.style.transform = "translateY(" + (-dg.getAttribute("data-d")) + "em)";
      });
    };
    if (reduce) roll(); else onView(el, .5, roll);
  }

  function init(root) {
    root = root || document;
    [].forEach.call(root.querySelectorAll("[data-wipe]"), wipe);
    [].forEach.call(root.querySelectorAll("[data-badge]"), badge);
    [].forEach.call(root.querySelectorAll("[data-count]"), counter);
  }
  window.TextEntry = { init: init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
