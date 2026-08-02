/* ==========================================================================
   NASSIF — footer de contato
   Travessia horizontal por scroll com GSAP + ScrollTrigger.
   ========================================================================== */

(function () {
  "use strict";

  var footer = document.querySelector(".footer-contact");
  if (!footer) return;

  var scene = footer.querySelector("[data-footer-scene]");
  var stage = footer.querySelector("[data-footer-stage]");
  var panel = footer.querySelector("[data-footer-panel]");
  var track = footer.querySelector("[data-footer-track]");
  var reveal = footer.querySelector("[data-footer-reveal]");
  var copy = footer.querySelector("[data-footer-copy]");
  var actions = footer.querySelector("[data-footer-actions]");
  var buttons = footer.querySelectorAll(".footer-contact__button");
  var skip = footer.querySelector("[data-footer-skip]");

  if (!scene || !stage || !panel || !track || !reveal || !actions || !buttons.length) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var matchMediaContext = null;
  var timeline = null;
  var currentTrigger = null;
  var actionsAvailable = true;
  var navigationEntry = window.performance && window.performance.getEntriesByType
    ? window.performance.getEntriesByType("navigation")[0]
    : null;
  var navigationIsReload = Boolean(navigationEntry && navigationEntry.type === "reload");

  function setActionsInteractive(active) {
    if (active === actionsAvailable) return;
    actionsAvailable = active;

    if (active) {
      reveal.removeAttribute("inert");
      reveal.removeAttribute("aria-hidden");
      if ("inert" in reveal) reveal.inert = false;
      return;
    }

    reveal.setAttribute("inert", "");
    reveal.setAttribute("aria-hidden", "true");
    if ("inert" in reveal) reveal.inert = true;
  }

  function restoreStatic() {
    setActionsInteractive(true);
    footer.classList.remove("footer-contact--enhanced");

    if (gsap) {
      gsap.set([panel, track, reveal, copy].concat(Array.prototype.slice.call(buttons)), {
        clearProps: "all"
      });
    }
  }

  function getScrollDistance(conditions) {
    var multiplier = conditions.mobile ? 1.4 : conditions.tablet ? 1.8 : 2.2;
    return Math.max(1, Math.round(window.innerHeight * multiplier));
  }

  function getTrackStart() {
    return window.innerWidth * 0.72;
  }

  function getTrackEnd() {
    return -track.scrollWidth - Math.max(24, window.innerWidth * 0.08);
  }

  function buildTimeline(context) {
    var conditions = context.conditions;
    var reduced = conditions.reduceMotion;
    var buttonList = Array.prototype.slice.call(buttons);

    setActionsInteractive(false);
    footer.classList.add("footer-contact--enhanced");

    gsap.set(panel, { yPercent: reduced ? 0 : 14 });
    gsap.set(track, { x: getTrackStart(), yPercent: -50 });
    gsap.set(copy, { autoAlpha: 0, y: reduced ? 0 : 40 });
    gsap.set(buttonList, { autoAlpha: 0, y: reduced ? 0 : 56 });

    timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: function () { return "+=" + getScrollDistance(conditions); },
        pin: stage,
        pinSpacing: true,
        scrub: reduced ? true : 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          setActionsInteractive(self.progress >= 0.815);
        },
        onRefresh: function (self) {
          setActionsInteractive(self.progress >= 0.815);
        }
      }
    });

    currentTrigger = timeline.scrollTrigger;

    timeline
      .to(panel, {
        yPercent: 0,
        duration: reduced ? 0.001 : 0.12,
        ease: reduced ? "none" : "power2.out"
      }, 0)
      .fromTo(track, {
        x: getTrackStart
      }, {
        x: getTrackEnd,
        duration: reduced ? 0.75 : 0.63,
        ease: "none"
      }, reduced ? 0 : 0.12)
      .to(copy, {
        autoAlpha: 1,
        y: 0,
        duration: 0.14,
        ease: reduced ? "none" : "power2.out"
      }, 0.82)
      .to(buttonList, {
        autoAlpha: 1,
        y: 0,
        duration: reduced ? 0.18 : 0.105,
        stagger: reduced ? 0 : 0.025,
        ease: reduced ? "none" : "power2.out"
      }, 0.82);

    return function () {
      setActionsInteractive(true);
      currentTrigger = null;
      timeline = null;
      footer.classList.remove("footer-contact--enhanced");
    };
  }

  function skipAnimation(event) {
    if (!currentTrigger || !timeline) return;
    event.preventDefault();

    setActionsInteractive(true);
    window.scrollTo({ top: currentTrigger.end, behavior: "auto" });
    timeline.progress(1);

    window.requestAnimationFrame(function () {
      var firstButton = actions.querySelector("a");
      if (firstButton) firstButton.focus({ preventScroll: true });
    });
  }

  function syncHashTarget() {
    if (!currentTrigger) return;

    if (window.location.hash === "#contato-acoes") {
      setActionsInteractive(true);
      window.scrollTo({ top: currentTrigger.end, behavior: "auto" });
      if (timeline) timeline.progress(1);
      return;
    }

    if (
      window.location.hash === "#contato" &&
      !navigationIsReload &&
      window.scrollY < currentTrigger.start * 0.25
    ) {
      window.scrollTo({ top: currentTrigger.start, behavior: "auto" });
    }
  }

  if (!gsap || !ScrollTrigger || !gsap.registerPlugin || !gsap.matchMedia) {
    restoreStatic();
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    matchMediaContext = gsap.matchMedia();
    matchMediaContext.add({
      reduceMotion: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 1024px)",
      tablet: "(min-width: 521px) and (max-width: 1023px)",
      mobile: "(max-width: 520px)"
    }, buildTimeline);

    window.requestAnimationFrame(function () {
      ScrollTrigger.refresh();
      syncHashTarget();
    });

    if (skip) skip.addEventListener("click", skipAnimation);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
        syncHashTarget();
      }).catch(function () {});
    }

    window.addEventListener("pageshow", function () {
      ScrollTrigger.refresh();
      syncHashTarget();
    });
  } catch (error) {
    if (matchMediaContext) matchMediaContext.revert();
    restoreStatic();
  }
})();
