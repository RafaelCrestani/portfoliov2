(function () {
  "use strict";

  var experience = document.querySelector(".experience");
  if (!experience) return;

  var root = document.documentElement;
  var groups = experience.querySelectorAll("[data-experience-motion-group]");
  var chapters = experience.querySelectorAll("[data-experience-chapter]");
  var indexLinks = experience.querySelectorAll(".experience__index a");
  var count = experience.querySelector("[data-experience-count]");
  var mobileCount = experience.querySelector("[data-experience-mobile-count]");
  var mobileProgress = experience.querySelector(".experience__mobile-progress");
  var storagePrefix = "nassif.experience.motion.v1.";

  function pendingClass(group) {
    return "experience-motion-pending--" + group.dataset.experienceMotionGroup;
  }

  function clearFailSafe() {
    if (!window.__experienceMotionFailSafe) return;

    clearTimeout(window.__experienceMotionFailSafe);
    window.__experienceMotionFailSafe = null;
  }

  function failOpen() {
    clearFailSafe();

    groups.forEach(function (group) {
      root.classList.remove(pendingClass(group));
      group.classList.add("is-motion-visible");
    });
  }

  function markSeen(group) {
    try {
      sessionStorage.setItem(
        storagePrefix + group.dataset.experienceMotionGroup,
        "1"
      );
    } catch (storageError) {
      /* Storage bloqueado: o grupo continua visível neste carregamento. */
    }
  }

  function reveal(group) {
    if (!group || group.classList.contains("is-motion-visible")) return;

    root.classList.remove(pendingClass(group));
    group.classList.add("is-motion-visible");
    markSeen(group);
  }

  function chapterIndex(chapter) {
    return Array.prototype.indexOf.call(chapters, chapter);
  }

  function numberLabel(index) {
    var value = index + 1;
    return value < 10 ? "0" + value : String(value);
  }

  function updateActive(chapter) {
    var index = chapterIndex(chapter);
    if (index < 0) return;

    indexLinks.forEach(function (link, linkIndex) {
      var active = linkIndex === index;
      link.classList.toggle("is-active", active);

      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    var label = numberLabel(index);
    if (count) count.textContent = label;
    if (mobileCount) mobileCount.textContent = label;
    if (mobileProgress) {
      mobileProgress.style.setProperty(
        "--experience-progress",
        String((index + 1) / chapters.length)
      );
    }
  }

  function initialChapter() {
    var target = null;

    try {
      target = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
    } catch (selectorError) {
      target = null;
    }

    if (target && target.hasAttribute("data-experience-chapter")) return target;
    return chapters[0] || null;
  }

  try {
    clearFailSafe();
    updateActive(initialChapter());

    groups.forEach(function (group) {
      if (!root.classList.contains(pendingClass(group))) {
        group.classList.add("is-motion-visible");
      }
    });

    if (!("IntersectionObserver" in window)) {
      failOpen();
      return;
    }

    var motionObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px"
    });

    groups.forEach(function (group) {
      if (root.classList.contains(pendingClass(group))) {
        motionObserver.observe(group);
      }
    });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) updateActive(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: "-42% 0px -42% 0px"
    });

    chapters.forEach(function (chapter) {
      activeObserver.observe(chapter);
    });
  } catch (experienceError) {
    failOpen();
  }
})();
