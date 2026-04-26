/**
 * Mock “screen” quadrant tour for vowel-tickets: true 2× scale + corner origins so
 * the clipped .viewport shows one quarter of the UI, in order NW → (hold) → NE → SE → SW → reset.
 * Load after gsap. Optional data-mock-qz-hold, data-mock-qz-scale, data-mock-qz-pan on .viewport
 * (numeric strings) override corresponding opts when set.
 */
(function () {
  "use strict";

  /**
   * @param {import("gsap").core.Timeline} timeline
   * @param {string} viewportSelector - full selector, e.g. '[data-composition-id="comp-github"] .viewport'
   * @param {number} at - start time (seconds) on the parent timeline
   * @param {object} [opts]
   * @param {number} [opts.scale=2] - 2 => one quarter of the mock is visible
   * @param {number} [opts.zoomInDuration=0.75]
   * @param {number} [opts.holdAfterNW=1] - seconds to hold on NW after zoom-in completes
   * @param {number} [opts.panDuration=0.7] - each leg NE, SE, SW
   * @param {number} [opts.resetDuration=0.65]
   * @param {string} [opts.ease="power2.inOut"]
   * @param {string} [opts.easeOut="power3.out"] - reset out
   * @returns {number} time (seconds) when the tour finishes (end of reset tween)
   */
  function hfAddMockQuadrantTour(timeline, viewportSelector, at, opts) {
    if (!window.gsap) {
      return at;
    }
    opts = opts || {};
    var el = null;
    try {
      el = document.querySelector(viewportSelector);
    } catch (e) {
      el = null;
    }
    var scale = parseFloat(el && el.getAttribute("data-mock-qz-scale") || "", 10);
    if (isNaN(scale) || scale <= 0) {
      scale = typeof opts.scale === "number" ? opts.scale : 2;
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
      var p = parseFloat(el.getAttribute("data-mock-qz-pan"), 10);
      if (!isNaN(p) && p > 0) {
        panD = p;
      }
    }
    var resetD = typeof opts.resetDuration === "number" ? opts.resetDuration : 0.65;
    var ease = typeof opts.ease === "string" ? opts.ease : "power2.inOut";
    var easeOut = typeof opts.easeOut === "string" ? opts.easeOut : "power3.out";
    var sel = viewportSelector;

    timeline.set(sel, { xPercent: 0, yPercent: 0, transformOrigin: "0% 0%" }, at);
    timeline.fromTo(
      sel,
      { scale: 1, xPercent: 0, yPercent: 0, transformOrigin: "0% 0%" },
      { scale: scale, xPercent: 0, yPercent: 0, transformOrigin: "0% 0%", duration: zoomIn, ease: ease },
      at
    );
    var tNE = at + zoomIn + holdNW;
    timeline.to(sel, { scale: scale, transformOrigin: "100% 0%", duration: panD, ease: ease }, tNE);
    var tSE = tNE + panD;
    timeline.to(sel, { scale: scale, transformOrigin: "100% 100%", duration: panD, ease: ease }, tSE);
    var tSW = tSE + panD;
    timeline.to(sel, { scale: scale, transformOrigin: "0% 100%", duration: panD, ease: ease }, tSW);
    var tReset = tSW + panD;
    timeline.to(
      sel,
      { scale: 1, xPercent: 0, yPercent: 0, transformOrigin: "50% 50%", duration: resetD, ease: easeOut },
      tReset
    );
    return tReset + resetD;
  }

  window.hfAddMockQuadrantTour = hfAddMockQuadrantTour;
})();
