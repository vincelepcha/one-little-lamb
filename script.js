/* One Little Lamb: page turning, slow reveals, the end screen, and the screen wake lock.
   No tracking, no cookies, no storage, no network calls beyond the site's own files. */
(function () {
  "use strict";

  var COVER = 0, END = 9, DEDICATION = 10;
  var TURN_PAUSE = 900;          // ms: ignore a second turn this soon, so small fingers can't race ahead
  var FIRST_DELAY = 700;         // ms before the first item appears
  var STEP = 1200;               // ms between items, unless a page sets data-step
  var END_SLEEP_AFTER = 16000;   // ms on the End page before it fades to near-black
  var EGG_TAPS = 5, EGG_WINDOW = 3000;

  var stages = ["dusk", "dusk", "dusk", "twilight", "twilight", "night", "night", "deep", "deep", "end", "end"];
  var themeColors = ["#F6C9A8", "#F2BFA3", "#EDB3A0", "#7D71A9", "#716A9F", "#3E4A80", "#333E74", "#1A2048", "#12163A", "#0E1230", "#0E1230"];

  var body = document.body;
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var skies = Array.prototype.slice.call(document.querySelectorAll(".sky[data-sky]"));
  var hush = document.querySelector(".sky-hush");
  var nextBtn = document.getElementById("next");
  var backBtn = document.getElementById("back");
  var againBtn = document.getElementById("again");
  var announce = document.getElementById("announce");
  var one = document.getElementById("one");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function calm() { return !!(reduceMotion && reduceMotion.matches); }

  var current = -1;
  var lastTurn = 0;
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- Wake lock: keep the screen on while reading ---------- */

  var wakeLock = null, wantAwake = true;

  function keepAwake() {
    wantAwake = true;
    if (wakeLock || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try {
      navigator.wakeLock.request("screen").then(function (lock) {
        wakeLock = lock;
        lock.addEventListener("release", function () { wakeLock = null; });
        if (!wantAwake) letSleep();
      }).catch(function () {});
    } catch (e) {}
  }

  function letSleep() {
    wantAwake = false;
    if (wakeLock) {
      try { wakeLock.release().catch(function () {}); } catch (e) {}
      wakeLock = null;
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && wantAwake) keepAwake();
  });

  /* ---------- Address per page (#page-3) ---------- */

  function hashFor(i) {
    if (i === COVER) return "";
    if (i === END) return "#end";
    return "#page-" + i;
  }

  function indexFromHash() {
    var h = (location.hash || "").toLowerCase();
    if (h === "#end") return END;
    var m = /^#page-(\d+)$/.exec(h);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n >= 1 && n <= 8) return n;
    }
    return COVER;
  }

  function setAddress(i) {
    if (i === DEDICATION) return; // the dedication keeps no address of its own
    try {
      history.replaceState(null, "", location.pathname + location.search + hashFor(i));
    } catch (e) {}
  }

  /* ---------- Showing a page ---------- */

  function resetPage(page) {
    page.classList.remove("is-hushed", "is-asleep");
    Array.prototype.forEach.call(page.querySelectorAll(".c"), function (el) { el.classList.remove("on"); });
  }

  function reveal(page, i) {
    var nums = Array.prototype.slice.call(page.querySelectorAll(".num .c"));
    var items = Array.prototype.slice.call(page.querySelectorAll(".art .c"));
    var step = parseInt(page.getAttribute("data-step"), 10) || STEP;
    var first = parseInt(page.getAttribute("data-first"), 10) || (FIRST_DELAY + nums.length * 1300);
    var done = 0;

    function schedule(list, start, gap) {
      list.forEach(function (el, n) {
        if (calm()) { el.classList.add("on"); return; }
        var t = start + n * gap;
        done = Math.max(done, t);
        later(function () { el.classList.add("on"); }, t);
      });
    }
    schedule(nums, FIRST_DELAY, 1300);
    schedule(items, first, step);
    done += calm() ? 0 : 2000;

    if (i === 8) later(function () { page.classList.add("is-hushed"); }, done + 2500);
    if (i === END) later(fallAsleep, Math.max(done, END_SLEEP_AFTER));
  }

  function fallAsleep() {
    if (current !== END) return;
    pages[END].classList.add("is-asleep");
    body.classList.add("is-asleep");
    hush.classList.add("is-on");
    letSleep(); // the book has finished; the phone may sleep now
  }

  function show(i) {
    if (i === current) return;
    var prev = current;
    current = i;
    clearTimers();

    pages.forEach(function (page, n) {
      var on = n === i;
      page.classList.toggle("is-current", on);
      if (on) page.removeAttribute("inert"); else page.setAttribute("inert", "");
      page.setAttribute("aria-hidden", on ? "false" : "true");
    });
    if (prev >= 0) {
      var old = pages[prev];
      setTimeout(function () { if (current !== prev) resetPage(old); }, 800);
    }

    var skyIndex = Math.min(i, END);
    skies.forEach(function (s, n) { s.classList.toggle("is-on", n === skyIndex); });
    hush.classList.remove("is-on");
    body.classList.remove("is-asleep");

    body.setAttribute("data-stage", stages[i]);
    body.setAttribute("data-page", String(i));
    if (themeMeta) themeMeta.setAttribute("content", themeColors[i]);

    nextBtn.textContent = i === COVER ? "Start" : "Next";
    nextBtn.hidden = i >= END;
    againBtn.hidden = i !== END;
    backBtn.hidden = i === COVER || i === DEDICATION;

    resetEgg();
    setAddress(i);
    keepAwake();
    reveal(pages[i], i);

    var label = i === COVER ? "" : (pages[i].querySelector(".line, .dedication-text") || {}).textContent || "";
    announce.textContent = label.replace(/\s+/g, " ").trim();

    if (i === DEDICATION) {
      var link = document.getElementById("back-to-book");
      setTimeout(function () { try { link.focus({ preventScroll: true }); } catch (e) {} }, 50);
    } else if (document.activeElement && (document.activeElement.hidden || pages[DEDICATION].contains(document.activeElement))) {
      var target = !nextBtn.hidden ? nextBtn : againBtn;
      try { target.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  function turn(delta) {
    if (current === DEDICATION) return;
    var now = Date.now();
    if (now - lastTurn < TURN_PAUSE) return;
    var i = current + delta;
    if (i < COVER || i > END) return;
    lastTurn = now;
    show(i);
  }

  nextBtn.addEventListener("click", function () { turn(1); });
  backBtn.addEventListener("click", function () { turn(-1); });
  againBtn.addEventListener("click", function () { lastTurn = Date.now(); show(COVER); });
  document.getElementById("back-to-book").addEventListener("click", function () { lastTurn = Date.now(); show(END); });

  /* Arrow keys on a laptop */
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
    else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (current === DEDICATION) show(END); else turn(-1);
    }
  });

  /* Swipe: only a clear, quick sideways stroke turns the page. Taps do nothing. */
  var book = document.getElementById("book");
  var start = null;
  book.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || !e.isPrimary) { start = null; return; }
    start = { x: e.clientX, y: e.clientY, t: Date.now() };
  });
  book.addEventListener("pointercancel", function () { start = null; });
  book.addEventListener("pointerup", function (e) {
    if (!start) return;
    var dx = e.clientX - start.x, dy = e.clientY - start.y, dt = Date.now() - start.t;
    start = null;
    if (dt > 800 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    turn(dx < 0 ? 1 : -1);
  });

  /* ---------- The hidden dedication ---------- */

  var taps = [], eggTimer = null;

  function resetEgg() {
    taps = [];
    clearTimeout(eggTimer);
    one.style.setProperty("--glow", "0");
    one.classList.remove("is-tapped");
  }

  one.addEventListener("click", function () {
    if (current !== END) return;
    var now = Date.now();
    taps = taps.filter(function (t) { return now - t < EGG_WINDOW; });
    taps.push(now);
    one.classList.add("is-tapped");
    one.style.setProperty("--glow", String(taps.length));
    clearTimeout(eggTimer);
    if (taps.length >= EGG_TAPS) {
      setTimeout(function () { show(DEDICATION); }, 700);
      return;
    }
    eggTimer = setTimeout(resetEgg, EGG_WINDOW);
  });

  /* ---------- Start ---------- */

  window.addEventListener("hashchange", function () {
    var i = indexFromHash();
    if (i !== current) show(i);
  });

  pages.forEach(function (p) { p.classList.remove("is-current"); });
  show(indexFromHash());

  /* Offline reading after the first visit */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
