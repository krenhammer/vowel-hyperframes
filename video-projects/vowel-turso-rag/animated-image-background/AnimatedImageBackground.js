/**
 * Browser runtime for “docs.vowel.to — Click the RAG debug button” CTA background.
 * Mirrors shared/animated-image-background/AnimatedImageBackground.ts (sync manually; no bundler).
 */
/* global window */
(function (global) {
  "use strict";

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5) | 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var DEF = {
    angleDeg: -45,
    cellSize: "min(10.4rem, 100%)",
    cellMaxCap: "184px",
    minCellSize: "80px",
    rotorSize: "280vmin",
    columns: 9,
    rows: 16,
    backgroundColor: "#0a1612",
    ringColor: "rgba(15, 208, 110, 0.42)",
    accentColor: "#0fd06e",
    pressAnimation: "random",
    seed: 0x5a7e1c3f,
    periodRangeSec: { min: 5, max: 9.5 },
    maxNegativeDelaySec: 16,
    staggerStepSec: 0.12,
    staggerPeriodSec: 6.5,
    imageAlt: "",
    className: "",
  };

  function mergeOpts(options) {
    return {
      imageSrc: options.imageSrc,
      angleDeg: options.angleDeg != null ? options.angleDeg : DEF.angleDeg,
      cellSize: options.cellSize != null ? options.cellSize : DEF.cellSize,
      cellMaxCap: options.cellMaxCap != null ? options.cellMaxCap : DEF.cellMaxCap,
      minCellSize: options.minCellSize != null ? options.minCellSize : DEF.minCellSize,
      rotorSize: options.rotorSize != null ? options.rotorSize : DEF.rotorSize,
      columns: options.columns != null ? options.columns : DEF.columns,
      rows: options.rows != null ? options.rows : DEF.rows,
      backgroundColor: options.backgroundColor != null ? options.backgroundColor : DEF.backgroundColor,
      ringColor: options.ringColor != null ? options.ringColor : DEF.ringColor,
      accentColor: options.accentColor != null ? options.accentColor : DEF.accentColor,
      pressAnimation: options.pressAnimation != null ? options.pressAnimation : DEF.pressAnimation,
      seed: options.seed != null ? options.seed : DEF.seed,
      periodRangeSec: options.periodRangeSec || DEF.periodRangeSec,
      maxNegativeDelaySec:
        options.maxNegativeDelaySec != null ? options.maxNegativeDelaySec : DEF.maxNegativeDelaySec,
      staggerStepSec: options.staggerStepSec != null ? options.staggerStepSec : DEF.staggerStepSec,
      staggerPeriodSec: options.staggerPeriodSec != null ? options.staggerPeriodSec : DEF.staggerPeriodSec,
      imageAlt: options.imageAlt != null ? options.imageAlt : DEF.imageAlt,
      className: options.className != null ? options.className : DEF.className,
    };
  }

  function AnimatedImageBackground(host, options) {
    if (!options || !options.imageSrc) {
      throw new Error("AnimatedImageBackground: imageSrc is required");
    }
    this._currentSrc = options.imageSrc;
    this._options = mergeOpts(options);
    this.root = document.createElement("div");
    this.root.className = "aib" + (this._options.className ? " " + this._options.className : "");
    this._applyCustomProperties();
    this._buildGrid();
    var el = typeof host === "string" ? document.querySelector(host) : host;
    if (!el) {
      throw new Error("AnimatedImageBackground: host element not found");
    }
    el.appendChild(this.root);
  }

  var proto = AnimatedImageBackground.prototype;

  Object.defineProperty(proto, "element", {
    get: function () {
      return this.root;
    },
  });

  proto.setImageSrc = function (src) {
    this._currentSrc = src;
    var list = this.root.querySelectorAll(".aib__img");
    for (var i = 0; i < list.length; i++) {
      list[i].src = src;
    }
  };

  proto.destroy = function () {
    if (this.root && this.root.parentNode) {
      this.root.remove();
    }
  };

  proto._applyCustomProperties = function () {
    var o = this._options;
    var r = this.root.style;
    r.setProperty("--aib-angle", o.angleDeg + "deg");
    r.setProperty("--aib-bg", o.backgroundColor);
    r.setProperty("--aib-ring", o.ringColor);
    r.setProperty("--aib-accent", o.accentColor);
    r.setProperty("--aib-cell-max", o.cellSize);
    r.setProperty("--aib-cell-cap", o.cellMaxCap);
    r.setProperty("--aib-cell-min", o.minCellSize);
    r.setProperty("--aib-rotor", o.rotorSize);
    r.setProperty("--aib-grid-cols", String(o.columns));
    r.setProperty("--aib-grid-rows", String(o.rows));
  };

  proto._buildGrid = function () {
    var o = this._options;
    if (o.pressAnimation !== "off") {
      this.root.classList.add("aib--press");
    } else {
      this.root.classList.remove("aib--press");
    }

    var rnd = o.pressAnimation === "random" ? mulberry32(o.seed) : null;
    var pr = o.periodRangeSec;
    var maxNeg = o.maxNegativeDelaySec;
    var index = 0;
    var r;
    var c;

    var rotor = document.createElement("div");
    rotor.className = "aib__rotor";
    var grid = document.createElement("div");
    grid.className = "aib__grid";

    for (r = 0; r < o.rows; r++) {
      for (c = 0; c < o.columns; c++) {
        var cell = document.createElement("div");
        cell.className = "aib__cell";
        var ring = document.createElement("div");
        ring.className = "aib__ring";
        if (o.pressAnimation === "random" && rnd) {
          var delayS = -rnd() * maxNeg;
          var periodS = pr.min + rnd() * (pr.max - pr.min);
          ring.style.setProperty("--aib-btn-delay", delayS + "s");
          ring.style.setProperty("--aib-btn-period", periodS + "s");
        } else if (o.pressAnimation === "stagger") {
          ring.style.setProperty("--aib-btn-delay", index * o.staggerStepSec + "s");
          ring.style.setProperty("--aib-btn-period", o.staggerPeriodSec + "s");
        }
        var img = document.createElement("img");
        img.className = "aib__img";
        img.src = this._currentSrc;
        img.alt = o.imageAlt;
        img.setAttribute("draggable", "false");
        img.decoding = "async";
        if (!o.imageAlt) {
          img.setAttribute("aria-hidden", "true");
        }
        ring.appendChild(img);
        cell.appendChild(ring);
        grid.appendChild(cell);
        index += 1;
      }
    }
    rotor.appendChild(grid);
    this.root.appendChild(rotor);
  };

  global.AnimatedImageBackground = AnimatedImageBackground;
})(typeof window !== "undefined" ? window : global);
