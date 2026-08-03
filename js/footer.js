/* ==========================================================================
   NASSIF — footer de contato
   Cascata tipográfica e travessia horizontal por scroll com GSAP.
   ========================================================================== */

(function () {
  "use strict";

  var footer = document.querySelector(".footer-contact");
  if (!footer) return;

  var scene = footer.querySelector("[data-footer-scene]");
  var stage = footer.querySelector("[data-footer-stage]");
  var panel = footer.querySelector("[data-footer-panel]");
  var track = footer.querySelector("[data-footer-track]");
  var prompt = footer.querySelector(".footer-contact__prompt");
  var reveal = footer.querySelector("[data-footer-reveal]");
  var copy = footer.querySelector("[data-footer-copy]");
  var actions = footer.querySelector("[data-footer-actions]");
  var buttons = footer.querySelectorAll(".footer-contact__button");
  var skip = footer.querySelector("[data-footer-skip]");

  if (
    !scene || !stage || !panel || !track || !prompt ||
    !reveal || !copy || !actions || !buttons.length
  ) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var matchMediaContext = null;
  var timeline = null;
  var currentTrigger = null;
  var actionsAvailable = true;
  var pendingActionsLock = false;
  var focusOutFrame = 0;
  var promptOriginalMarkup = prompt.innerHTML;
  var promptOriginalAriaLabel = prompt.getAttribute("aria-label");
  var promptAccessibleText = prompt.textContent.replace(/\s+/g, " ").trim();
  var navigationEntry = window.performance && window.performance.getEntriesByType
    ? window.performance.getEntriesByType("navigation")[0]
    : null;
  var navigationIsReload = Boolean(navigationEntry && navigationEntry.type === "reload");

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function getCharacters() {
    return toArray(prompt.querySelectorAll(".footer-contact__char"));
  }

  function preparePromptCharacters() {
    if (prompt.getAttribute("data-footer-characters-ready") === "true") {
      return getCharacters();
    }

    var visual = document.createElement("span");
    var accentStart = promptAccessibleText.indexOf(" ") + 1;

    visual.className = "footer-contact__prompt-visual";
    visual.setAttribute("aria-hidden", "true");

    Array.from(promptAccessibleText).forEach(function (character, index) {
      var characterNode = document.createElement("span");
      characterNode.className = "footer-contact__char";
      characterNode.style.setProperty("--footer-char-index", index);

      if (character === " ") {
        characterNode.classList.add("footer-contact__char--space");
        characterNode.innerHTML = "&nbsp;";
      } else {
        characterNode.textContent = character;
      }

      if (accentStart > 0 && index >= accentStart) {
        characterNode.classList.add("footer-contact__char--accent");
      }

      visual.appendChild(characterNode);
    });

    prompt.textContent = "";
    prompt.setAttribute("aria-label", promptAccessibleText);
    prompt.setAttribute("data-footer-characters-ready", "true");
    prompt.appendChild(visual);

    return getCharacters();
  }

  function restorePromptMarkup() {
    prompt.innerHTML = promptOriginalMarkup;
    prompt.removeAttribute("data-footer-characters-ready");

    if (promptOriginalAriaLabel === null) {
      prompt.removeAttribute("aria-label");
    } else {
      prompt.setAttribute("aria-label", promptOriginalAriaLabel);
    }
  }

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

  function timelineActionsAreReady() {
    if (!timeline || !timeline.labels || timeline.labels.actionsReady === undefined) {
      return false;
    }

    return timeline.time() >= timeline.labels.actionsReady - 0.001;
  }

  function syncActionsInteractive(active) {
    if (!active && reveal.contains(document.activeElement)) {
      pendingActionsLock = true;
      return;
    }

    pendingActionsLock = false;
    setActionsInteractive(active);
  }

  function handleRevealFocusOut(event) {
    if (event.relatedTarget && reveal.contains(event.relatedTarget)) return;

    if (focusOutFrame) window.cancelAnimationFrame(focusOutFrame);
    focusOutFrame = window.requestAnimationFrame(function () {
      focusOutFrame = 0;

      if (!reveal.contains(document.activeElement) && !timelineActionsAreReady()) {
        pendingActionsLock = false;
        setActionsInteractive(false);
      }
    });
  }

  function handleDocumentFocusIn() {
    if (
      pendingActionsLock &&
      !reveal.contains(document.activeElement) &&
      !timelineActionsAreReady()
    ) {
      pendingActionsLock = false;
      setActionsInteractive(false);
    }
  }

  function clearMotionProps(characters) {
    if (!gsap) return;

    gsap.set(
      [panel, track, copy].concat(characters || [], toArray(buttons)),
      { clearProps: "transform,opacity,visibility,willChange" }
    );
  }

  function restoreStatic() {
    var characters = getCharacters();

    if (focusOutFrame) {
      window.cancelAnimationFrame(focusOutFrame);
      focusOutFrame = 0;
    }

    pendingActionsLock = false;
    setActionsInteractive(true);
    footer.classList.remove("footer-contact--enhanced");
    clearMotionProps(characters);
    restorePromptMarkup();
  }

  function getScrollDistance(conditions) {
    var multiplier = conditions.mobile ? 1 : conditions.tablet ? 1.2 : 1.4;
    return Math.max(1, Math.round(window.innerHeight * multiplier));
  }

  function getTrackStart() {
    var phraseWidth = Math.max(1, track.scrollWidth);
    var targetVisibleWidth = phraseWidth * 0.3;
    var safeInset = Math.max(20, window.innerWidth * 0.08);
    var visibleWidth = Math.min(targetVisibleWidth, window.innerWidth - safeInset);

    return window.innerWidth - visibleWidth;
  }

  function getTrackEnd() {
    return -track.scrollWidth - Math.max(24, window.innerWidth * 0.08);
  }

  function getCharacterDrop(conditions) {
    if (conditions.reduceMotion) return 12;
    if (conditions.mobile) return 20;
    if (conditions.tablet) return 28;
    return 36;
  }

  function buildTimeline(context) {
    var conditions = context.conditions;
    var reduced = conditions.reduceMotion;
    var buttonList = toArray(buttons);
    var characters = preparePromptCharacters();
    var localTimeline = null;
    var characterStagger = reduced ? 0 : conditions.mobile ? 0.005 : 0.007;
    var characterDuration = reduced ? 0.1 : 0.16;
    var buttonStagger = reduced ? 0 : 0.018;
    var buttonDuration = reduced ? 0.12 : 0.12;
    var buttonStart = 0.76;
    var actionsReadyTime = buttonStart + buttonStagger * (buttonList.length - 1) + buttonDuration * 0.6;

    setActionsInteractive(false);
    footer.classList.add("footer-contact--enhanced");

    gsap.set(panel, { yPercent: reduced ? 0 : 3 });
    gsap.set(track, { x: getTrackStart(), yPercent: -50 });
    gsap.set(characters, {
      autoAlpha: 0.3,
      y: -getCharacterDrop(conditions)
    });
    gsap.set(copy, {
      autoAlpha: 0,
      yPercent: reduced ? 16 : 72
    });
    gsap.set(buttonList, {
      autoAlpha: 0,
      y: reduced ? 8 : 32
    });

    localTimeline = gsap.timeline({
      defaults: { ease: reduced ? "none" : "power2.out" },
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: function () { return "+=" + getScrollDistance(conditions); },
        pin: stage,
        pinSpacing: true,
        scrub: reduced ? true : 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function () {
          syncActionsInteractive(timelineActionsAreReady());
        },
        onRefresh: function () {
          syncActionsInteractive(timelineActionsAreReady());
        }
      }
    });

    timeline = localTimeline;
    currentTrigger = localTimeline.scrollTrigger;

    localTimeline
      .to(panel, {
        yPercent: 0,
        duration: reduced ? 0.001 : 0.1,
        ease: reduced ? "none" : "power2.out"
      }, 0)
      .to(characters, {
        autoAlpha: 1,
        y: 0,
        duration: characterDuration,
        stagger: characterStagger,
        ease: reduced ? "none" : "power2.out"
      }, reduced ? 0.01 : 0.04)
      .fromTo(track, {
        x: function () { return getTrackStart(); }
      }, {
        x: function () { return getTrackEnd(); },
        duration: reduced ? 0.72 : 0.68,
        ease: "none"
      }, reduced ? 0.02 : 0.06)
      .to(copy, {
        autoAlpha: 1,
        yPercent: 0,
        duration: reduced ? 0.1 : 0.12,
        ease: reduced ? "none" : "power3.out"
      }, 0.72)
      .to(buttonList, {
        autoAlpha: 1,
        y: 0,
        duration: buttonDuration,
        stagger: buttonStagger,
        ease: reduced ? "none" : "power3.out"
      }, buttonStart)
      .addLabel("actionsReady", actionsReadyTime);

    return function () {
      if (focusOutFrame) {
        window.cancelAnimationFrame(focusOutFrame);
        focusOutFrame = 0;
      }

      pendingActionsLock = false;
      setActionsInteractive(true);

      if (localTimeline.scrollTrigger) localTimeline.scrollTrigger.kill();
      localTimeline.kill();
      clearMotionProps(characters);
      footer.classList.remove("footer-contact--enhanced");

      if (timeline === localTimeline) timeline = null;
      if (currentTrigger === localTimeline.scrollTrigger) currentTrigger = null;
    };
  }

  function skipAnimation(event) {
    if (!currentTrigger || !timeline) return;
    event.preventDefault();

    pendingActionsLock = false;
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
      pendingActionsLock = false;
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

  reveal.addEventListener("focusout", handleRevealFocusOut);
  document.addEventListener("focusin", handleDocumentFocusIn);

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
