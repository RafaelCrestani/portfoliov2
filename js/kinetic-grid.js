/* ==========================================================================
   NASSIF — Kinetic Grid
   Malha Canvas reutilizável: warp por mouse/trackpad e ripple por clique/toque.
   ========================================================================== */

(function () {
  "use strict";

  function initKineticGrid(container, canvas, options) {
    if (
      !container ||
      !canvas ||
      !canvas.getContext ||
      !window.requestAnimationFrame
    ) return null;

    if (canvas.__nassifKineticGrid) return canvas.__nassifKineticGrid;

    options = options || {};

    var context = canvas.getContext("2d");
    if (!context) return null;

    var rootStyle = null;
    var width = 0;
    var height = 0;
    var dpr = 1;
    var moduleSize = 64;
    var sampleStep = 16;
    var lineColor = "rgba(24, 24, 27, 0.12)";

    var warpRadius = 192;
    var warpForce = 16;
    var rippleDuration = 1200;
    var rippleSpeed = 320;
    var rippleMaxRadius = 384;
    var rippleAmplitude = 12;
    var rippleHalfWidth = 64;

    var pointer = {
      active: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0
    };

    var ripples = [];
    var frameId = 0;
    var lastFrameTime = 0;
    var resizeObserver = null;
    var visibilityObserver = null;
    var destroyed = false;
    var inViewport = true;
    var displacedX = 0;
    var displacedY = 0;

    var finePointerQuery = window.matchMedia
      ? window.matchMedia("(any-hover: hover) and (any-pointer: fine)")
      : null;

    function cssNumber(name, fallback) {
      var raw = rootStyle ? rootStyle.getPropertyValue(name) : "";
      var value = parseFloat(raw);
      return Number.isFinite(value) ? value : fallback;
    }

    function readTokens() {
      rootStyle = window.getComputedStyle(document.documentElement);
      moduleSize = cssNumber(
        window.innerWidth < 1024
          ? "--kinetic-grid-module-responsive"
          : "--kinetic-grid-module",
        window.innerWidth < 1024 ? 48 : 64
      );
      sampleStep = Math.max(4, moduleSize / 4);
      lineColor = options.lineColor ||
        rootStyle.getPropertyValue("--hero-grid-line").trim() ||
        lineColor;
      warpRadius = cssNumber("--kinetic-warp-radius", 192);
      warpForce = cssNumber("--kinetic-warp-force", 16);
      rippleDuration = cssNumber("--kinetic-ripple-duration", 1200);
      rippleSpeed = cssNumber("--kinetic-ripple-speed", 320);
      rippleMaxRadius = cssNumber("--kinetic-ripple-max-radius", 384);
      rippleAmplitude = cssNumber("--kinetic-ripple-amplitude", 12);
      rippleHalfWidth = cssNumber("--kinetic-ripple-half-width", 64);
    }

    function localPoint(event) {
      var rect = container.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function canWarp(event) {
      if (event.pointerType === "touch") return false;
      if (finePointerQuery) return finePointerQuery.matches;
      return !event.pointerType || event.pointerType === "mouse";
    }

    function scheduleFrame() {
      if (destroyed || document.hidden || !inViewport || frameId) return;
      frameId = window.requestAnimationFrame(render);
    }

    function resize() {
      if (destroyed) return;

      var rect = container.getBoundingClientRect();
      var nextWidth = Math.max(1, Math.round(rect.width));
      var nextHeight = Math.max(1, Math.round(rect.height));
      var nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      readTokens();
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineWidth = 1;
      context.strokeStyle = lineColor;

      pointer.active = false;
      pointer.strength = 0;
      ripples.length = 0;
      lastFrameTime = 0;
      canvas.dataset.kineticReady = "true";
      scheduleFrame();
    }

    function addRipple(event) {
      if (destroyed) return;

      var point = localPoint(event);
      ripples.push({
        x: point.x,
        y: point.y,
        startedAt: window.performance ? performance.now() : Date.now()
      });
      if (ripples.length > 3) ripples.shift();
      scheduleFrame();
    }

    function movePointer(event) {
      if (!canWarp(event)) return;

      var point = localPoint(event);
      pointer.targetX = point.x;
      pointer.targetY = point.y;
      if (!pointer.active && pointer.strength < 0.001) {
        pointer.x = point.x;
        pointer.y = point.y;
      }
      pointer.active = true;
      scheduleFrame();
    }

    function releasePointer() {
      if (!pointer.active && pointer.strength <= 0) return;
      pointer.active = false;
      scheduleFrame();
    }

    function resetEffects(redraw) {
      pointer.active = false;
      pointer.strength = 0;
      ripples.length = 0;
      lastFrameTime = 0;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      if (redraw && !document.hidden) scheduleFrame();
    }

    function updatePointer(delta) {
      var positionEase = 1 - Math.pow(0.001, delta / 700);
      var strengthEase = 1 - Math.pow(0.001, delta / 520);
      var desiredStrength = pointer.active ? 1 : 0;

      pointer.x += (pointer.targetX - pointer.x) * positionEase;
      pointer.y += (pointer.targetY - pointer.y) * positionEase;
      pointer.strength += (desiredStrength - pointer.strength) * strengthEase;

      if (!pointer.active && pointer.strength < 0.001) pointer.strength = 0;

      return (
        Math.abs(pointer.targetX - pointer.x) > 0.05 ||
        Math.abs(pointer.targetY - pointer.y) > 0.05 ||
        Math.abs(desiredStrength - pointer.strength) > 0.001
      );
    }

    function displace(x, y, now) {
      var dx = 0;
      var dy = 0;

      if (pointer.strength > 0) {
        var pointerX = pointer.x - x;
        var pointerY = pointer.y - y;
        var pointerDistance = Math.sqrt(pointerX * pointerX + pointerY * pointerY) || 1;
        var influence = Math.max(0, 1 - pointerDistance / warpRadius);
        var smoothInfluence = influence * influence * (3 - 2 * influence);
        var pull = warpForce * smoothInfluence * pointer.strength;
        dx += pointerX / pointerDistance * pull;
        dy += pointerY / pointerDistance * pull;
      }

      for (var index = 0; index < ripples.length; index++) {
        var ripple = ripples[index];
        var age = now - ripple.startedAt;
        var progress = Math.max(0, Math.min(1, age / rippleDuration));
        var radius = Math.min(rippleSpeed * age / 1000, rippleMaxRadius);
        var rippleX = x - ripple.x;
        var rippleY = y - ripple.y;
        var distance = Math.sqrt(rippleX * rippleX + rippleY * rippleY) || 1;
        var offset = distance - radius;

        if (Math.abs(offset) <= rippleHalfWidth) {
          var envelope = Math.cos(offset / rippleHalfWidth * Math.PI / 2);
          var decay = Math.pow(1 - progress, 2);
          var push = rippleAmplitude * envelope * decay;
          dx += rippleX / distance * push;
          dy += rippleY / distance * push;
        }
      }

      displacedX = x + dx;
      displacedY = y + dy;
    }

    function drawGrid(now) {
      var startX = -moduleSize;
      var endX = width + moduleSize;
      var startY = -moduleSize;
      var endY = height + moduleSize;
      var x;
      var y;

      context.clearRect(0, 0, width, height);
      context.strokeStyle = lineColor;
      context.lineWidth = 1;

      for (x = startX; x <= endX; x += moduleSize) {
        context.beginPath();
        for (y = startY; y <= endY; y += sampleStep) {
          displace(x, y, now);
          if (y === startY) context.moveTo(displacedX, displacedY);
          else context.lineTo(displacedX, displacedY);
        }
        context.stroke();
      }

      for (y = startY; y <= endY; y += moduleSize) {
        context.beginPath();
        for (x = startX; x <= endX; x += sampleStep) {
          displace(x, y, now);
          if (x === startX) context.moveTo(displacedX, displacedY);
          else context.lineTo(displacedX, displacedY);
        }
        context.stroke();
      }
    }

    function pruneRipples(now) {
      for (var index = ripples.length - 1; index >= 0; index--) {
        if (now - ripples[index].startedAt >= rippleDuration) {
          ripples.splice(index, 1);
        }
      }
    }

    function render(now) {
      frameId = 0;
      if (destroyed || document.hidden || !inViewport) return;

      var delta = lastFrameTime ? Math.min(32, now - lastFrameTime) : 16;
      lastFrameTime = now;
      var pointerMoving = updatePointer(delta);
      pruneRipples(now);
      drawGrid(now);

      if (pointerMoving || ripples.length) scheduleFrame();
      else lastFrameTime = 0;
    }

    function handleVisibility() {
      resetEffects(!document.hidden && inViewport);
    }

    function handleCapabilityChange() {
      if (!finePointerQuery || finePointerQuery.matches) return;
      releasePointer();
    }

    function handlePageHide(event) {
      if (event && event.persisted) {
        resetEffects(false);
        return;
      }
      destroy();
    }

    function handlePageShow() {
      if (destroyed) return;
      resize();
    }

    function handleIntersection(entries) {
      if (!entries.length || destroyed) return;
      inViewport = entries[0].isIntersecting;
      if (inViewport) scheduleFrame();
      else resetEffects(false);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      resetEffects(false);
      container.removeEventListener("pointermove", movePointer);
      container.removeEventListener("pointerleave", releasePointer);
      container.removeEventListener("pointercancel", releasePointer);
      container.removeEventListener("pointerdown", addRipple);
      window.removeEventListener("blur", releasePointer);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);

      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", resize);
      if (visibilityObserver) visibilityObserver.disconnect();

      if (finePointerQuery) {
        if (finePointerQuery.removeEventListener) {
          finePointerQuery.removeEventListener("change", handleCapabilityChange);
        } else if (finePointerQuery.removeListener) {
          finePointerQuery.removeListener(handleCapabilityChange);
        }
      }

      delete canvas.__nassifKineticGrid;
    }

    var instance = {
      destroy: destroy,
      resize: resize,
      redraw: scheduleFrame
    };
    canvas.__nassifKineticGrid = instance;

    container.addEventListener("pointermove", movePointer, { passive: true });
    container.addEventListener("pointerleave", releasePointer, { passive: true });
    container.addEventListener("pointercancel", releasePointer, { passive: true });
    container.addEventListener("pointerdown", addRipple, { passive: true });
    window.addEventListener("blur", releasePointer);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);

    if (finePointerQuery) {
      if (finePointerQuery.addEventListener) {
        finePointerQuery.addEventListener("change", handleCapabilityChange);
      } else if (finePointerQuery.addListener) {
        finePointerQuery.addListener(handleCapabilityChange);
      }
    }

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    if (window.IntersectionObserver) {
      visibilityObserver = new IntersectionObserver(handleIntersection, {
        rootMargin: "128px 0px"
      });
      visibilityObserver.observe(container);
    }

    resize();
    return instance;
  }

  window.NassifKineticGrid = {
    init: initKineticGrid
  };

  var hero = document.querySelector(".hero");
  var heroCanvas = document.querySelector(".hero__kinetic-grid");
  if (hero && heroCanvas) initKineticGrid(hero, heroCanvas);
})();
