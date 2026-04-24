/**
 * BounceFloatAssets — drop (staggered) → float → optional bounce exit for many images/SVGs.
 * Deterministic layout via mulberry32 (HyperFrames: no Math.random in compositions).
 *
 * @example
 * var bg = new window.BounceFloatAssets("#my-host", {
 *   sources: ["assets/a.svg", "assets/b.png"],
 *   perSourceCount: 2,
 *   sizes: [56, 40],
 *   seed: 0x1a2b3c4d,
 * });
 * bg.addToTimeline(tl, { timeDropStart: 0, timeExitStart: 8, bounceExitDuration: 0.6, exitMode: "linger" });
 */
/* global window, gsap, document */
(function (global) {
  "use strict";

  /**
   * @param {number} seed
   * @returns {function(): number} unit float [0,1)
   */
  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5) | 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var DEF = {
    perSourceCount: 1,
    sizePx: 64,
    /** Bias 0 = spread across more of the box; 1 = hug center (min separation still applies) */
    centerBias: 0.72,
    minSeparationPx: 4,
    maxPlacementAttempts: 120,
    dropStagger: 0.1,
    dropDuration: 0.75,
    dropEase: "bounce.out",
    floatXAmpPx: 6,
    floatYAmpPx: 10,
    /** One half-oscillation (e.g. 0 → +amp) in seconds; full bob ≈ 2× this. */
    floatDuration: 1.6,
    floatEase: "sine.inOut",
    bounceExitDuration: 0.55,
    bounceExitEase: "bounce.in",
    /** "linger" = all exit tweens start at timeExitStart; "staggered" = + i * exitStagger */
    exitMode: "linger",
    exitStagger: 0.1,
    /** When timeExitStart is omitted, float this many up-down bobs (keeps main tl finite) */
    defaultFloatBobs: 6,
    seed: 0x9e37b9d1,
    className: "",
    asObjectForSvg: false,
    /** "random" = source order; "centerOut" = closest to frame center receives lowest drop index (staggered first) */
    placementOrder: "random",
    /** If false, timeExitStart only stops float; no per-item bounce up (parent can fade instead) */
    bounceOnExit: true,
    /**
     * Scene / stage hex or rgb (e.g. "#3a1434", "rgb(58,20,52)") — tints single-color SVG/PNG
     * via mask + `iconFillForBackground` so icon hue contrasts with the field (not pure white).
     * Omit to keep <img> (host CSS may colorize with filters).
     */
    backgroundColor: null,
    /** 0-1, blend toward #fff for dark bgs; lower = darker / less “washed” icons */
    iconTintToWhite: 0.2,
    /** 0-1, blend toward #000 for light bgs */
    iconTintToBlack: 0.42,
    /**
     * Karaoke / caption / overlay text (e.g. "#e8eef8"). When set with a **light** value, the
     * icon fill is darkened so relative luminance stays below the text (decorative icons, not
     * second headline).
     */
    captionTextColor: null,
    /**
     * Minimum (relative luminance) gap between `captionTextColor` and icon fill when caption is
     * light. Larger = more muted / darker icons vs white or near-white type.
     */
    iconCaptionLuminanceMinGap: 0.26,
  };

  /**
   * @typedef {Object} BounceFloatAssetsOptions
   * @property {string[]} sources
   * @property {number} [perSourceCount]
   * @property {number} [sizePx] uniform size when not using `sizes`
   * @property {number[]} [sizes] per *source* (length === sources.length) or per *instance* (length === instance count)
   * @property {number} [centerBias]
   * @property {number} [minSeparationPx] extra space between item centers
   * @property {number} [seed]
   * @property {string} [className]
   * @property {boolean} [asObjectForSvg] use <object> for .svg URLs
   * @property {string | null} [backgroundColor] hex or rgb; enables mask+fill (good for one-color vector assets)
   * @property {number} [iconTintToWhite] 0-1, blend to white on dark bgs
   * @property {number} [iconTintToBlack] 0-1, blend to black on light bgs
   * @property {string | null} [captionTextColor] hex or rgb of on-screen type; darkens icon vs light captions
   * @property {number} [iconCaptionLuminanceMinGap] min luminance below caption (when caption is light)
   */

  /**
   * @param {BounceFloatAssetsOptions} user
   * @returns {BounceFloatAssetsOptions & typeof DEF}
   */
  function mergeOpts(user) {
    var b = user || {};
    return {
      sources: b.sources,
      perSourceCount: b.perSourceCount != null ? b.perSourceCount : DEF.perSourceCount,
      sizePx: b.sizePx != null ? b.sizePx : DEF.sizePx,
      sizes: b.sizes,
      centerBias: b.centerBias != null ? b.centerBias : DEF.centerBias,
      minSeparationPx: b.minSeparationPx != null ? b.minSeparationPx : DEF.minSeparationPx,
      maxPlacementAttempts: b.maxPlacementAttempts != null ? b.maxPlacementAttempts : DEF.maxPlacementAttempts,
      dropStagger: b.dropStagger != null ? b.dropStagger : DEF.dropStagger,
      dropDuration: b.dropDuration != null ? b.dropDuration : DEF.dropDuration,
      dropEase: b.dropEase != null ? b.dropEase : DEF.dropEase,
      floatXAmpPx: b.floatXAmpPx != null ? b.floatXAmpPx : DEF.floatXAmpPx,
      floatYAmpPx: b.floatYAmpPx != null ? b.floatYAmpPx : DEF.floatYAmpPx,
      floatDuration: b.floatDuration != null ? b.floatDuration : DEF.floatDuration,
      floatEase: b.floatEase != null ? b.floatEase : DEF.floatEase,
      bounceExitDuration: b.bounceExitDuration != null ? b.bounceExitDuration : DEF.bounceExitDuration,
      bounceExitEase: b.bounceExitEase != null ? b.bounceExitEase : DEF.bounceExitEase,
      exitMode: b.exitMode != null ? b.exitMode : DEF.exitMode,
      exitStagger: b.exitStagger != null ? b.exitStagger : DEF.exitStagger,
      defaultFloatBobs: b.defaultFloatBobs != null ? b.defaultFloatBobs : DEF.defaultFloatBobs,
      seed: b.seed != null ? b.seed : DEF.seed,
      className: b.className != null ? b.className : DEF.className,
      asObjectForSvg: b.asObjectForSvg != null ? b.asObjectForSvg : DEF.asObjectForSvg,
      placementOrder: b.placementOrder != null ? b.placementOrder : DEF.placementOrder,
      bounceOnExit: b.bounceOnExit != null ? b.bounceOnExit : DEF.bounceOnExit,
      backgroundColor: b.backgroundColor != null ? b.backgroundColor : DEF.backgroundColor,
      iconTintToWhite: b.iconTintToWhite != null ? b.iconTintToWhite : DEF.iconTintToWhite,
      iconTintToBlack: b.iconTintToBlack != null ? b.iconTintToBlack : DEF.iconTintToBlack,
      captionTextColor: b.captionTextColor != null ? b.captionTextColor : DEF.captionTextColor,
      iconCaptionLuminanceMinGap:
        b.iconCaptionLuminanceMinGap != null
          ? b.iconCaptionLuminanceMinGap
          : DEF.iconCaptionLuminanceMinGap,
    };
  }

  /**
   * Build ordered list: for each source, repeat perSourceCount, with size per element.
   * @param {BounceFloatAssetsOptions} o
   * @param {string[]} srcs
   * @returns {Array<{ src: string, size: number, srcIndex: number }>}
   */
  function expandItems(o, srcs) {
    var items = [];
    var i;
    var s;
    var k;
    var n;
    for (s = 0; s < srcs.length; s++) {
      for (k = 0; k < o.perSourceCount; k++) {
        items.push({ src: srcs[s], size: 0, srcIndex: s });
      }
    }
    n = items.length;
    if (o.sizes && o.sizes.length) {
      if (o.sizes.length === n) {
        for (i = 0; i < n; i++) {
          items[i].size = o.sizes[i];
        }
      } else if (o.sizes.length === srcs.length) {
        for (i = 0; i < n; i++) {
          items[i].size = o.sizes[items[i].srcIndex];
        }
      } else {
        for (i = 0; i < n; i++) {
          items[i].size = o.sizePx;
        }
      }
    } else {
      for (i = 0; i < n; i++) {
        items[i].size = o.sizePx;
      }
    }
    for (i = 0; i < n; i++) {
      if (items[i].size <= 0) {
        items[i].size = o.sizePx;
      }
    }
    return items;
  }

  /**
   * Biased position toward center; attempts min distance between points in px (container-relative via % + known sizes).
   * @param {function(): number} rnd
   * @param {number} widthPx
   * @param {number} heightPx
   * @param {Array<{ x: number, y: number, r: number }>} placed
   * @param {number} r
   * @param {number} centerBias
   * @param {number} maxTries
   * @returns {{ x: number, y: number } | null} percents 0-100
   */
  function parseColorToRgb(str) {
    if (!str || typeof str !== "string") {
      return null;
    }
    str = str.trim();
    if (str.charAt(0) === "#") {
      var h = str.slice(1);
      if (h.length === 3) {
        h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      }
      if (h.length === 6 && /^[0-9a-fA-F]{6}$/.test(h)) {
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
      }
    }
    var m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) {
      return { r: +m[1], g: +m[2], b: +m[3] };
    }
    return null;
  }

  function mixRgb(r1, g1, b1, r2, g2, b2, t) {
    return {
      r: r1 + (r2 - r1) * t,
      g: g1 + (g2 - g1) * t,
      b: b1 + (b2 - b1) * t,
    };
  }

  function relativeLuminanceFromRgb(rgb) {
    var a = [rgb.r, rgb.g, rgb.b].map(function (c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function rgbToHex(r, g, b) {
    function hx(n) {
      var x = Math.max(0, Math.min(255, Math.round(n)));
      return ("0" + x.toString(16)).slice(-2);
    }
    return "#" + hx(r) + hx(g) + hx(b);
  }

  /**
   * Solid color for one-color “glyph” art (mask fill) on top of a flat background.
   * @param {string} backgroundCss
   * @param {number} [iconTintToWhite=DEF.iconTintToWhite]
   * @param {number} [iconTintToBlack=DEF.iconTintToBlack]
   * @returns {string} "#rrggbb"
   */
  function iconFillForBackground(backgroundCss, iconTintToWhite, iconTintToBlack) {
    var tw = iconTintToWhite != null ? iconTintToWhite : DEF.iconTintToWhite;
    var tb = iconTintToBlack != null ? iconTintToBlack : DEF.iconTintToBlack;
    var bg = parseColorToRgb(backgroundCss);
    if (!bg) {
      return "#8a5a6c";
    }
    var L = relativeLuminanceFromRgb(bg);
    if (L < 0.5) {
      var o = mixRgb(bg.r, bg.g, bg.b, 255, 255, 255, tw);
      if (relativeLuminanceFromRgb({ r: o.r, g: o.g, b: o.b }) < 0.16) {
        o = mixRgb(o.r, o.g, o.b, 255, 255, 255, 0.1);
      }
      return rgbToHex(o.r, o.g, o.b);
    }
    var o2 = mixRgb(bg.r, bg.g, bg.b, 0, 0, 0, tb);
    return rgbToHex(o2.r, o2.g, o2.b);
  }

  /**
   * After `iconFillForBackground`, when caption text is **light**, mix the icon color toward
   * `backgroundCss` so its relative luminance is at least `minLumGap` below the caption
   * (keeps file icons visually below karaoke / subtitle words).
   * @param {string} baseHex
   * @param {string} backgroundCss
   * @param {string} captionCss
   * @param {number} [minLumGap]
   * @returns {string} "#rrggbb"
   */
  function restrainIconRelativeToCaption(baseHex, backgroundCss, captionCss, minLumGap) {
    var cap = parseColorToRgb(captionCss);
    var bg = parseColorToRgb(backgroundCss);
    var cur = parseColorToRgb(baseHex);
    if (!cap || !bg || !cur) {
      return baseHex;
    }
    var gap = minLumGap != null && minLumGap > 0 ? minLumGap : 0.26;
    var Lc = relativeLuminanceFromRgb(cap);
    if (Lc < 0.48) {
      return baseHex;
    }
    var Lb = relativeLuminanceFromRgb(bg);
    var targetMax = Lc - gap;
    if (targetMax <= Lb + 0.02) {
      return baseHex;
    }
    var Li = relativeLuminanceFromRgb(cur);
    if (Li <= targetMax) {
      return baseHex;
    }
    var n;
    for (n = 0; n < 40; n++) {
      if (relativeLuminanceFromRgb(cur) <= targetMax) {
        break;
      }
      cur = mixRgb(cur.r, cur.g, cur.b, bg.r, bg.g, bg.b, 0.2);
    }
    return rgbToHex(cur.r, cur.g, cur.b);
  }

  function tryPlaceItem(rnd, widthPx, heightPx, placed, r, centerBias, maxTries) {
    var t;
    var u;
    var v;
    var spanH;
    var spanV;
    var xP;
    var yP;
    var xN;
    var yN;
    var d;
    var j;
    var b = centerBias;
    for (t = 0; t < maxTries; t++) {
      u = rnd();
      v = rnd();
      spanH = 0.46 * (1 - b) + 0.06;
      spanV = 0.5 * (1 - b) + 0.07;
      xN = (u - 0.5) * 2 * spanH;
      yN = (v - 0.5) * 2 * spanV;
      xP = 50 + xN * 100;
      yP = 50 + yN * 100;
      d = r * 2.2;
      for (j = 0; j < placed.length; j++) {
        var p = placed[j];
        var ax = (xP / 100) * widthPx;
        var ay = (yP / 100) * heightPx;
        var bx = (p.x / 100) * widthPx;
        var by = (p.y / 100) * heightPx;
        if (Math.hypot(ax - bx, ay - by) < p.r + d) {
          break;
        }
      }
      if (j === placed.length) {
        return { x: xP, y: yP };
      }
    }
    return null;
  }

  /**
   * @param {string | Element} host
   * @param {BounceFloatAssetsOptions} options
   * @constructor
   */
  function BounceFloatAssets(host, options) {
    if (!options || !options.sources || !options.sources.length) {
      throw new Error("BounceFloatAssets: sources (non-empty array) is required");
    }
    this._options = mergeOpts(options);
    this._items = [];
    this._floatTweens = [];
    this._layoutDone = false;
    this._useBgTint = Boolean(this._options.backgroundColor);
    this.root = document.createElement("div");
    this.root.className = "bfa" + (this._options.className ? " " + this._options.className : "");
    if (this._useBgTint) {
      this.root.classList.add("bfa--bg-tinted");
    }
    this._layer = document.createElement("div");
    this._layer.className = "bfa__layer";
    this.root.appendChild(this._layer);
    var el = typeof host === "string" ? document.querySelector(host) : host;
    if (!el) {
      throw new Error("BounceFloatAssets: host element not found");
    }
    el.appendChild(this.root);
    if (this._useBgTint) {
      this._applyBackgroundTint();
    }
  }

  var proto = BounceFloatAssets.prototype;

  Object.defineProperty(proto, "element", {
    get: function () {
      return this.root;
    },
  });

  /**
   * @param {string} colorCss stage / field color
   * @param {string} [captionTextColor] optional; when passed, updates `captionTextColor` (same as `setCaptionTextColor`)
   */
  proto.setBackgroundColor = function (colorCss, captionTextColor) {
    this._options.backgroundColor = colorCss;
    if (arguments.length > 1 && captionTextColor !== undefined) {
      this._options.captionTextColor = captionTextColor;
    }
    this._useBgTint = Boolean(colorCss);
    if (this._useBgTint) {
      this.root.classList.add("bfa--bg-tinted");
    } else {
      this.root.classList.remove("bfa--bg-tinted");
    }
    this._applyBackgroundTint();
  };

  /** @param {string | null} colorCss */
  proto.setCaptionTextColor = function (colorCss) {
    this._options.captionTextColor = colorCss;
    this._applyBackgroundTint();
  };

  proto._applyBackgroundTint = function () {
    var o = this._options;
    if (!o.backgroundColor) {
      return;
    }
    var fill = iconFillForBackground(o.backgroundColor, o.iconTintToWhite, o.iconTintToBlack);
    if (o.captionTextColor) {
      fill = restrainIconRelativeToCaption(
        fill,
        o.backgroundColor,
        o.captionTextColor,
        o.iconCaptionLuminanceMinGap
      );
    }
    this.root.style.setProperty("--bfa-icon-fill", fill);
  };

  proto._ensureLayout = function () {
    if (this._layoutDone) {
      return;
    }
    this._applyBackgroundTint();
    var o = this._options;
    var srcs = o.sources;
    var list = expandItems(o, srcs);
    var placed = [];
    var rnd = mulberry32(o.seed ^ 0x243f6a88);
    var rect = this._layer.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w < 1) {
      w = 1;
    }
    if (h < 1) {
      h = 1;
    }
    var i;
    for (i = 0; i < list.length; i++) {
      var it = list[i];
      var size = it.size;
      var r = size / 2;
      var pos = tryPlaceItem(rnd, w, h, placed, r + o.minSeparationPx, o.centerBias, o.maxPlacementAttempts);
      if (!pos) {
        pos = { x: 50 + (rnd() - 0.5) * 30, y: 50 + (rnd() - 0.5) * 34 };
      }
      placed.push({ x: pos.x, y: pos.y, r: r + o.minSeparationPx / 2 });
      var itemEl = document.createElement("div");
      itemEl.className = "bfa__item";
      itemEl.style.width = size + "px";
      itemEl.style.height = size + "px";
      itemEl.style.left = pos.x + "%";
      itemEl.style.top = pos.y + "%";
      itemEl.style.marginLeft = -size / 2 + "px";
      itemEl.style.marginTop = -size / 2 + "px";
      var mover = document.createElement("div");
      mover.className = "bfa__mover";
      var isSvg = /\.svg($|\?)/i.test(it.src) && o.asObjectForSvg;
      if (this._useBgTint) {
        var maskEl = document.createElement("div");
        maskEl.className = "bfa__mask";
        maskEl.setAttribute("role", "img");
        maskEl.setAttribute("aria-hidden", "true");
        maskEl.style.setProperty("--bfa-item-mask", 'url("' + it.src + '")');
        mover.appendChild(maskEl);
      } else if (isSvg) {
        var ob = document.createElement("object");
        ob.className = "bfa__object";
        ob.setAttribute("data", it.src);
        ob.setAttribute("type", "image/svg+xml");
        ob.setAttribute("aria-hidden", "true");
        mover.appendChild(ob);
      } else {
        var img = document.createElement("img");
        img.className = "bfa__img";
        img.src = it.src;
        img.alt = "";
        img.setAttribute("draggable", "false");
        img.decoding = "async";
        img.setAttribute("aria-hidden", "true");
        mover.appendChild(img);
      }
      itemEl.appendChild(mover);
      this._layer.appendChild(itemEl);
      this._items.push({
        el: itemEl,
        mover: mover,
        size: size,
        xPct: pos.x,
        yPct: pos.y,
      });
    }
    if (o.placementOrder === "centerOut") {
      this._items.sort(function (a, b) {
        var da = (a.xPct - 50) * (a.xPct - 50) + (a.yPct - 50) * (a.yPct - 50);
        var db = (b.xPct - 50) * (b.xPct - 50) + (b.yPct - 50) * (b.yPct - 50);
        return da - db;
      });
    }
    this._layoutDone = true;
  };

  /**
   * Appends intro (drop) + float + exit into an existing timeline.
   * If timeExitStart is null/undefined, no exit is added (float uses repeat; kill manually or extend video).
   *
   * @param {import("gsap").core.Timeline} tl
   * @param {Object} t
   * @param {number} t.timeDropStart
   * @param {number} [t.timeFloatStart] defaults to timeDropStart + last drop offset + dropDuration
   * @param {number} [t.timeExitStart] when exit phase starts (if omitted, no bounce exit; float only)
   * @param {number} [t.bounceExitDuration] override instance default
   * @param {string} [t.exitMode] "linger" | "staggered"
   * @param {number} [t.exitStagger]
   * @param {boolean} [t.bounceOnExit] default true; false = at timeExitStart only stop float (no y bounce)
   */
  proto.addToTimeline = function (tl, t) {
    this._ensureLayout();
    if (!this._items.length) {
      return;
    }
    if (!global.gsap) {
      console.warn("BounceFloatAssets: gsap not found; add GSAP before calling addToTimeline");
      return;
    }
    var o = this._options;
    var ti = t || {};
    var tDrop = ti.timeDropStart != null ? ti.timeDropStart : 0;
    var dropDur = o.dropDuration;
    var stagger = o.dropStagger;
    var last = (this._items.length - 1) * stagger + dropDur;
    var tFloatStart =
      ti.timeFloatStart != null ? ti.timeFloatStart : tDrop + last;
    var tExit = ti.timeExitStart;
    var exitDur = ti.bounceExitDuration != null ? ti.bounceExitDuration : o.bounceExitDuration;
    var exitMode = ti.exitMode != null ? ti.exitMode : o.exitMode;
    var exitSt = ti.exitStagger != null ? ti.exitStagger : o.exitStagger;
    var doBounceExit = ti.bounceOnExit != null ? ti.bounceOnExit : o.bounceOnExit;
    var h = this.root.getBoundingClientRect().height;
    var dropY = -Math.max(120, h * 0.22);
    var exitY = -Math.max(160, h * 0.32);
    var i;
    var j;
    var b;
    var halfD = o.floatDuration;
    var floatSpan;
    var nBobs;

    for (i = 0; i < this._items.length; i++) {
      var row0 = this._items[i].mover;
      global.gsap.set(row0, { y: dropY, x: 0, opacity: 0 });
    }

    for (i = 0; i < this._items.length; i++) {
      var mv0 = this._items[i].mover;
      tl.to(
        mv0,
        { y: 0, x: 0, opacity: 1, duration: dropDur, ease: o.dropEase },
        tDrop + i * stagger
      );
    }

    if (tExit != null && tExit > tFloatStart) {
      floatSpan = tExit - tFloatStart;
      /* One “bob” = out + back = 2 * halfD. floor(span / 2*halfD) is often 0 when the line is
       * short or drop ends late — that skipped float entirely. Always run ≥1 cycle when there is
       * any float window; timeExitStart kill trims overshoot. */
      nBobs = Math.max(1, Math.floor(floatSpan / (2 * halfD)));
    } else {
      nBobs = Math.max(1, o.defaultFloatBobs);
    }

    for (j = 0; j < this._items.length; j++) {
      var m = this._items[j].mover;
      var xSign = j % 2 ? 1 : -1;
      var ySign = (j + 1) % 2 ? 1 : -1;
      var ftl = global.gsap.timeline();
      for (b = 0; b < nBobs; b++) {
        ftl.to(
          m,
          {
            y: o.floatYAmpPx * ySign * (b % 2 === 0 ? 1 : 0.88),
            x: o.floatXAmpPx * xSign * 0.85,
            duration: halfD,
            ease: o.floatEase,
          }
        );
        ftl.to(m, { y: 0, x: 0, duration: halfD, ease: o.floatEase });
      }
      tl.add(ftl, tFloatStart);
      this._floatTweens.push(ftl);
    }

    if (tExit == null) {
      return;
    }

    tl.add(
      function onExitFloatKill() {
        var k;
        for (k = 0; k < this._floatTweens.length; k++) {
          this._floatTweens[k].kill();
        }
        this._floatTweens = [];
      }.bind(this),
      tExit
    );

    for (i = 0; i < this._items.length; i++) {
      var mv2a = this._items[i].mover;
      tl.set(mv2a, { y: 0, x: 0, opacity: 1 }, tExit);
    }
    if (!doBounceExit) {
      return;
    }
    for (i = 0; i < this._items.length; i++) {
      var mv2 = this._items[i].mover;
      var startExit = tExit;
      if (exitMode === "staggered") {
        startExit = tExit + i * exitSt;
      }
      tl.to(
        mv2,
        {
          y: exitY,
          opacity: 0,
          duration: exitDur,
          ease: o.bounceExitEase,
        },
        startExit
      );
    }
  };

  proto.stopFloatTweens = function () {
    var i;
    for (i = 0; i < this._floatTweens.length; i++) {
      this._floatTweens[i].kill();
    }
    this._floatTweens = [];
  };

  proto.destroy = function () {
    this.stopFloatTweens();
    if (this.root && this.root.parentNode) {
      this.root.remove();
    }
    this._items = [];
    this._layoutDone = false;
  };

  BounceFloatAssets.parseColorToRgb = parseColorToRgb;
  BounceFloatAssets.iconFillForBackground = iconFillForBackground;
  BounceFloatAssets.restrainIconRelativeToCaption = restrainIconRelativeToCaption;
  global.BounceFloatAssets = BounceFloatAssets;
})(typeof window !== "undefined" ? window : global);
