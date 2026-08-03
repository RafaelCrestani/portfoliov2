(function () {
  "use strict";

  var linkSelector = 'a[data-editorial-scroll][href^="#"]';
  var scrollFrame = 0;
  var scrollRunning = false;
  var scrollDuration = 800;

  function durationFor(link) {
    var value = Number(link.getAttribute("data-scroll-duration"));

    return Number.isFinite(value) && value > 0
      ? value
      : scrollDuration;
  }

  function easeInOutCubic(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function cancel() {
    if (!scrollRunning) return;

    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    scrollRunning = false;
  }

  function targetTop(target) {
    var targetStyle = window.getComputedStyle(target);
    var marginTop = parseFloat(targetStyle.scrollMarginTop) || 0;
    var top = window.scrollY + target.getBoundingClientRect().top - marginTop;
    var maximum = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

    return Math.min(maximum, Math.max(0, top));
  }

  function updateHash(hash) {
    if (!window.history || !window.history.pushState) return;

    if (window.location.hash === hash) {
      window.history.replaceState(null, "", hash);
    } else {
      window.history.pushState(null, "", hash);
    }
  }

  function scrollToTarget(target, hash, instant, duration) {
    cancel();

    var startTop = window.scrollY;
    var endTop = targetTop(target);
    var distance = endTop - startTop;
    var startTime = null;

    if (instant || Math.abs(distance) <= 1) {
      window.scrollTo(0, endTop);
      updateHash(hash);
      return;
    }

    scrollRunning = true;

    function step(timestamp) {
      if (!scrollRunning) return;
      if (startTime === null) startTime = timestamp;

      var progress = Math.min(1, (timestamp - startTime) / duration);
      var easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startTop + distance * easedProgress);

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step);
        return;
      }

      scrollFrame = 0;
      scrollRunning = false;
      window.scrollTo(0, endTop);
      updateHash(hash);
    }

    scrollFrame = window.requestAnimationFrame(step);
  }

  function eligibleClick(event, link) {
    var targetName = link.getAttribute("target");

    return !(
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (targetName && targetName !== "_self")
    );
  }

  if (
    document.addEventListener &&
    window.requestAnimationFrame &&
    window.cancelAnimationFrame
  ) {
    document.addEventListener("click", function (event) {
      var origin = event.target;
      var link = origin && origin.closest ? origin.closest(linkSelector) : null;
      if (!link || !eligibleClick(event, link)) return;

      var hash = link.getAttribute("href");
      var target = null;

      try {
        target = hash ? document.querySelector(hash) : null;
      } catch (selectorError) {
        return;
      }

      if (!target) return;

      event.preventDefault();
      var instantReduced =
        link.hasAttribute("data-scroll-instant-reduced") &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      scrollToTarget(target, hash, instantReduced, durationFor(link));
    });

    ["wheel", "touchstart", "pointerdown"].forEach(function (eventName) {
      window.addEventListener(eventName, cancel, { passive: true });
    });

    window.addEventListener("keydown", function (event) {
      var scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar"
      ];

      if (scrollKeys.indexOf(event.key) !== -1) cancel();
    });
  }
})();
