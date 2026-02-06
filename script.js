(function () {
  // =========================
  // ✅ TRAVA ZOOM POR GESTOS (iOS Safari)
  // =========================
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturechange", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gestureend", function (e) { e.preventDefault(); }, { passive: false });

  // =========================
  // Helpers (compatível)
  // =========================
  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (matches(el, selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  function matches(el, selector) {
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.msMatchesSelector || p.mozMatchesSelector;
    if (!fn) return false;
    return fn.call(el, selector);
  }

  function trimStr(s) {
    return (s || "").replace(/^\s+|\s+$/g, "");
  }

  // =========================
  // ✅ MENU: EFEITO REDIMENSIONAR NO SCROLL (DESKTOP)
  // =========================
  var topbar = document.querySelector(".topbar");
  var topbarWrap = document.querySelector(".topbar-wrap");

  function isDesktopForCompact() {
    return window.matchMedia && window.matchMedia("(min-width: 981px)").matches;
  }

  function applyCompactState() {
    if (!topbar) return;

    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var compact = (y > 12) && isDesktopForCompact();

    if (compact) topbar.classList.add("is-compact");
    else topbar.classList.remove("is-compact");

    if (topbarWrap) {
      if (y > 12) topbarWrap.classList.add("is-scrolled");
      else topbarWrap.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", function () {
    applyCompactState();
  }, { passive: true });

  window.addEventListener("resize", function () {
    applyCompactState();
  });

  // roda uma vez ao carregar
  applyCompactState();

  // =========================
  // Menu mobile (abre/fecha)
  // =========================
  var burgerMobile = document.querySelector(".hamburger--mobile");
  var burgerDesktop = document.querySelector(".hamburger--desktop");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobile() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (burgerMobile) burgerMobile.setAttribute("aria-expanded", "false");
    if (burgerDesktop) burgerDesktop.setAttribute("aria-expanded", "false");
  }

  function openMobile() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (burgerMobile) burgerMobile.setAttribute("aria-expanded", "true");
    if (burgerDesktop) burgerDesktop.setAttribute("aria-expanded", "true");
  }

  function toggleMobile() {
    if (!mobileMenu) return;
    var hiddenState = mobileMenu.getAttribute("aria-hidden") === "true";
    if (hiddenState) openMobile();
    else closeMobile();
  }

  if (burgerMobile && mobileMenu) {
    burgerMobile.addEventListener("click", function () {
      toggleMobile();
    });
  }

  if (burgerDesktop && mobileMenu) {
    burgerDesktop.addEventListener("click", function () {
      toggleMobile();
    });
  }

  if (mobileMenu) {
    document.addEventListener("click", function (e) {
      var clickedInside = closest(e.target, ".topbar-wrap");
      if (!clickedInside) closeMobile();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });

    var links = mobileMenu.querySelectorAll("a");
    var i;
    for (i = 0; i < links.length; i++) {
      links[i].addEventListener("click", closeMobile);
    }
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia && window.matchMedia("(min-width: 981px)").matches) {
      closeMobile();
    }
  });

  // =========================
  // Select custom (abre pra cima)
  // =========================
  var btn = document.getElementById("segmentoBtn");
  var list = document.getElementById("segmentoList");
  var label = document.getElementById("segmentoLabel");
  var hidden = document.getElementById("segmentoValue");

  function closeList() {
    if (!list) return;
    list.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function toggleList() {
    if (!list) return;
    var open = !list.classList.contains("open");
    if (open) list.classList.add("open");
    else list.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (btn && list) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleList();
    });

    list.addEventListener("click", function (e) {
      var item = closest(e.target, ".select-item");
      if (!item) return;

      var value = item.getAttribute("data-value") || trimStr(item.textContent || "");
      if (hidden) hidden.value = value;
      if (label) label.textContent = value;

      closeList();
    });

    document.addEventListener("click", function (e) {
      var clickedInside = closest(e.target, ".field--select");
      if (!clickedInside) closeList();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeList();
    });
  }

  // =========================
  // Telefone: FORMATO (DD) 912345678
  // =========================
  var phoneInput = document.querySelector('input[name="telefone"]');

  function formatPhoneBR(digits) {
    var d = (digits || "").replace(/\D/g, "").slice(0, 11);
    var ddd = d.slice(0, 2);
    var rest = d.slice(2);

    if (d.length === 0) return "";
    if (d.length < 3) return "(" + ddd;
    return "(" + ddd + ") " + rest;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var digits = (this.value || "").replace(/\D/g, "");
      this.value = formatPhoneBR(digits);
    });

    phoneInput.addEventListener("blur", function () {
      var digits = (this.value || "").replace(/\D/g, "");
      if (digits.length > 0 && digits.length < 11) {
        this.value = formatPhoneBR(digits);
      }
    });
  }

  // =========================
  // Envio Netlify sem sair da página (XHR)
  // =========================
  var form = document.querySelector('form[name="zacxys-leads"]');
  var submitBtn = document.getElementById("submitBtn");
  var note = document.getElementById("formNote");

  function setError(msg) {
    if (note) note.textContent = msg;
  }

  function clearError() {
    if (note) note.textContent = "";
  }

  function markSuccess() {
    if (!submitBtn) return;
    clearError();
    submitBtn.textContent = "REUNIÃO AGENDADA!";
    submitBtn.style.background = "#dfff06";
    submitBtn.style.color = "#1d10d7";
    submitBtn.disabled = true;
    submitBtn.style.cursor = "default";
  }

  function isValidEmail(email) {
    if (!email) return false;
    var e = trimStr(email);
    var at = e.indexOf("@");
    if (at <= 0) return false;
    var dotAfter = e.indexOf(".", at + 2);
    if (dotAfter === -1) return false;
    if (dotAfter >= e.length - 1) return false;
    return true;
  }

  function encodeURIComponentPlus(str) {
    return encodeURIComponent(str).replace(/%20/g, "+");
  }

  function serializeForm(formEl) {
    var pairs = [];
    var els = formEl.elements;
    var i;

    for (i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el || !el.name || el.disabled) continue;

      var type = (el.type || "").toLowerCase();

      if (type === "checkbox" || type === "radio") {
        if (!el.checked) continue;
      }

      pairs.push(encodeURIComponentPlus(el.name) + "=" + encodeURIComponentPlus(el.value || ""));
    }

    return pairs.join("&");
  }

  function sendNetlify(formEl, onOk, onFail) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) onOk();
      else onFail();
    };

    xhr.send(serializeForm(formEl));
  }

  function runValidationAndSend() {
    if (!form) return;

    clearError();

    var nome = form.querySelector('input[name="nome"]');
    var email = form.querySelector('input[name="email"]');
    var empresa = form.querySelector('input[name="empresa"]');
    var telefone = form.querySelector('input[name="telefone"]');

    if (!nome || !nome.value || !trimStr(nome.value)) return setError("Preencha seu nome e sobrenome.");
    if (!email || !email.value || !trimStr(email.value)) return setError("Preencha seu e-mail corporativo.");
    if (!isValidEmail(email.value)) return setError("E-mail não foi preenchido corretamente (ex: nome@empresa.com).");
    if (!empresa || !empresa.value || !trimStr(empresa.value)) return setError("Preencha o nome da sua empresa.");

    var telDigits = (telefone && telefone.value) ? telefone.value.replace(/\D/g, "") : "";
    if (telDigits.length !== 11) return setError("Telefone deve estar no formato (DD) 912345678.");

    if (!hidden || !hidden.value) return setError("Selecione o segmento da sua empresa.");

    sendNetlify(
      form,
      function () { markSuccess(); },
      function () { setError("Não foi possível enviar agora. Tente novamente."); }
    );
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      runValidationAndSend();
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runValidationAndSend();
    });
  }

  // =========================
  // SEÇÃO 03: Carrossel infinito REAL (sem clones, sem pulo)
  // =========================
  var track = document.getElementById("logosTrack");
  var prevBtn = document.getElementById("logosPrev");
  var nextBtn = document.getElementById("logosNext");

  var state = {
    animating: false,
    step: 0,
    visible: 4
  };

  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 520px)").matches;
  }

  function setVisible() {
    state.visible = isMobile() ? 3 : 4;
  }

  function getGapPx(el) {
    var s, gap, v;
    try {
      s = window.getComputedStyle(el);
      gap = s.gap || s.columnGap || "0px";
      v = parseFloat(gap);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  }

  function measureStep() {
    if (!track) return 0;
    var first = track.querySelector(".sec3-item");
    if (!first) return 0;
    var gap = getGapPx(track);
    var w = first.getBoundingClientRect().width;
    return Math.round(w + gap);
  }

  function clearFocus() {
    if (!track) return;
    var items = track.querySelectorAll(".sec3-item");
    var i;
    for (i = 0; i < items.length; i++) {
      items[i].classList.remove("is-center");
      items[i].classList.remove("is-edge");
    }
  }

  function applyFocus() {
    if (!track) return;

    clearFocus();
    var items = track.querySelectorAll(".sec3-item");
    if (!items || items.length === 0) return;

    if (state.visible === 4) {
      if (items[0]) items[0].classList.add("is-edge");
      if (items[1]) items[1].classList.add("is-center");
      if (items[2]) items[2].classList.add("is-edge");
      if (items[3]) items[3].classList.add("is-edge");
    } else {
      if (items[0]) items[0].classList.add("is-center");
      if (items[1]) items[1].classList.add("is-edge");
      if (items[2]) items[2].classList.add("is-edge");
    }
  }

  function setTransform(x) {
    if (!track) return;
    track.style.transform = "translate3d(" + x + "px,0,0)";
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateTo(fromX, toX, duration, done) {
    var start = null;
    var delta = toX - fromX;

    var frame = function (ts) {
      if (!start) start = ts;
      var t = (ts - start) / duration;
      if (t > 1) t = 1;

      var eased = easeOutCubic(t);
      setTransform(fromX + delta * eased);

      if (t < 1) window.requestAnimationFrame(frame);
      else done();
    };

    window.requestAnimationFrame(frame);
  }

  function moveNext() {
    if (!track || state.animating) return;

    state.animating = true;
    setVisible();
    state.step = measureStep();

    animateTo(0, -state.step, 520, function () {
      var first = track.firstElementChild;
      if (first) track.appendChild(first);

      setTransform(0);

      applyFocus();
      state.animating = false;
    });
  }

  function movePrev() {
    if (!track || state.animating) return;

    state.animating = true;
    setVisible();
    state.step = measureStep();

    var last = track.lastElementChild;
    if (last) track.insertBefore(last, track.firstElementChild);

    setTransform(-state.step);

    animateTo(-state.step, 0, 520, function () {
      applyFocus();
      state.animating = false;
    });
  }

  function bindCarousel() {
    if (!track) return;

    setVisible();
    state.step = measureStep();
    setTransform(0);
    applyFocus();

    if (nextBtn) nextBtn.addEventListener("click", moveNext);
    if (prevBtn) prevBtn.addEventListener("click", movePrev);

    var timer = null;
    window.addEventListener("resize", function () {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        setVisible();
        state.step = measureStep();
        setTransform(0);
        applyFocus();
      }, 160);
    });
  }

  bindCarousel();

  // =========================
  // SEÇÃO 03: Entrada com scroll (Como a Zacx trabalha)
  // =========================
  (function () {
    var sec3Work = document.querySelector(".sec3-work");
    if (!sec3Work) return;

    var tracks = sec3Work.querySelectorAll(".sec3-work-track");
    var marquee = sec3Work.querySelector(".sec3-work-marquee");

    // ✅ clones (sem forEach)
    if (tracks && tracks.length) {
      var t;
      for (t = 0; t < tracks.length; t++) {
        var tr = tracks[t];
        if (!tr || tr.dataset.cloned === "true") continue;

        var items = Array.prototype.slice.call(tr.children);
        var j;
        for (j = 0; j < items.length; j++) {
          var clone = items[j].cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.classList.add("is-duplicate");
          tr.appendChild(clone);
        }
        tr.dataset.cloned = "true";
      }
    }

    function isMobileMarquee() {
      return window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    }

    function setMarqueePaused(paused) {
      if (!marquee) return;
      if (paused) marquee.classList.add("is-paused");
      else marquee.classList.remove("is-paused");
    }

    function handlePressStart(e) {
      if (!isMobileMarquee()) return;
      if (!closest(e.target, ".sec3-work-card")) return;
      setMarqueePaused(true);
    }

    function handlePressEnd() {
      if (!isMobileMarquee()) return;
      setMarqueePaused(false);
    }

    if (marquee) {
      marquee.addEventListener("pointerdown", handlePressStart);
      marquee.addEventListener("pointerup", handlePressEnd);
      marquee.addEventListener("pointercancel", handlePressEnd);
      marquee.addEventListener("pointerleave", handlePressEnd);
      marquee.addEventListener("touchstart", handlePressStart, { passive: true });
      marquee.addEventListener("touchend", handlePressEnd);
      marquee.addEventListener("touchcancel", handlePressEnd);
    }

    function setOn() {
      sec3Work.classList.add("is-in");
    }

    function setOff() {
      sec3Work.classList.remove("is-in");
    }

    function inView(el) {
      if (!el) return false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (r.bottom <= 0 || r.top >= vh) return false;
      return r.top < (vh * 0.75);
    }

    function tick() {
      if (inView(sec3Work)) setOn();
      else setOff();
    }

    if ("IntersectionObserver" in window) {
      var io3 = new IntersectionObserver(function (entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
          if (!entries[i]) continue;
          if (entries[i].isIntersecting) setOn();
          else setOff();
        }
      }, { threshold: 0.25 });

      io3.observe(sec3Work);
    } else {
      window.addEventListener("scroll", function () {
        tick();
      }, { passive: true });

      window.addEventListener("resize", function () {
        tick();
      });
    }

    tick();
  })();

  // =========================
  // SESSÃO: POR QUE ESCOLHER A ZACX
  // =========================
  (function () {
    var secChoose = document.getElementById("por-que-zacx");
    if (!secChoose) return;

    var prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isCoarse = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    var nodes = secChoose.querySelectorAll("[data-node][data-step]");
    var points = secChoose.querySelectorAll("[data-choose-point]");
    var linePath = secChoose.querySelector("[data-choose-line]");
    var floatNodes = secChoose.querySelectorAll(".sec-choose-node");
    var floatLayers = secChoose.querySelectorAll(".sec-choose-title, .sec-choose-line-wrap, .sec-choose-right, .sec-choose-sales");
    var lineDuration = prefersReduce ? 0 : 1400;
    var linePlayed = false;

    function setOn() {
      secChoose.classList.add("is-in");
    }

    function resetGraphState() {
      linePlayed = false;
      secChoose.classList.remove("is-sales-visible");
      secChoose.classList.remove("is-line-animating");
      drawLineProgress(0);

      var i;
      for (i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("is-revealed");
        nodes[i].classList.remove("is-active");
      }
      for (i = 0; i < points.length; i++) {
        points[i].classList.remove("is-active");
      }
    }

    function setOff() {
      secChoose.classList.remove("is-in");
      resetGraphState();
    }

    function inView(el) {
      if (!el) return false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (r.bottom <= 0 || r.top >= vh) return false;
      return r.top < (vh * 0.8);
    }

    function setActiveStep(stepIndex) {
      var i;
      for (i = 0; i < nodes.length; i++) {
        if (i <= stepIndex) nodes[i].classList.add("is-revealed");
        else nodes[i].classList.remove("is-revealed");

        if (i === stepIndex) nodes[i].classList.add("is-active");
        else nodes[i].classList.remove("is-active");
      }
      for (i = 0; i < points.length; i++) {
        if (i <= stepIndex) points[i].classList.add("is-active");
        else points[i].classList.remove("is-active");
      }
    }

    function drawLineProgress(progress) {
      if (!linePath) return;
      var p = progress;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      var length = linePath.getTotalLength();
      linePath.style.strokeDasharray = length;
      linePath.style.strokeDashoffset = length * (1 - p);
    }

    function runGraphAnimation() {
      if (!linePath || linePlayed) return;
      linePlayed = true;
      secChoose.classList.add("is-line-animating");

      window.setTimeout(function () {
        secChoose.classList.remove("is-line-animating");
      }, 1200);

      if (prefersReduce) {
        drawLineProgress(1);
        setActiveStep(nodes.length - 1);
        secChoose.classList.add("is-sales-visible");
        return;
      }

      setActiveStep(0);
      drawLineProgress(0);

      var startAt = performance.now();

      function frame(now) {
        var elapsed = now - startAt;
        var t = elapsed / lineDuration;
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        var easeOut = 1 - Math.pow(1 - t, 3);
        drawLineProgress(easeOut);

        var stepDuration = lineDuration / Math.max(nodes.length, 1);
        var activeIndex = Math.min(nodes.length - 1, Math.floor(elapsed / stepDuration));
        setActiveStep(activeIndex);

        if (t < 1) {
          window.requestAnimationFrame(frame);
          return;
        }

        secChoose.classList.add("is-sales-visible");
      }

      window.requestAnimationFrame(frame);
    }

    function updateFloatByScroll() {
      if (prefersReduce || !floatNodes.length) return;
      var rect = secChoose.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (!vh) return;

      var start = vh * 0.9;
      var end = -rect.height * 0.25;
      var raw = (start - rect.top) / (start - end);
      if (raw < 0) raw = 0;
      if (raw > 1) raw = 1;

      var driftY = Math.sin(raw * Math.PI * 1.25) * 8;
      var driftX = Math.cos(raw * Math.PI * 0.95) * 4;
      secChoose.style.setProperty("--drift-y", driftY.toFixed(2) + "px");
      secChoose.style.setProperty("--drift-x", driftX.toFixed(2) + "px");

      var i;
      for (i = 0; i < floatLayers.length; i++) {
        var layerPhase = i * 0.4;
        var layerY = driftY + Math.sin((raw * Math.PI * 1.6) + layerPhase) * 3;
        var layerX = driftX + Math.cos((raw * Math.PI * 1.2) + layerPhase) * 1.6;
        floatLayers[i].style.setProperty("--drift-y", layerY.toFixed(2) + "px");
        floatLayers[i].style.setProperty("--drift-x", layerX.toFixed(2) + "px");
      }

      for (i = 0; i < floatNodes.length; i++) {
        var wave = Math.sin((raw * Math.PI * 1.4) + (i * 0.55));
        var y = wave * 9;
        floatNodes[i].style.setProperty("--float-y", y.toFixed(2) + "px");
      }
    }

    function tick() {
      if (inView(secChoose)) {
        setOn();
        runGraphAnimation();
      } else {
        setOff();
      }
      updateFloatByScroll();
    }

    if ("IntersectionObserver" in window) {
      var ioChoose = new IntersectionObserver(function (entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
          if (!entries[i]) continue;
          if (entries[i].isIntersecting) {
            setOn();
            runGraphAnimation();
          } else {
            setOff();
          }
        }
      }, { threshold: 0.3 });
      ioChoose.observe(secChoose);
      window.addEventListener("scroll", updateFloatByScroll, { passive: true });
      window.addEventListener("resize", updateFloatByScroll);
    } else {
      window.addEventListener("scroll", tick, { passive: true });
      window.addEventListener("resize", tick);
    }

    if (!prefersReduce && !isCoarse) {
      var tx = 0.5;
      var ty = 0.5;
      var cx = 0.5;
      var cy = 0.5;

      function animateAura() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        secChoose.style.setProperty("--mouse-x", (cx * 100).toFixed(2) + "%");
        secChoose.style.setProperty("--mouse-y", (cy * 100).toFixed(2) + "%");
        window.requestAnimationFrame(animateAura);
      }

      secChoose.addEventListener("pointermove", function (e) {
        var rect = secChoose.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        tx = (e.clientX - rect.left) / rect.width;
        ty = (e.clientY - rect.top) / rect.height;
        if (tx < 0) tx = 0;
        if (tx > 1) tx = 1;
        if (ty < 0) ty = 0;
        if (ty > 1) ty = 1;

        var pullX = (tx - 0.5) * 14;
        var pullY = (ty - 0.5) * 10;
        secChoose.style.setProperty("--hover-pull-x", pullX.toFixed(2) + "px");
        secChoose.style.setProperty("--hover-pull-y", pullY.toFixed(2) + "px");
      });

      secChoose.addEventListener("pointerleave", function () {
        tx = 0.5;
        ty = 0.5;
        secChoose.style.setProperty("--hover-pull-x", "0px");
        secChoose.style.setProperty("--hover-pull-y", "0px");
      });

      window.requestAnimationFrame(animateAura);
    }

    tick();
    updateFloatByScroll();
  })();


  // ==========================================================
  // ✅ SEÇÃO 07: ENTRADA DOS BLOCOS + LINHAS + PARALLAX
  // ==========================================================
  (function () {
    var sec7 = document.getElementById("sec7");
    if (!sec7) return;

    function setOn() {
      sec7.classList.add("is-in");
    }

    function setOff() {
      sec7.classList.remove("is-in");
    }

    function inView(el) {
      if (!el) return false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (r.bottom <= 0 || r.top >= vh) return false;
      return r.top < (vh * 0.7);
    }

    function tick() {
      if (inView(sec7)) setOn();
      else setOff();
    }

    if ("IntersectionObserver" in window) {
      var io7 = new IntersectionObserver(function (entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
          if (!entries[i]) continue;
          if (entries[i].isIntersecting) setOn();
          else setOff();
        }
      }, { threshold: 0.25 });

      io7.observe(sec7);
    } else {
      window.addEventListener("scroll", function () {
        tick();
      }, { passive: true });

      window.addEventListener("resize", function () {
        tick();
      });
    }

    var blocks = sec7.querySelectorAll("[data-sec7-block]");
    var gearWrap = sec7.querySelector(".sec7-gear-wrap");
    var stage = sec7.querySelector("[data-sec7-stage]") || sec7;
    var maxMove = 24;

    function setMove(x, y) {
      var i;
      for (i = 0; i < blocks.length; i++) {
        blocks[i].style.setProperty("--move-x", x + "px");
        blocks[i].style.setProperty("--move-y", y + "px");
      }
      if (gearWrap) {
        gearWrap.style.setProperty("--move-x", (x * 1.2) + "px");
        gearWrap.style.setProperty("--move-y", (y * 1.2) + "px");
      }
    }

    if (stage) {
      var handleMove = function (e) {
        var rect = stage.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) return;
        var nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        var ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMove(nx * maxMove, ny * (maxMove * 0.6));
      };

      stage.addEventListener("pointermove", handleMove);
      stage.addEventListener("mousemove", handleMove);

      stage.addEventListener("mouseleave", function () {
        setMove(0, 0);
      });

      stage.addEventListener("pointerleave", function () {
        setMove(0, 0);
      });
    }

    // ==========================================================
    // ✅ TILT (SEM const/let/arrow/template-string/forEach)
    // Aplica tilt em .sec7-block e .sec3-work-card
    // ==========================================================
    (function () {
      var cards = document.querySelectorAll(".sec7-block, .sec3-work-card");
      var i;

      function onMoveFactory(card) {
        return function (e) {
          var r = card.getBoundingClientRect();
          var x = e.clientX - r.left;
          var y = e.clientY - r.top;

          var rx = ((y / r.height) - 0.5) * 10;
          var ry = ((x / r.width) - 0.5) * -10;

          // sem template string
          card.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
        };
      }

      function onLeaveFactory(card) {
        return function () {
          card.style.transform = "";
        };
      }

      for (i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (!card) continue;

        card.classList.add("tilt");

        card.addEventListener("mousemove", onMoveFactory(card));
        card.addEventListener("mouseleave", onLeaveFactory(card));
      }
    })();

    tick();
  })();

  // =========================
  // Scroll Section Indicator
  // =========================
  (function () {
    var indicator = document.querySelector(".zacxys-scroll-indicator");
    if (!indicator) return;

    var sections = document.querySelectorAll("section[data-section]");
    if (!sections || !sections.length) return;

    var prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dots = [];
    var ratios = [];

    indicator.innerHTML = "";

    function setActiveDot(activeIndex) {
      var i;
      for (i = 0; i < dots.length; i++) {
        if (i === activeIndex) dots[i].classList.add("is-active");
        else dots[i].classList.remove("is-active");
      }
    }

    var i;
    for (i = 0; i < sections.length; i++) {
      var section = sections[i];
      section.__zacxysIndex = i;
      ratios[i] = 0;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zacxys-dot";
      btn.setAttribute("aria-label", "Ir para a seção " + (i + 1));
      btn.setAttribute("data-index", String(i));

      btn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        if (isNaN(idx) || !sections[idx]) return;
        sections[idx].scrollIntoView({
          behavior: prefersReduce ? "auto" : "smooth",
          block: "start"
        });
      });

      indicator.appendChild(btn);
      dots.push(btn);
    }

    function pickActive() {
      var maxRatio = 0;
      var maxIndex = 0;
      var j;
      for (j = 0; j < ratios.length; j++) {
        if (ratios[j] > maxRatio) {
          maxRatio = ratios[j];
          maxIndex = j;
        }
      }
      if (maxRatio > 0) setActiveDot(maxIndex);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        var j;
        for (j = 0; j < entries.length; j++) {
          var entry = entries[j];
          if (!entry || !entry.target) continue;
          var idx = entry.target.__zacxysIndex;
          if (idx === undefined) continue;
          ratios[idx] = entry.intersectionRatio || 0;
        }
        pickActive();
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

      for (i = 0; i < sections.length; i++) {
        observer.observe(sections[i]);
      }
    } else {
      setActiveDot(0);
    }

    setActiveDot(0);
  })();

  // =========================
  // FUNDO GLOBAL (GRID + GLOW)
  // =========================
  (function () {
    var bg = document.querySelector(".global-bg");
    if (!bg) return;

    var prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isCoarse = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    var targetX = 0.5;
    var targetY = 0.5;
    var currentX = 0.5;
    var currentY = 0.5;

    function setGlow(x, y) {
      bg.style.setProperty("--global-mouse-x", (x * 100).toFixed(2) + "%");
      bg.style.setProperty("--global-mouse-y", (y * 100).toFixed(2) + "%");
    }

    setGlow(0.5, 0.5);

    if (prefersReduce || isCoarse) {
      bg.classList.add("is-reduced");
    } else {
      window.addEventListener("pointermove", function (e) {
        var vw = window.innerWidth || document.documentElement.clientWidth || 0;
        var vh = window.innerHeight || document.documentElement.clientHeight || 0;
        if (!vw || !vh) return;
        targetX = e.clientX / vw;
        targetY = e.clientY / vh;
        if (targetX < 0) targetX = 0;
        if (targetX > 1) targetX = 1;
        if (targetY < 0) targetY = 0;
        if (targetY > 1) targetY = 1;
      }, { passive: true });

      (function animateGlow() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        setGlow(currentX, currentY);
        window.requestAnimationFrame(animateGlow);
      })();
    }

    var disableSection = document.querySelector("[data-disable-global-bg]");
    if (!disableSection) return;

    function setDisabled(disabled) {
      if (disabled) bg.classList.add("is-disabled");
      else bg.classList.remove("is-disabled");
    }

    function calcDominance() {
      var rect = disableSection.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (!vh) return setDisabled(false);
      var top = Math.max(rect.top, 0);
      var bottom = Math.min(rect.bottom, vh);
      var visible = bottom - top;
      if (visible < 0) visible = 0;
      var base = Math.min(rect.height, vh) || 1;
      var ratio = visible / base;
      setDisabled(ratio >= 0.6);
    }

    if ("IntersectionObserver" in window) {
      var ioBg = new IntersectionObserver(function (entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (!entry) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setDisabled(true);
            return;
          }
        }
        setDisabled(false);
      }, { threshold: [0, 0.25, 0.5, 0.65, 0.8, 1] });

      ioBg.observe(disableSection);
    } else {
      window.addEventListener("scroll", calcDominance, { passive: true });
      window.addEventListener("resize", calcDominance);
      calcDominance();
    }
  })();

  // =========================
  // PARALLAX GLOBAL (SCROLL + MOUSE)
  // =========================
  (function () {
    var sections = document.querySelectorAll("section");
    if (!sections.length) return;

    var prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isCoarse = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    var vw = window.innerWidth || document.documentElement.clientWidth || 0;
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    var mouseTX = 0;
    var mouseTY = 0;
    var mouseX = 0;
    var mouseY = 0;
    var ticking = false;

    function toNumber(v, fallback) {
      var n = parseFloat(v);
      if (isNaN(n)) return fallback;
      return n;
    }

    var i;
    for (i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (!sec) continue;
      sec.setAttribute("data-parallax-section", "true");
      if (!sec.getAttribute("data-speed")) sec.setAttribute("data-speed", "0.03");

      var base = sec.querySelectorAll(":scope > div, :scope > article, :scope > h1, :scope > h2, :scope > h3");
      var b;
      for (b = 0; b < base.length; b++) {
        var el = base[b];
        if (!el || el.classList.contains("parallax-item")) continue;
        el.classList.add("parallax-item");
        if (!el.getAttribute("data-speed")) {
          el.setAttribute("data-speed", b % 3 === 0 ? "0.02" : (b % 3 === 1 ? "0.05" : "0.08"));
        }
      }
    }

    function schedule() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(applyFrame);
    }

    function applyFrame() {
      ticking = false;
      if (prefersReduce) return;

      mouseX += (mouseTX - mouseX) * 0.08;
      mouseY += (mouseTY - mouseY) * 0.08;

      var j;
      for (j = 0; j < sections.length; j++) {
        var section = sections[j];
        if (!section) continue;

        // ✅ evita mover a section inteira no scroll (mantém o fluxo natural)
        section.style.setProperty("--parallax-y", "0px");

        var items = section.querySelectorAll(".parallax-item");
        var k;
        for (k = 0; k < items.length; k++) {
          var item = items[k];
          if (!item) continue;
          var speed = toNumber(item.getAttribute("data-speed"), 0.04);
          var ix = isCoarse ? 0 : (mouseX * (speed * 48));
          var iy = isCoarse ? 0 : (mouseY * (speed * 36));
          item.style.setProperty("--move-x", ix.toFixed(2) + "px");
          item.style.setProperty("--move-y", iy.toFixed(2) + "px");
        }
      }

      if (!isCoarse) window.requestAnimationFrame(applyFrame);
    }

    function onScrollOrResize() {
      vw = window.innerWidth || document.documentElement.clientWidth || 0;
      vh = window.innerHeight || document.documentElement.clientHeight || 0;
      schedule();
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    if (!isCoarse) {
      window.addEventListener("pointermove", function (e) {
        if (!vw || !vh) return;
        mouseTX = ((e.clientX / vw) - 0.5) * 2;
        mouseTY = ((e.clientY / vh) - 0.5) * 2;
      }, { passive: true });
    }

    onScrollOrResize();
    if (!prefersReduce && !isCoarse) window.requestAnimationFrame(applyFrame);
  })();

})();
