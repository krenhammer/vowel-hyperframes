/**
 * Mock quadrant zoom (vowel-tickets): 2× scale with xPercent / yPercent panning.
 *
 * **Holding a zoom while other anims run** — the zoom target only changes when you call
 * `hfMockQuadrant.addSegment` / `setState`. Gaps in time on your timeline = hold. Example:
 *   var t = 1.0;
 *   t = hfMockQuadrant.addSegment(tl, sel, t, "full", "nw", { scale:2, duration:0.75, fabTrackSelectors:f });
 *   t += 1.2;  // at times inside this window, use tl.to(..., t2) for other elements — still zoomed to NW
 *   t = hfMockQuadrant.addSegment(tl, sel, t, "nw", "ne", { scale:2, duration:0.7 });
 * Data on the zoom target: data-mock-qz-scale, data-mock-qz-pan (per-segment pan duration
 * in addTour), data-mock-qz-hold (addTour’s hold after NW only).
 */
(function () {
  "use strict";

  function g() {
    return typeof window.gsap !== "undefined" && window.gsap;
  }
  var commonT = { force3D: true, overwrite: "auto" };

  var STATES = ["full", "nw", "ne", "se", "sw"];

  /**
   * @param {number} s - zoom level when not full
   * @param {string} which - "full" | "nw" | "ne" | "se" | "sw"
   */
  function getState(s, which) {
    if (which === "full") {
      return { scale: 1, xPercent: 0, yPercent: 0, transformOrigin: "50% 50%" };
    }
    if (which === "nw") {
      return { scale: s, xPercent: 0, yPercent: 0, transformOrigin: "0% 0%" };
    }
    if (which === "ne") {
      return { scale: s, xPercent: -100, yPercent: 0, transformOrigin: "0% 0%" };
    }
    if (which === "se") {
      return { scale: s, xPercent: -100, yPercent: -100, transformOrigin: "0% 0%" };
    }
    if (which === "sw") {
      return { scale: s, xPercent: 0, yPercent: -100, transformOrigin: "0% 0%" };
    }
    return getState(s, "full");
  }

  function isFull(which) {
    return which === "full";
  }

  function fabScaleFor(s, which) {
    return isFull(which) ? 1 : 1 / s;
  }

  function readScaleFromEl(mainSel) {
    var el = null;
    try {
      el = document.querySelector(mainSel);
    } catch (e) {
      return NaN;
    }
    if (!el) {
      return NaN;
    }
    var a = el.getAttribute("data-mock-qz-scale");
    if (a == null) {
      return NaN;
    }
    return parseFloat(a, 10);
  }

  function normalizeFabList(fabTrackSelectors) {
    if (fabTrackSelectors == null) {
      return [];
    }
    if (typeof fabTrackSelectors === "string") {
      return [fabTrackSelectors];
    }
    return Array.isArray(fabTrackSelectors) ? fabTrackSelectors.slice() : [];
  }

  function addFabSegment(timeline, tStart, duration, fromWhich, toWhich, scale, fabList, ease) {
    if (!fabList || !fabList.length) {
      return;
    }
    var fs = fabScaleFor(scale, fromWhich);
    var ts = fabScaleFor(scale, toWhich);
    if (Math.abs(fs - ts) < 0.0001) {
      return;
    }
    var e = ease != null ? ease : "sine.inOut";
    var fc = { transformOrigin: "50% 50%", ...commonT };
    for (var i = 0; i < fabList.length; i++) {
      var fsel = fabList[i];
      if (!fsel) {
        continue;
      }
      timeline.fromTo(fsel, { scale: fs, ...fc }, { scale: ts, duration: duration, ease: e, ...fc }, tStart);
    }
  }

  /**
   * Tween the main node (and optional FABs) from fromState to toState.
   * @returns {number} tStart + duration
   */
  function addSegment(timeline, mainSelector, tStart, fromState, toState, opts) {
    if (!g()) {
      return tStart;
    }
    opts = opts || {};
    if (fromState === toState) {
      return tStart;
    }
    var fabList = normalizeFabList(opts.fabTrackSelectors);
    var fromAttr = readScaleFromEl(mainSelector);
    var scale = typeof opts.scale === "number" && opts.scale > 0 ? opts.scale : fromAttr;
    if (isNaN(scale) || scale <= 0) {
      scale = 2;
    }
    var duration = 0.7;
    if (fromState === "full" && toState === "nw") {
      if (typeof opts.zoomInDuration === "number") {
        duration = opts.zoomInDuration;
      } else if (typeof opts.duration === "number" && opts.duration >= 0) {
        duration = opts.duration;
      } else {
        duration = 0.75;
      }
    } else if (toState === "full") {
      if (typeof opts.resetDuration === "number") {
        duration = opts.resetDuration;
      } else if (typeof opts.duration === "number" && opts.duration >= 0) {
        duration = opts.duration;
      } else {
        duration = 0.65;
      }
    } else {
      if (typeof opts.duration === "number" && opts.duration >= 0) {
        duration = opts.duration;
      } else {
        duration = 0.7;
      }
    }
    var ease = typeof opts.ease === "string" ? opts.ease : "sine.inOut";
    if (toState === "full" && typeof opts.easeOut === "string") {
      ease = opts.easeOut;
    }
    if (duration <= 0) {
      setState(timeline, mainSelector, tStart, toState, opts);
      return tStart;
    }
    var fromP = getState(scale, fromState);
    var toP = getState(scale, toState);
    if (fromState === "full" && toState === "nw") {
      timeline.set(mainSelector, { xPercent: 0, yPercent: 0, transformOrigin: "0% 0%", ...commonT }, tStart);
      timeline.fromTo(
        mainSelector,
        { scale: 1, xPercent: 0, yPercent: 0, transformOrigin: "0% 0%", ...commonT },
        { ...toP, duration: duration, ease: ease, ...commonT },
        tStart
      );
    } else {
      timeline.fromTo(
        mainSelector,
        { ...fromP, ...commonT },
        { ...toP, duration: duration, ease: ease, ...commonT },
        tStart
      );
    }
    if (duration > 0 && fabList.length) {
      addFabSegment(timeline, tStart, duration, fromState, toState, scale, fabList, ease);
    }
    return tStart + duration;
  }

  function setState(timeline, mainSelector, t, toState, opts) {
    if (!g()) {
      return;
    }
    opts = opts || {};
    var fromAttr = readScaleFromEl(mainSelector);
    var scale = typeof opts.scale === "number" && opts.scale > 0 ? opts.scale : fromAttr;
    if (isNaN(scale) || scale <= 0) {
      scale = 2;
    }
    var p = getState(scale, toState);
    var fabList = normalizeFabList(opts.fabTrackSelectors);
    var fs = fabScaleFor(scale, toState);
    var fc = { transformOrigin: "50% 50%", ...commonT };
    timeline.set(mainSelector, { ...p, ...commonT }, t);
    for (var i = 0; i < fabList.length; i++) {
      if (fabList[i]) {
        timeline.set(fabList[i], { ...fc, scale: fs }, t);
      }
    }
  }

  /**
   * Timeline position after `addTour` completes, without running tweens.
   * Use the same `at`, `opts`, and `mainSelector` as `hfAddMockQuadrantTour` so post-tour
   * keyframes can use `estimateTourEndTime(...) + offset` while the zoom holds for `holdAfterNW`.
   * @param {number} at - same as second arg to addTour after mainSelector
   * @param {object} [opts] - same options object as addTour
   * @param {string} [mainSelector] - zoom target selector; reads data-mock-qz-* overrides from DOM
   */
  function estimateTourEndTime(at, opts, mainSelector) {
    opts = opts || {};
    var fromAttr = mainSelector ? readScaleFromEl(mainSelector) : NaN;
    var el = null;
    if (mainSelector) {
      try {
        el = document.querySelector(mainSelector);
      } catch (e) {
        el = null;
      }
    }
    var scale = typeof opts.scale === "number" && opts.scale > 0 ? opts.scale : fromAttr;
    if (isNaN(scale) || scale <= 0) {
      scale = 2;
    }
    var zoomIn = typeof opts.zoomInDuration === "number" ? opts.zoomInDuration : 0.75;
    var holdNW = typeof opts.holdAfterNW === "number" ? opts.holdAfterNW : 1;
    if (el && el.getAttribute("data-mock-qz-hold") != null) {
      var h = parseFloat(el.getAttribute("data-mock-qz-hold"), 10);
      if (!isNaN(h) && h >= 0) {
        holdNW = h;
      }
    }
    var panD = typeof opts.panDuration === "number" ? opts.panDuration : 0.7;
    if (el && el.getAttribute("data-mock-qz-pan") != null) {
      var p2 = parseFloat(el.getAttribute("data-mock-qz-pan"), 10);
      if (!isNaN(p2) && p2 > 0) {
        panD = p2;
      }
    }
    var resetD = typeof opts.resetDuration === "number" ? opts.resetDuration : 0.65;
    return at + zoomIn + holdNW + panD * 3 + resetD;
  }

  function addTour(timeline, mainSelector, at, opts) {
    if (!g()) {
      return at;
    }
    opts = opts || {};
    var el = null;
    try {
      el = document.querySelector(mainSelector);
    } catch (e) {
      el = null;
    }
    var fromAttr = readScaleFromEl(mainSelector);
    var scale = typeof opts.scale === "number" && opts.scale > 0 ? opts.scale : fromAttr;
    if (isNaN(scale) || scale <= 0) {
      scale = 2;
    }
    var zoomIn = typeof opts.zoomInDuration === "number" ? opts.zoomInDuration : 0.75;
    var holdNW = typeof opts.holdAfterNW === "number" ? opts.holdAfterNW : 1;
    if (el && el.getAttribute("data-mock-qz-hold") != null) {
      var h = parseFloat(el.getAttribute("data-mock-qz-hold"), 10);
      if (!isNaN(h) && h >= 0) {
        holdNW = h;
      }
    }
    var panD = typeof opts.panDuration === "number" ? opts.panDuration : 0.7;
    if (el && el.getAttribute("data-mock-qz-pan") != null) {
      var p2 = parseFloat(el.getAttribute("data-mock-qz-pan"), 10);
      if (!isNaN(p2) && p2 > 0) {
        panD = p2;
      }
    }
    var resetD = typeof opts.resetDuration === "number" ? opts.resetDuration : 0.65;
    var ease = typeof opts.ease === "string" ? opts.ease : "sine.inOut";
    var easeOut = typeof opts.easeOut === "string" ? opts.easeOut : "sine.inOut";
    var fabList = normalizeFabList(opts.fabTrackSelectors);
    var base = { scale: scale, ease: ease, easeOut: easeOut, fabTrackSelectors: fabList.length ? fabList : null };

    var t = at;
    t = addSegment(timeline, mainSelector, t, "full", "nw", {
      ...base,
      duration: zoomIn,
      zoomInDuration: zoomIn,
    });
    t += holdNW;
    t = addSegment(timeline, mainSelector, t, "nw", "ne", { ...base, duration: panD, scale: scale });
    t = addSegment(timeline, mainSelector, t, "ne", "se", { ...base, duration: panD, scale: scale });
    t = addSegment(timeline, mainSelector, t, "se", "sw", { ...base, duration: panD, scale: scale });
    t = addSegment(timeline, mainSelector, t, "sw", "full", { ...base, duration: resetD, scale: scale, ease: easeOut, easeOut: easeOut, resetDuration: resetD });
    return t;
  }

  var hfMockQuadrant = {
    STATES: STATES,
    getState: getState,
    fabScaleFor: fabScaleFor,
    addSegment: addSegment,
    setState: setState,
    addTour: addTour,
    estimateTourEndTime: estimateTourEndTime,
  };
  window.hfMockQuadrant = hfMockQuadrant;
  window.hfAddMockQuadrantTour = addTour;
  window.hfEstimateMockQuadrantTourEnd = estimateTourEndTime;
})();
