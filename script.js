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
  // SEÇÃO 05: Interação dos caminhos
  // ✅ cada um abre sozinho (sem abrir o outro automaticamente)
  // =========================
  var sec5 = document.getElementById("sec5");
  var panelWith = document.getElementById("panelWith");
  var panelWithout = document.getElementById("panelWithout");
  var topBtns = document.querySelectorAll(".sec5-topbtn");

  function setPanelMaxHeight(panel, open) {
    if (!panel) return;

    if (!open) {
      panel.classList.remove("is-open");
      panel.classList.add("sec5-panel--peek");
      panel.style.maxHeight = "120px";
      panel.setAttribute("aria-hidden", "false");
      return;
    }

    panel.classList.add("is-open");
    panel.classList.remove("sec5-panel--peek");
    panel.setAttribute("aria-hidden", "false");

    panel.style.maxHeight = "0px";
    var inner = panel.querySelector(".sec5-panel-inner");
    var h = inner ? inner.scrollHeight : panel.scrollHeight;
    panel.style.maxHeight = (h + 24) + "px";
  }

  function updateAllOpenHeights() {
    if (!sec5) return;
    if (panelWith && panelWith.classList.contains("is-open")) setPanelMaxHeight(panelWith, true);
    if (panelWithout && panelWithout.classList.contains("is-open")) setPanelMaxHeight(panelWithout, true);
  }

  function getItemsWrap(group) {
    return document.querySelector('.sec5-items[data-items="' + group + '"]');
  }

  function getWalker(group) {
    return document.querySelector('.sec5-walk[data-walk="' + group + '"]');
  }

  function getBottom(group) {
    return document.querySelector('.sec5-bottom[data-bottom="' + group + '"]');
  }

  function setWalkerPulsing(group, pulsing) {
    var walker = getWalker(group);
    if (!walker) return;
    if (pulsing) walker.classList.add("is-pulsing");
    else walker.classList.remove("is-pulsing");
  }

  function clickHop(group) {
    var walker = getWalker(group);
    if (!walker) return;
    walker.classList.remove("is-clickhop");
    void walker.offsetWidth;
    walker.classList.add("is-clickhop");
    window.setTimeout(function () {
      walker.classList.remove("is-clickhop");
    }, 1200);
  }

  function clearComplete(group) {
    var bottom = getBottom(group);
    if (!bottom) return;
    bottom.classList.remove("is-complete");
    bottom.classList.remove("is-pop");
  }

  function markComplete(group) {
    var bottom = getBottom(group);
    if (!bottom) return;

    bottom.classList.add("is-complete");
    bottom.classList.remove("is-pop");
    void bottom.offsetWidth;
    bottom.classList.add("is-pop");
  }

  function initItems(group) {
    var itemsWrap = getItemsWrap(group);
    if (!itemsWrap) return;

    clearComplete(group);

    var items = itemsWrap.querySelectorAll(".sec5-item");
    var i;
    for (i = 0; i < items.length; i++) items[i].classList.remove("is-visible");

    if (items[0]) items[0].classList.add("is-visible");
    itemsWrap.setAttribute("data-index", "1");

    positionWalker(group);

    var panel = (group === "with") ? panelWith : panelWithout;
    if (panel && panel.classList.contains("is-open")) setWalkerPulsing(group, true);
  }

  function positionWalker(group) {
    var itemsWrap = getItemsWrap(group);
    var walker = getWalker(group);
    if (!itemsWrap || !walker) return;

    var panel = (group === "with") ? panelWith : panelWithout;
    if (!panel || !panel.classList.contains("is-open")) return;

    var idx = parseInt(itemsWrap.getAttribute("data-index") || "0", 10);
    if (idx <= 0) idx = 1;

    var items = itemsWrap.querySelectorAll(".sec5-item");
    var lastIndex = idx - 1;
    if (lastIndex < 0) lastIndex = 0;
    if (lastIndex >= items.length) lastIndex = items.length - 1;

    var target = items[lastIndex];
    if (!target) return;

    var top = target.offsetTop + (target.offsetHeight / 2) - (walker.offsetHeight / 2);
    walker.style.top = Math.round(top) + "px";
  }

  function revealNext(group) {
    var itemsWrap = getItemsWrap(group);
    if (!itemsWrap) return;

    var items = itemsWrap.querySelectorAll(".sec5-item");
    var idx = parseInt(itemsWrap.getAttribute("data-index") || "0", 10);
    if (idx < 0) idx = 0;

    if (idx >= items.length) {
      markComplete(group);
      positionWalker(group);
      setWalkerPulsing(group, true);
      return;
    }

    setWalkerPulsing(group, false);
    clickHop(group);

    items[idx].classList.add("is-visible");
    itemsWrap.setAttribute("data-index", String(idx + 1));

    updateAllOpenHeights();

    window.requestAnimationFrame(function () {
      positionWalker(group);
      window.setTimeout(function () {
        setWalkerPulsing(group, true);
      }, 120);
    });

    if ((idx + 1) >= items.length) {
      window.setTimeout(function () {
        markComplete(group);
        updateAllOpenHeights();
        setWalkerPulsing(group, true);
      }, 160);
    }
  }

  function setTopBtnExpanded(target, expanded) {
    var btnEl = document.querySelector('.sec5-topbtn[data-target="' + target + '"]');
    if (btnEl) btnEl.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function bindSec5() {
    if (!sec5) return;

    initItems("with");
    initItems("without");

    // default: spoiler ativo e painel "fechado"
    setPanelMaxHeight(panelWith, false);
    setPanelMaxHeight(panelWithout, false);
    setTopBtnExpanded("with", false);
    setTopBtnExpanded("without", false);

    if (topBtns && topBtns.length) {
      var k;
      for (k = 0; k < topBtns.length; k++) {
        topBtns[k].addEventListener("click", function () {
          var target = this.getAttribute("data-target");
          var isWith = target === "with";
          var panel = isWith ? panelWith : panelWithout;

          var expanded = this.getAttribute("aria-expanded") === "true";
          var nextState = !expanded;

          this.setAttribute("aria-expanded", nextState ? "true" : "false");
          setPanelMaxHeight(panel, nextState);

          window.setTimeout(function () {
            updateAllOpenHeights();
            positionWalker(target);
            setWalkerPulsing(target, nextState);
          }, 90);
        });
      }
    }

    var walkBtns = sec5 ? sec5.querySelectorAll(".sec5-walk") : [];
    var w;
    for (w = 0; w < walkBtns.length; w++) {
      walkBtns[w].addEventListener("click", function () {
        var group = this.getAttribute("data-walk");
        revealNext(group);
      });
    }

    window.addEventListener("resize", function () {
      window.setTimeout(function () {
        updateAllOpenHeights();
        positionWalker("with");
        positionWalker("without");
      }, 80);
    });
  }

  bindSec5();

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
})();
