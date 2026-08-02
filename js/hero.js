/* ==========================================================================
   NASSIF — Hero
   1. Ajusta a composição responsiva sem acoplar o conteúdo ao fundo.
   2. Alterna o cargo com efeito de digitação.
   3. Mantém o relógio na hora local de José Bonifácio - SP.
   ========================================================================== */

(function () {
  "use strict";

  var HERO_W = 1280;
  var HERO_H = 832;
  var RESPONSIVE_BREAKPOINT = 1024;
  var RESPONSIVE_ROW_RATIO = 208 / 1280;

  var hero = document.querySelector(".hero");
  var frame = document.querySelector(".hero__frame");

  /* --- Composição responsiva ---------------------------------------------
     No desktop, o palco de 1280 × 832 é reduzido proporcionalmente. Abaixo
     de 1024 px, o CSS assume a composição em dimensões reais; o script apenas
     mantém as duas cruzetas no ritmo vertical já aprovado para a hero. */
  function fit() {
    if (!hero || !frame) return;

    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var vw = document.documentElement.clientWidth || viewportWidth;
    var vh = document.documentElement.clientHeight || window.innerHeight;
    if (!vw) return;

    if (viewportWidth < RESPONSIVE_BREAKPOINT) {
      var layoutRow = vw * RESPONSIVE_ROW_RATIO;
      var responsiveRows = 2 * Math.max(2, Math.ceil(vh / (2 * layoutRow)));
      var crossAIndex = responsiveRows <= 4 ? 1 : 2;
      var crossBIndex = Math.max(crossAIndex + 1, responsiveRows - 2);

      hero.style.setProperty("--stage-scale", 1);
      hero.style.setProperty("--cross-a-y", layoutRow * crossAIndex + "px");
      hero.style.setProperty("--cross-b-y", layoutRow * crossBIndex + "px");
      frame.style.removeProperty("height");
      return;
    }

    hero.style.removeProperty("--cross-a-y");
    hero.style.removeProperty("--cross-b-y");

    var scale = Math.min(1, vw / HERO_W);
    hero.style.setProperty("--stage-scale", scale);
    frame.style.height = HERO_H * scale + "px";
  }

  fit();
  window.addEventListener("resize", fit, { passive: true });

  /* --- Cargo digitado -----------------------------------------------------
     Alterna em loop entre "UX/UI Designer" e "Product Designer". O cursor
     acompanha o ciclo inteiro. Para trocar uma vez e parar no cargo novo,
     basta definir CARGO.repetir como false. */
  var CARGO = {
    ativo: true,
    repetir: true,
    de: "UX/UI Designer",
    para: "Product Designer",
    esperaInicial: 1800,
    apagar: 40,
    digitar: 65,
    pausaVazio: 350,
    pausaCheio: 2400
  };

  var role = document.querySelector(".hero__role");
  var roleText = document.querySelector(".hero__role-text");

  function digitarCargo() {
    if (!role || !roleText || !CARGO.ativo) return;

    var alvo = CARGO.para;
    var texto = CARGO.de;
    role.classList.add("is-typing");

    function apagar() {
      if (texto.length) {
        texto = texto.slice(0, -1);
        roleText.textContent = texto;
        setTimeout(apagar, CARGO.apagar);
        return;
      }
      setTimeout(escrever, CARGO.pausaVazio);
    }

    function escrever() {
      if (texto.length < alvo.length) {
        texto = alvo.slice(0, texto.length + 1);
        roleText.textContent = texto;
        setTimeout(escrever, CARGO.digitar);
        return;
      }
      if (!CARGO.repetir) {
        role.classList.remove("is-typing");
        return;
      }
      alvo = alvo === CARGO.para ? CARGO.de : CARGO.para;
      setTimeout(apagar, CARGO.pausaCheio);
    }

    setTimeout(apagar, CARGO.esperaInicial);
  }

  digitarCargo();

  /* --- Relógio ----------------------------------------------------------- */
  var clock = document.getElementById("hero-clock");

  function tick() {
    if (!clock) return;

    var now = new Date();
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).formatToParts(now);

    var map = {};
    parts.forEach(function (part) {
      map[part.type] = part.value;
    });

    var hour = String(map.hour || "").padStart(2, "0");
    var minute = String(map.minute || "").padStart(2, "0");
    var period = String(map.dayPeriod || "").toUpperCase();

    clock.textContent = hour + ":" + minute + " " + period;
    clock.setAttribute("datetime", hour + ":" + minute);
  }

  tick();
  setInterval(tick, 1000 * 15);
})();
