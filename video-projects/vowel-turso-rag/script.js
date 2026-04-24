/* global gsap */
(function () {
  window.__timelines = window.__timelines || {};
  var WORDS = window.TURSO_RAG_WORDS;
  var tl = gsap.timeline({ paused: true });

  if (!WORDS || !WORDS.length) {
    console.error(
      "[vowel-turso-rag] TURSO_RAG_WORDS missing — ensure transcript-words.js loads before script.js"
    );
    tl.set({}, {}, 0.1);
    window.__timelines["vowel-turso-rag-master"] = tl;
    return;
  }

  /** Deterministic PRNG — HyperFrames forbids Math.random() on timeline. */
  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var NARRATION_END = WORDS[WORDS.length - 1].end;
  var OUTRO_HOLD = 10;
  var TOTAL = NARRATION_END + OUTRO_HOLD;
  var wrnd = mulberry32(0x7f4a3c2d ^ (WORDS.length * 0x9e3779b9));

  function stripPunct(s) {
    return String(s).replace(/[.,?!:;'"'"]/g, "").trim();
  }

  function isEmWord(w) {
    var t = stripPunct(w.text);
    return /^(RAG|SQLite|WebAssembly|vector|Terso|Turso|vowel|Vowel|docs|WASM|API|LLM)$/i.test(t);
  }

  function firstWordStart(pred) {
    for (var j = 0; j < WORDS.length; j++) {
      if (pred(WORDS[j])) {
        return WORDS[j].start;
      }
    }
    return null;
  }

  /**
   * One on-screen beat = one sentence, or a clause after a comma.
   * Break only when a word ends with `,` `.` `?` or `!` — do not split on pauses or word count.
   */
  function isClauseOrSentenceBoundary(w) {
    var t = w.text;
    return /[.?!,]$/.test(t);
  }

  function buildBeats() {
    var beats = [];
    var chunk = [];
    for (var i = 4; i < WORDS.length; i++) {
      var w = WORDS[i];
      chunk.push({ index: i, w: w });
      if (isClauseOrSentenceBoundary(w)) {
        beats.push(chunk);
        chunk = [];
      }
    }
    if (chunk.length) {
      beats.push(chunk);
    }
    return beats;
  }

  /**
   * Kinetic preset: `from` is the off-state; all words land at x/y 0, scale 1, no rotation (readability on vertical).
   * Only translate + scale (no spin / rotateZ / rotateX).
   */
  var KINETIC_PRESETS = [
    { from: { x: -120, y: 22, scale: 0.4 }, ease: "expo.out", origin: "0% 85%" },
    { from: { x: 120, y: -18, scale: 0.42 }, ease: "expo.out", origin: "100% 85%" },
    { from: { y: 100, scale: 0.48 }, ease: "back.out(1.4)", origin: "50% 100%" },
    { from: { y: -80, scale: 1.45 }, ease: "power4.out", origin: "50% 0%" },
    { from: { scale: 0.12 }, ease: "expo.out", origin: "50% 80%" },
    { from: { x: -80, y: 55, scale: 0.52 }, ease: "circ.out", origin: "0% 90%" },
    { from: { x: 85, y: 52, scale: 0.5 }, ease: "circ.out", origin: "100% 90%" },
    { from: { y: 75, scale: 0.5 }, ease: "power3.out", origin: "50% 100%" },
    { from: { x: -48, y: 38, scale: 0.68, skewX: 10 }, ease: "power2.out", origin: "20% 80%" },
    { from: { x: 50, y: -32, scale: 0.7, skewY: 8 }, ease: "power2.out", origin: "80% 30%" },
    { from: { scale: 1.55 }, ease: "power3.inOut", origin: "50% 50%" },
    { from: { x: -95, y: -42, scale: 0.58 }, ease: "sine.out", origin: "40% 20%" },
    { from: { x: 90, y: -40, scale: 0.56 }, ease: "sine.out", origin: "60% 20%" },
    { from: { y: 85, x: 32, scale: 0.42 }, ease: "back.out(1.2)", origin: "70% 100%" },
    { from: { y: 80, x: -38, scale: 0.44 }, ease: "back.out(1.2)", origin: "30% 100%" },
    { from: { scale: 0.22 }, ease: "expo.out", origin: "50% 80%" },
  ];

  function pickPresetIndex(w, i) {
    var flashyCount = 10;
    if (isEmWord(w)) {
      return Math.floor(wrnd() * flashyCount);
    }
    return flashyCount + Math.floor(wrnd() * (KINETIC_PRESETS.length - flashyCount));
  }

  function runWipe(wipeT, bgHex) {
    tl.set("#cover-wipe-a", { x: -1080 }, wipeT);
    tl.set("#cover-wipe-b", { x: -1080 }, wipeT);
    tl.to("#cover-wipe-a", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT);
    tl.to("#cover-wipe-b", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.05);
    if (bgHex) {
      tl.set("#stage-bg", { backgroundColor: bgHex }, wipeT + 0.14);
    }
    tl.to("#cover-wipe-a", { x: 1080, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.25);
    tl.to("#cover-wipe-b", { x: 1080, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.3);
  }

  function popShot(sel, t, hideAt) {
    var seed =
      sel.split("").reduce(function (a, c) {
        return ((a << 5) - a + c.charCodeAt(0)) | 0;
      }, 9) >>> 0;
    var srnd = mulberry32(seed ^ 0xc0ffee);
    var ax = (srnd() - 0.5) * 80;
    var ay = 30 + srnd() * 60;
    var sc = 0.75 + srnd() * 0.16;

    tl.fromTo(
      sel,
      { opacity: 0, x: ax, y: ay, scale: sc },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.56,
        ease: "back.out(1.32)",
      },
      t
    );
    tl.to(sel, { opacity: 0, y: -40, scale: 0.92, duration: 0.5, ease: "power2.in" }, hideAt);
  }

  gsap.set("#turso-ribbon", { opacity: 0, y: -36 });
  gsap.set("#outro-layer", { opacity: 0 });
  gsap.set(
    "#shot-voweldocs, #shot-ragdebug, #shot-chat, #shot-config, #shot-apikey, #shot-talk",
    { opacity: 0, scale: 0.9 }
  );
  gsap.set("#ow-in, #ow-the, #ow-browser", { opacity: 0 });
  gsap.set("#title-rag", { opacity: 0, scale: 0.48 });
  gsap.set("#karaoke-wrap", { x: 0, transformOrigin: "50% 50%" });

  var beats = buildBeats();
  var stage = document.getElementById("karaoke-stage");
  for (var bi = 0; bi < beats.length; bi++) {
    var block = document.createElement("div");
    block.id = "beat-" + bi;
    block.className = "beat-block";
    if (beats[bi].length > 10) {
      block.className += " beat-tight";
    }
    block.style.zIndex = String(20 + bi);
    var inner = document.createElement("div");
    inner.className = "beat-inner";
    block.appendChild(inner);
    for (var ci = 0; ci < beats[bi].length; ci++) {
      var item = beats[bi][ci];
      var w0 = item.w;
      var sp = document.createElement("span");
      sp.className = "kw" + (isEmWord(w0) ? " em" : "");
      sp.id = "kw-" + item.index;
      sp.textContent = w0.text + " ";
      inner.appendChild(sp);
    }
    stage.appendChild(block);
  }

  tl.set(".beat-block", { autoAlpha: 0, y: 48, scale: 0.93 }, 0);
  tl.set("#karaoke-stage .kw", { autoAlpha: 0 }, 0);

  for (var bj = 0; bj < beats.length; bj++) {
    var b = beats[bj];
    var firstT = b[0].w.start;
    var tClearPrev = Math.max(0, firstT - 0.38);
    var tBringIn = firstT - 0.2;
    if (bj > 0) {
      tl.to(
        "#beat-" + (bj - 1),
        { autoAlpha: 0, y: -32, scale: 0.97, duration: 0.34, ease: "power2.in" },
        tClearPrev
      );
    }
    tl.fromTo(
      "#beat-" + bj,
      { autoAlpha: 0, y: 36, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" },
      tBringIn
    );
  }

  for (var i = 4; i < WORDS.length; i++) {
    var w = WORDS[i];
    var el = document.getElementById("kw-" + i);
    var gap = w.end - w.start;
    var jitter = 0.82 + wrnd() * 0.38;
    var enterDur = Math.max(0.13, Math.min(0.4, (gap + 0.14) * jitter));

    var pIdx = pickPresetIndex(w, i);
    var preset = KINETIC_PRESETS[pIdx];
    var fromState = Object.assign({ autoAlpha: 0, force3D: true, transformOrigin: preset.origin || "50% 80%" }, preset.from);
    var toState = {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
      rotateX: 0,
      skewX: 0,
      skewY: 0,
      duration: enterDur,
      ease: preset.ease,
      immediateRender: false,
      overwrite: "auto",
      transformOrigin: preset.origin || "50% 80%",
    };

    tl.fromTo(el, fromState, toState, w.start);

    if (isEmWord(w)) {
      tl.fromTo(
        el,
        { textShadow: "0 0 0 rgba(76,201,240,0)" },
        {
          textShadow:
            "0 0 22px rgba(76,201,240,0.65), 0 0 46px rgba(62,207,142,0.35), 0 0 2px rgba(255,255,255,0.4)",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        w.start + enterDur * 0.15
      );
    }
  }

  tl.fromTo(
    "#title-rag",
    { scale: 0.42, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.36, ease: "expo.out" },
    WORDS[0].start
  );
  tl.to(
    "#title-rag",
    { scale: 1.06, duration: 0.06, yoyo: true, repeat: 1, ease: "power2.inOut" },
    WORDS[0].start + 0.08
  );

  tl.from("#ow-in", { y: 72, opacity: 0, scale: 2.05, duration: 0.16, ease: "power4.out" }, WORDS[1].start);
  tl.from("#ow-the", { y: 72, opacity: 0, scale: 2.05, duration: 0.16, ease: "power4.out" }, WORDS[2].start);
  tl.from(
    "#ow-browser",
    { y: 72, opacity: 0, scale: 2.05, duration: 0.18, ease: "elastic.out(1, 0.32)" },
    WORDS[3].start
  );

  tl.to("#opener", { opacity: 0, duration: 0.42, ease: "power2.in" }, 1.4);
  tl.to("#title-rag", { scale: 2.35, y: -90, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.44);

  runWipe(1.56, "#0c1814");

  tl.to("#turso-ribbon", { opacity: 1, y: 0, duration: 0.48, ease: "expo.out" }, 2.02);
  tl.fromTo(
    "#turso-ribbon .ribbon-inner",
    { scale: 0.62, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" },
    2.08
  );

  var tursoPulseT = WORDS[7] && WORDS[7].start ? WORDS[7].start : 3.605;
  tl.to(
    "#turso-ribbon .ribbon-inner",
    { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" },
    tursoPulseT
  );

  tl.to("#turso-ribbon", { opacity: 0, y: -70, duration: 0.48, ease: "power2.in" }, 8.48);
  runWipe(8.58, "#0a101c");

  runWipe(22.02, "#3a1434");
  runWipe(40.28, "#1a0f24");
  runWipe(63.95, "#0a101c");
  runWipe(90.92, "#0c1814");
  runWipe(119.15, "#06080f");

  var tDocs = firstWordStart(function (x) {
    return /^vowel$/i.test(x.text);
  });
  var tRagUi = firstWordStart(function (x) {
    return x.text === "Click" && x.start >= 43;
  });
  var tChat = firstWordStart(function (x) {
    return x.text === "test";
  });
  var tCfg = firstWordStart(function (x) {
    return x.text === "open" && x.start >= 69;
  });
  var tKey = firstWordStart(function (x) {
    return x.text === "API" && x.start >= 70;
  });
  var tTalk = firstWordStart(function (x) {
    return x.text === "Welcome";
  });

  if (tDocs != null) {
    popShot("#shot-voweldocs", tDocs, tDocs + 4.1);
  }
  if (tRagUi != null) {
    popShot("#shot-ragdebug", tRagUi, tRagUi + 4.35);
  }
  if (tChat != null) {
    popShot("#shot-chat", tChat, tChat + 4.5);
  }
  if (tCfg != null) {
    popShot("#shot-config", tCfg, tCfg + 4.0);
  }
  if (tKey != null) {
    popShot("#shot-apikey", tKey, tKey + 4.25);
  }
  if (tTalk != null) {
    popShot("#shot-talk", tTalk, tTalk + 5.2);
  }

  tl.fromTo("#outro-layer", { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" }, NARRATION_END);
  tl.fromTo(
    "#outro-layer .out-hero",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.52, ease: "expo.out" },
    NARRATION_END + 0.06
  );
  tl.fromTo(
    "#outro-layer .out-url",
    { scale: 0.88, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.22)" },
    NARRATION_END + 0.2
  );
  tl.fromTo(
    "#outro-layer .out-attr",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.48, ease: "sine.out" },
    NARRATION_END + 0.42
  );

  /* BGM levels (incl. dialogue mute + outro) are in index.html — HyperFrames does not use GSAP volume in the mix. */

  if (beats.length) {
    var lastBi = beats.length - 1;
    tl.to(
      "#beat-" + lastBi,
      { autoAlpha: 0, y: -28, scale: 0.97, duration: 0.42, ease: "power2.in" },
      Math.max(0, NARRATION_END - 0.42)
    );
  }

  tl.set({}, {}, TOTAL);
  window.__timelines["vowel-turso-rag-master"] = tl;
})();
