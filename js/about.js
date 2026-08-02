(function () {
  "use strict";

  var about = document.querySelector(".about");
  if (!about) return;

  var root = document.documentElement;
  var groups = about.querySelectorAll("[data-about-motion-group]");
  var chapters = about.querySelectorAll("[data-about-chapter]");
  var indexLinks = about.querySelectorAll(".about__index a");
  var railCount = about.querySelector("[data-about-rail-count]");
  var storagePrefix = "nassif.about.motion.v3.";

  function pendingClass(group) {
    return "about-motion-pending--" + group.dataset.aboutMotionGroup;
  }

  function failOpen() {
    if (window.__aboutMotionFailSafe) {
      clearTimeout(window.__aboutMotionFailSafe);
      window.__aboutMotionFailSafe = null;
    }

    groups.forEach(function (group) {
      root.classList.remove(pendingClass(group));
      group.classList.add("is-motion-visible");
    });
  }

  function markSeen(group) {
    try {
      sessionStorage.setItem(
        storagePrefix + group.dataset.aboutMotionGroup,
        "1"
      );
    } catch (storageError) {
      /* Storage bloqueado: a animação segue válida para este carregamento. */
    }
  }

  function countMetric(group) {
    if (!group || group.dataset.aboutMotionGroup !== "opening") return;

    var counter = group.querySelector("[data-about-count]");
    var metric = counter && counter.parentNode;
    if (!counter || !metric || metric.classList.contains("is-counting")) return;

    var target = 6;
    var duration = 700;
    var delay = 160;
    var startAt = null;

    counter.textContent = "0";
    metric.classList.add("is-counting");

    function frame(now) {
      if (startAt === null) startAt = now + delay;
      if (now < startAt) {
        requestAnimationFrame(frame);
        return;
      }

      var progress = Math.min(1, (now - startAt) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      counter.textContent = String(target);
      metric.classList.remove("is-counting");
    }

    requestAnimationFrame(frame);
  }

  function reveal(group, observer) {
    if (!group || group.classList.contains("is-motion-visible")) return;
    countMetric(group);
    group.classList.add("is-motion-visible");
    markSeen(group);
    if (observer) observer.unobserve(group);
  }

  function revealAfterPaint(group, observer) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        reveal(group, observer);
      });
    });
  }

  /* Movimento editorial. Os grupos já vistos não recebem classe pendente no
     preflight e permanecem visíveis; os demais são revelados uma única vez. */
  if ("IntersectionObserver" in window && groups.length) {
    try {
      var opening = about.querySelector('[data-about-motion-group="opening"]');
      var openingTrigger = opening && opening.querySelector(".about__opening-layout");
      var motionChapters = about.querySelectorAll(
        '[data-about-motion-group="origem"], ' +
        '[data-about-motion-group="transicao"]'
      );

      var openingObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(opening, null);
          openingObserver.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.08
      });

      var chapterMotionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) reveal(entry.target, chapterMotionObserver);
        });
      }, {
        rootMargin: "-30% 0px -45% 0px",
        threshold: 0
      });

      function prepare(group, target, observer, activationLine) {
        if (!group) return;

        if (!root.classList.contains(pendingClass(group))) {
          group.classList.add("is-motion-visible");
          return;
        }

        var observedTarget = target || group;
        var rect = observedTarget.getBoundingClientRect();
        if (rect.top <= activationLine) {
          revealAfterPaint(group, observer);
        } else {
          observer.observe(observedTarget);
        }
      }

      function revealPassedGroups() {
        var viewportH = window.innerHeight ||
          document.documentElement.clientHeight || 0;

        if (opening &&
            root.classList.contains(pendingClass(opening)) &&
            openingTrigger.getBoundingClientRect().top <= viewportH * 0.88) {
          revealAfterPaint(opening, null);
          openingObserver.unobserve(openingTrigger);
        }

        motionChapters.forEach(function (chapter) {
          if (root.classList.contains(pendingClass(chapter)) &&
              chapter.getBoundingClientRect().top <= viewportH * 0.55) {
            revealAfterPaint(chapter, chapterMotionObserver);
          }
        });
      }

      var viewportH = window.innerHeight ||
        document.documentElement.clientHeight || 0;
      prepare(opening, openingTrigger, openingObserver, viewportH * 0.88);
      motionChapters.forEach(function (chapter) {
        prepare(chapter, chapter, chapterMotionObserver, viewportH * 0.55);
      });

      window.addEventListener("load", revealPassedGroups, { once: true });
      window.addEventListener("hashchange", revealPassedGroups);

      if (window.__aboutMotionFailSafe) {
        clearTimeout(window.__aboutMotionFailSafe);
        window.__aboutMotionFailSafe = null;
      }
    } catch (motionError) {
      failOpen();
    }
  } else {
    failOpen();
  }

  /* O índice acompanha o capítulo predominante na faixa central da tela. */
  function activate(id) {
    indexLinks.forEach(function (link, index) {
      var active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");

      if (active && railCount) {
        railCount.textContent = String(index + 1).padStart(2, "0");
      }
    });
  }

  var initialChapterId = chapters.length ? chapters[0].id : "";
  var hashChapterId = window.location.hash.replace(/^#/, "");

  chapters.forEach(function (chapter) {
    if (chapter.id === hashChapterId) initialChapterId = chapter.id;
  });

  if (initialChapterId) activate(initialChapterId);

  indexLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      activate(link.getAttribute("href").replace(/^#/, ""));
    });
  });

  if ("IntersectionObserver" in window && chapters.length) {
    try {
      var indexObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target.id);
        });
      }, {
        rootMargin: "-38% 0px -48% 0px",
        threshold: 0
      });

      chapters.forEach(function (chapter) {
        indexObserver.observe(chapter);
      });
    } catch (indexError) {
      /* O conteúdo segue navegável mesmo sem o estado ativo automático. */
    }
  }
})();
