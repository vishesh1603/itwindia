/* ITW India: menu, scroll effects, counters, charts, carousel, animations and contact form */
(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile menu */
  var menu = d.getElementById("menu"), nav = d.getElementById("nav");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open);
    });
  }

  /* Header size, progress bar, back to top, hero parallax */
  var header = d.querySelector("header"), prog = d.getElementById("prog"), topBtn = d.getElementById("top");
  var heroBg = d.querySelector(".hero .bg, .banner .bg");
  function onScroll() {
    var y = window.scrollY || 0, h = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--hh", (y > 40 ? 72 : 105) + "px");
    if (header) header.classList.toggle("scrolled", y > 10);
    if (prog) prog.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (topBtn) topBtn.classList.toggle("show", y > 500);
    if (heroBg && !reduce) heroBg.style.setProperty("--py", Math.min(y * 0.18, heroBg.parentNode.offsetHeight * 0.09) + "px");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* Hero Slideshow: 4 headers swapping back and forth every 5 seconds */
  var heroSlides = d.querySelectorAll(".hero-slide");
  if (heroSlides.length > 1) {
    var curSlide = 0;
    var slideTimer = null;
    function showSlide(idx) {
      for (var i = 0; i < heroSlides.length; i++) {
        heroSlides[i].classList.toggle("active", i === idx);
      }
      curSlide = idx;
    }
    function nextSlide() {
      showSlide((curSlide + 1) % heroSlides.length);
    }
    if (!reduce) {
      slideTimer = setInterval(nextSlide, 5000);
      var heroSec = d.querySelector(".hero");
      if (heroSec) {
        heroSec.addEventListener("mouseenter", function () {
          if (slideTimer) clearInterval(slideTimer);
        });
        heroSec.addEventListener("mouseleave", function () {
          if (slideTimer) clearInterval(slideTimer);
          slideTimer = setInterval(nextSlide, 5000);
        });
      }
    }
  }

  /* Hero tabs: reveal description ONLY when + sign is tapped */
  var tabWraps = d.querySelectorAll(".hero .tab");
  if (tabWraps.length) {
    Array.prototype.forEach.call(tabWraps, function (tab) {
      var btn = tab.querySelector(".tab-btn");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var wasOpen = tab.classList.contains("open");
        Array.prototype.forEach.call(tabWraps, function (t) {
          t.classList.remove("open");
          var b = t.querySelector(".tab-btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          tab.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    d.addEventListener("click", function (e) {
      if (!e.target.closest(".hero .tabs")) {
        Array.prototype.forEach.call(tabWraps, function (t) {
          t.classList.remove("open");
          var b = t.querySelector(".tab-btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });

    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        Array.prototype.forEach.call(tabWraps, function (t) {
          t.classList.remove("open");
          var b = t.querySelector(".tab-btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  /* Number counters with easing and completion pulse */
  function countUp(el) {
    var b = el.matches && el.matches(".stats > div") ? el.querySelector("b") : null;
    if (!b || b.dataset.done || reduce) return;
    b.dataset.done = "1";
    var m = b.textContent.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var target = parseFloat(m[2].replace(/,/g, "")), dec = (m[2].split(".")[1] || "").length, comma = m[2].indexOf(",") > -1;
    if (!comma && target > 1800 && target < 2100) return; // years stay static
    var start = null;
    function fmt(v) { return comma ? v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec); }
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 1200, 1), e = 1 - Math.pow(1 - p, 3);
      b.textContent = m[1] + fmt(target * e) + m[3];
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        b.classList.add("pulse-done");
      }
    }
    requestAnimationFrame(step);
  }

  /* Donut charts reveal effect */
  function revealDonut(wrap) {
    if (reduce) return;
    var circles = wrap.querySelectorAll("circle");
    Array.prototype.forEach.call(circles, function (c, idx) {
      c.style.transition = "stroke-dasharray 0.75s " + (idx * 100) + "ms cubic-bezier(0.16, 1, 0.3, 1)";
    });
  }

  /* Scroll reveal */
  var targets = d.querySelectorAll(".card, .seg-tile, .tile, .stories > *, .stats > div, .box, .split > *, main section h2, .prose > *, .pills li, .donut-wrap, .carousel, .segtabs, blockquote.q, .intro p, .img-reveal, hr.angled-divider, .st-item, .marquee-section");
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add("in");
      countUp(el);
      if (el.classList.contains("donut-wrap")) revealDonut(el);
      io.unobserve(el);
      setTimeout(function () { el.style.transitionDelay = ""; }, 1400);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;

  Array.prototype.forEach.call(targets, function (el) {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(Array.prototype.indexOf.call(el.parentNode.children, el), 6) * 70 + "ms";
    if (io) io.observe(el); else el.classList.add("in");
  });

  /* Donut charts: hover or focus a legend row or slice to read its value */
  Array.prototype.forEach.call(d.querySelectorAll(".donut-wrap"), function (w) {
    var svg = w.querySelector(".donut"), circles = w.querySelectorAll("circle"), rows = w.querySelectorAll(".legend li");
    var dc = svg.querySelector(".dc"), dl = svg.querySelector(".dl"), home = svg.getAttribute("data-v");
    function show(i) {
      svg.classList.add("dim");
      Array.prototype.forEach.call(circles, function (c, j) { c.classList.toggle("hl", j === i); });
      Array.prototype.forEach.call(rows, function (r, j) { r.classList.toggle("act", j === i); });
      dc.textContent = rows[i].getAttribute("data-v"); dl.textContent = rows[i].getAttribute("data-l");
    }
    function clear() {
      svg.classList.remove("dim");
      Array.prototype.forEach.call(circles, function (c) { c.classList.remove("hl"); });
      Array.prototype.forEach.call(rows, function (r) { r.classList.remove("act"); });
      dc.textContent = home; dl.textContent = "";
    }
    Array.prototype.forEach.call(rows, function (r, i) {
      ["mouseenter", "focus"].forEach(function (ev) { r.addEventListener(ev, function () { show(i); }); });
      ["mouseleave", "blur"].forEach(function (ev) { r.addEventListener(ev, clear); });
    });
    Array.prototype.forEach.call(circles, function (c, i) {
      c.addEventListener("mouseenter", function () { show(i); });
      c.addEventListener("mouseleave", clear);
    });
  });

  /* Brand carousels: arrows, drag and swipe */
  Array.prototype.forEach.call(d.querySelectorAll(".carousel"), function (c) {
    var track = c.querySelector(".track"), prev = c.querySelector(".c-prev"), next = c.querySelector(".c-next");
    function state() {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" }); });
    track.addEventListener("scroll", state, { passive: true });
    window.addEventListener("resize", state);
    var down = false, sx = 0, sl = 0;
    track.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") { down = true; sx = e.clientX; sl = track.scrollLeft; track.style.cursor = "grabbing"; } });
    window.addEventListener("pointerup", function () { down = false; track.style.cursor = ""; });
    track.addEventListener("pointermove", function (e) { if (down) track.scrollLeft = sl - (e.clientX - sx); });
    state();
  });

  /* Magnetic pull effect on .btn */
  if (!reduce) {
    var btns = d.querySelectorAll(".btn");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        b.style.transform = "translate(" + (x * 0.22) + "px, " + (y * 0.22) + "px)";
      });
      b.addEventListener("mouseleave", function () {
        b.style.transform = "";
      });
    });
  }

  /* View Transitions API with safe fallback */
  if (d.startViewTransition && !reduce) {
    d.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || !a.href || a.target || a.origin !== location.origin || a.pathname === location.pathname || a.hash || a.href.startsWith("mailto:") || a.href.startsWith("tel:") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      d.startViewTransition(function () {
        location.href = a.href;
      });
    });
  }

  /* Contact form */
  var f = d.getElementById("cf");
  if (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var out = d.getElementById("msg"), btn = f.querySelector("button");
      out.className = ""; out.textContent = "Sending...";
      btn.disabled = true;
      fetch("contact.php", { method: "POST", body: new FormData(f) })
        .then(function (r) { return r.json(); })
        .then(function (j) { out.textContent = j.message; out.className = j.ok ? "ok" : "err"; if (j.ok) f.reset(); })
        .catch(function () { out.textContent = "Could not send. Please email us directly."; out.className = "err"; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
