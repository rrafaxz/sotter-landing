(function () {
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

  // =========================
  // Menu mobile (abre/fecha)
  // =========================
  var burger = document.querySelector(".hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobile() {
    if (!mobileMenu || !burger) return;
    mobileMenu.style.display = "none";
    mobileMenu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
  }

  function openMobile() {
    if (!mobileMenu || !burger) return;
    mobileMenu.style.display = "block";
    mobileMenu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var expanded = burger.getAttribute("aria-expanded") === "true";
      if (expanded) closeMobile();
      else openMobile();
    });

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

      var value = item.getAttribute("data-value") || (item.textContent || "").replace(/^\s+|\s+$/g, "");
      hidden.value = value;
      label.textContent = value;

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
    var e = email.replace(/^\s+|\s+$/g, "");
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

    if (!nome || !nome.value || !nome.value.replace(/^\s+|\s+$/g, "")) return setError("Preencha seu nome e sobrenome.");
    if (!email || !email.value || !email.value.replace(/^\s+|\s+$/g, "")) return setError("Preencha seu e-mail corporativo.");
    if (!isValidEmail(email.value)) return setError("E-mail não foi preenchido corretamente (ex: nome@empresa.com).");
    if (!empresa || !empresa.value || !empresa.value.replace(/^\s+|\s+$/g, "")) return setError("Preencha o nome da sua empresa.");

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
  // - Loop infinito por reordenação do DOM
  // - Desktop: 4 visíveis / foco 2 centrais
  // - Mobile: 3 visíveis / foco 1 central
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

    // como o DOM vai sendo reordenado, o "início" do track é sempre o começo
    if (state.visible === 4) {
      if (items[0]) items[0].classList.add("is-edge");
      if (items[1]) items[1].classList.add("is-center");
      if (items[2]) items[2].classList.add("is-center");
      if (items[3]) items[3].classList.add("is-edge");
    } else {
      if (items[0]) items[0].classList.add("is-edge");
      if (items[1]) items[1].classList.add("is-center");
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

    function frame(ts) {
      if (!start) start = ts;
      var t = (ts - start) / duration;
      if (t > 1) t = 1;

      var eased = easeOutCubic(t);
      setTransform(fromX + delta * eased);

      if (t < 1) window.requestAnimationFrame(frame);
      else done();
    }

    window.requestAnimationFrame(frame);
  }

  function moveNext() {
    if (!track || state.animating) return;

    state.animating = true;
    setVisible();
    state.step = measureStep();

    // anima para a esquerda
    animateTo(0, -state.step, 520, function () {
      // depois da animação, move o primeiro para o final (loop infinito real)
      var first = track.firstElementChild;
      if (first) track.appendChild(first);

      // reseta transform sem transição (invisível pro usuário)
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

    // antes de animar, traz o último pro começo para "existir" item à esquerda
    var last = track.lastElementChild;
    if (last) track.insertBefore(last, track.firstElementChild);

    // começa já deslocado para a esquerda (mostrando o item "anterior")
    setTransform(-state.step);

    // anima voltando pra 0 (movimento para a direita)
    animateTo(-state.step, 0, 520, function () {
      applyFocus();
      state.animating = false;
    });
  }

  function bindCarousel() {
    if (!track) return;

    // estado inicial
    setVisible();
    state.step = measureStep();
    setTransform(0);
    applyFocus();

    if (nextBtn) nextBtn.addEventListener("click", moveNext);
    if (prevBtn) prevBtn.addEventListener("click", movePrev);

    // recalcula em resize sem quebrar o loop
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
})();
