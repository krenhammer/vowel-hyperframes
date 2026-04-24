/* global gsap */
(function () {
  window.__timelines = window.__timelines || {};
  var WORDS = window.TURSO_RAG_WORDS;
  var tl = gsap.timeline({ paused: true });

  /** Fills #turso-bg-pattern-rows: diagonal 45° rows, alternating scroll direction (CSS marquee). */
  function buildTursoBgPattern() {
    var host = document.getElementById("turso-bg-pattern-rows");
    var tpl = document.getElementById("turso-bg-cell-tpl");
    if (!host || !tpl || host.childElementCount) return;
    var rowCount = 24;
    var cellsPerChunk = 7;
    for (var r = 0; r < rowCount; r++) {
      var row = document.createElement("div");
      row.className = "turso-bg-pattern__row" + (r % 2 ? " turso-bg-pattern__row--alt" : "");
      var track = document.createElement("div");
      track.className = "turso-bg-pattern__track";
      for (var half = 0; half < 2; half++) {
        var chunk = document.createElement("div");
        chunk.className = "turso-bg-pattern__chunk";
        if (half === 1) {
          chunk.setAttribute("aria-hidden", "true");
        }
        for (var c = 0; c < cellsPerChunk; c++) {
          var imp = document.importNode(tpl.content, true);
          var cell = imp.querySelector(".turso-bg-cell");
          if (cell) chunk.appendChild(cell);
        }
        track.appendChild(chunk);
      }
      row.appendChild(track);
      host.appendChild(row);
    }
  }
  buildTursoBgPattern();

  /** Diagonal rows of Firefox / Chrome / Edge / WebKit marks — same structure as the Turso marquee. */
  var BROWSER_BRANDS = [
    { src: "assets/logo-firefox.svg", label: "Firefox" },
    { src: "assets/logo-chrome.svg", label: "Chrome" },
    { src: "assets/logo-edge.svg", label: "Edge" },
    { src: "assets/logo-webkit.svg", label: "WebKit" },
  ];
  function buildBrowserBgPattern() {
    var host = document.getElementById("browser-bg-pattern-rows");
    var tpl = document.getElementById("browser-bg-cell-tpl");
    if (!host || !tpl || host.childElementCount) return;
    var rowCount = 24;
    var cellsPerChunk = 7;
    var brandI = 0;
    for (var r = 0; r < rowCount; r++) {
      var row = document.createElement("div");
      row.className = "browser-bg-pattern__row" + (r % 2 ? " browser-bg-pattern__row--alt" : "");
      var track = document.createElement("div");
      track.className = "browser-bg-pattern__track";
      for (var half = 0; half < 2; half++) {
        var chunk = document.createElement("div");
        chunk.className = "browser-bg-pattern__chunk";
        if (half === 1) {
          chunk.setAttribute("aria-hidden", "true");
        }
        for (var c = 0; c < cellsPerChunk; c++) {
          var imp = document.importNode(tpl.content, true);
          var cell = imp.querySelector(".browser-bg-cell");
          var img = imp.querySelector(".browser-bg-cell__img");
          var word = imp.querySelector(".browser-bg-cell__word");
          var b = BROWSER_BRANDS[brandI % BROWSER_BRANDS.length];
          brandI += 1;
          if (img) img.src = b.src;
          if (word) word.textContent = b.label;
          if (cell) chunk.appendChild(cell);
        }
        track.appendChild(chunk);
      }
      row.appendChild(track);
      host.appendChild(row);
    }
  }
  buildBrowserBgPattern();

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
  /** Filled in word loop: kinetic entrance end for “documentation … today.” (closing line + outro timing). */
  var tAfterDocumentationToday = null;
  var DOC_TODAY_PAUSE_SEC = 2;
  /** Kinetic entrance end for last in-app word (e.g. credentials.) — handoff before “So that's RAG…”. */
  var tAfterAiLastWordKinetic = null;
  /** Pause (sec) after that entrance finishes, before fading the AI beat / revealing the next line. */
  var AI_POST_KINETIC_PAUSE_SEC = 1;
  var wrnd = mulberry32(0x7f4a3c2d ^ (WORDS.length * 0x9e3779b9));
  var floatActive = 0;
  function floatEnter() {
    floatActive += 1;
    if (floatActive === 1) {
      var r = document.getElementById("root");
      if (r) r.classList.add("root--with-float");
    }
  }
  function floatExit() {
    floatActive = Math.max(0, floatActive - 1);
    if (floatActive === 0) {
      var r = document.getElementById("root");
      if (r) r.classList.remove("root--with-float");
    }
  }

  function stripPunct(s) {
    return String(s).replace(/[.,?!:;'"'"]/g, "").trim();
  }

  function isEmWord(w) {
    var t = stripPunct(w.text);
    return /^(RAG|SQLite|WebAssembly|vector|Turso|Turso|vowel|Vowel|docs|WASM|API|LLM)$/i.test(t);
  }

  function firstWordStart(pred) {
    for (var j = 0; j < WORDS.length; j++) {
      if (pred(WORDS[j])) {
        return WORDS[j].start;
      }
    }
    return null;
  }

  function firstWordIndex(pred) {
    for (var j = 0; j < WORDS.length; j++) {
      if (pred(WORDS[j])) {
        return j;
      }
    }
    return -1;
  }

  function isSentenceEnd(w) {
    return /[.?!]$/.test(w.text);
  }

  var AI_WORD_FIRST = -1;
  var AI_WORD_LAST = -1;
  for (var _wi = 0; _wi < WORDS.length; _wi++) {
    if (WORDS[_wi].text === "Welcome" && AI_WORD_FIRST < 0) {
      AI_WORD_FIRST = _wi;
    }
    if (/^credentials/i.test(WORDS[_wi].text)) {
      AI_WORD_LAST = _wi;
    }
  }

  function buildSentenceBeats() {
    var out = [];
    var chunk = [];
    for (var i = 4; i < WORDS.length; i++) {
      var w = WORDS[i];
      chunk.push({ index: i, w: w });
      if (isSentenceEnd(w)) {
        out.push(chunk);
        chunk = [];
      }
    }
    if (chunk.length) {
      out.push(chunk);
    }
    return out;
  }

  /**
   * One on-screen beat = one full sentence (ends with . ? or !), except the in-app segment [Welcome …
   * credentials] which is a single `ai-full` beat so the full transcript (including "Welcome to Voweldocs")
   * stays on one page with words still animating in.
   */
  function buildBeats() {
    var raw = buildSentenceBeats();
    if (!raw.length) {
      return [];
    }
    if (AI_WORD_FIRST < 0 || AI_WORD_LAST < 0) {
      return raw;
    }
    var aiStartSi = findChunkIndexForWord(raw, AI_WORD_FIRST);
    var aiEndSi = findChunkIndexForWord(raw, AI_WORD_LAST);
    if (aiStartSi < 0 || aiEndSi < 0 || aiStartSi > aiEndSi) {
      return raw;
    }
    var aiPairs = expandAiRangeChunks(raw, aiStartSi, aiEndSi);
    var merged = raw.slice(0, aiStartSi);
    /* One on-screen block for entire in-app section (Welcome … credentials) so nothing replaces previous lines. */
    if (aiPairs.length) {
      merged.push({ kind: "ai-full", pairs: aiPairs });
    }
    for (var r = aiEndSi + 1; r < raw.length; r++) {
      merged.push(raw[r]);
    }
    return merged;
  }

  /** In-app dialogue: transcript sentence chunk spoken by the human (not “How can I help?”). */
  function isUserDialogueChunk(ch) {
    if (!ch || !ch.length) {
      return false;
    }
    var t0 = stripPunct(ch[0].w.text);
    var t1 = ch.length > 1 ? stripPunct(ch[1].w.text) : "";
    if (/^ok$/i.test(t0)) {
      return true;
    }
    if (/^how$/i.test(t0) && /^do$/i.test(t1)) {
      return true;
    }
    return false;
  }

  /**
   * Replace the contiguous AI demo sentence chunks with [intro-only | user+AI pairs].
   * Rendered as a single “ai-full” beat: all rows stay on one frame, words still animate in by time.
   */
  function expandAiRangeChunks(raw, aiStartSi, aiEndSi) {
    var sub = raw.slice(aiStartSi, aiEndSi + 1);
    var pairs = [];
    var i = 0;
    var aiIntro = [];
    while (i < sub.length && !isUserDialogueChunk(sub[i])) {
      aiIntro.push(sub[i]);
      i++;
    }
    if (aiIntro.length) {
      pairs.push({ user: null, ai: aiIntro });
    }
    while (i < sub.length) {
      if (isUserDialogueChunk(sub[i])) {
        var userCh = sub[i];
        i++;
        var aiAns = [];
        while (i < sub.length && !isUserDialogueChunk(sub[i])) {
          aiAns.push(sub[i]);
          i++;
        }
        pairs.push({ user: userCh, ai: aiAns });
      } else {
        if (pairs.length) {
          var last = pairs[pairs.length - 1];
          last.ai = last.ai || [];
          last.ai.push(sub[i]);
        } else {
          pairs.push({ user: null, ai: [sub[i]] });
        }
        i++;
      }
    }
    return pairs;
  }

  function findChunkIndexForWord(raw, wordIndex) {
    for (var si = 0; si < raw.length; si++) {
      var ch = raw[si];
      var lo = ch[0].index;
      var hi = ch[ch.length - 1].index;
      if (wordIndex >= lo && wordIndex <= hi) {
        return si;
      }
    }
    return -1;
  }

  function makeBeatModels(rawBeats) {
    var out = [];
    for (var i = 0; i < rawBeats.length; i++) {
      var e = rawBeats[i];
      if (e && e.kind === "ai-full") {
        out.push({ type: "ai", pairs: e.pairs });
      } else {
        out.push({ type: "norm", chunk: e });
      }
    }
    return out;
  }

  function wordCountInPairs(pairs) {
    var n = 0;
    for (var p = 0; p < pairs.length; p++) {
      n += wordCountInPair(pairs[p]);
    }
    return n;
  }

  function wordCountInPair(pair) {
    var n = 0;
    var a;
    for (a = 0; a < pair.ai.length; a++) {
      n += pair.ai[a].length;
    }
    if (pair.user) {
      n += pair.user.length;
    }
    return n;
  }

  function beatFirstItem(bm) {
    if (bm.type === "norm") {
      return bm.chunk[0];
    }
    var pr = bm.pairs[0];
    if (pr.user) {
      return pr.user[0];
    }
    return pr.ai[0][0];
  }

  function beatLastItem(bm) {
    if (bm.type === "norm") {
      var c = bm.chunk;
      return c[c.length - 1];
    }
    var pr = bm.pairs[bm.pairs.length - 1];
    var lastAiCh = pr.ai[pr.ai.length - 1];
    return lastAiCh[lastAiCh.length - 1];
  }

  function isAiBeatModel(bm) {
    return bm.type === "ai";
  }

  /**
   * Kinetic preset: `from` is the off-state; all words land at x/y 0, scale 1, no rotation (readability on vertical).
   * Only translate + scale (no spin / rotateZ / rotateX).
   */
  var KINETIC_AI = { from: { y: 18, scale: 0.99 }, ease: "power2.out", origin: "50% 100%" };
  var BEAT_BGS = ["#0a101c", "#0c1814", "#1a0f24", "#3a1434", "#0f1a2e", "#132018", "#0d1420"];
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
    var ax = (srnd() - 0.5) * 50;
    var ay = 20 + srnd() * 35;
    var sc = 0.9 + srnd() * 0.1;

    tl.call(floatEnter, [], t);
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
    tl.to(sel, { opacity: 0, y: -24, scale: 0.95, duration: 0.5, ease: "power2.in" }, hideAt);
    tl.call(floatExit, [], hideAt);
  }

  gsap.set("#turso-bg-pattern", { opacity: 0 });
  gsap.set("#browser-bg-pattern", { opacity: 0 });
  gsap.set("#outro-layer", { opacity: 0 });
  gsap.set("#shot-chat, #shot-config, #shot-apikey, #shot-talk", { opacity: 0, scale: 0.9 });
  gsap.set("#ow-in, #ow-the, #ow-browser", { opacity: 0 });
  /* Headline visible from frame 0; subline “in / the / browser.” fades in word-by-word. */
  gsap.set("#title-rag", { opacity: 1, scale: 1 });
  gsap.set("#karaoke-wrap", { x: 0, transformOrigin: "50% 50%" });

  var beatModels = makeBeatModels(buildBeats());

  /** Screenshot visible for the full caption beat so layout (root--with-float) does not shift mid-sentence. */
  var IMAGE_LEAD_SEC = 0.55;
  var IMAGE_LAG_SEC = 0.52;

  function findBeatModelIndexForWordIndex(wordIdx) {
    for (var bi = 0; bi < beatModels.length; bi++) {
      var bm = beatModels[bi];
      if (bm.type === "norm") {
        var ch = bm.chunk;
        if (wordIdx >= ch[0].index && wordIdx <= ch[ch.length - 1].index) {
          return bi;
        }
      } else {
        for (var pi = 0; pi < bm.pairs.length; pi++) {
          var pr = bm.pairs[pi];
          if (pr.user) {
            var u = pr.user;
            if (wordIdx >= u[0].index && wordIdx <= u[u.length - 1].index) {
              return bi;
            }
          }
          for (var ac = 0; ac < pr.ai.length; ac++) {
            var c = pr.ai[ac];
            if (wordIdx >= c[0].index && wordIdx <= c[c.length - 1].index) {
              return bi;
            }
          }
        }
      }
    }
    return -1;
  }

  /**
   * With one merged AI block, use the pair/sentence that contains the word for screenshot timing
   * (not the full Welcome–credentials range).
   */
  function getPopShotTimeWindowForWord(bm, wordIdx) {
    if (bm.type !== "ai" || !bm.pairs) {
      return null;
    }
    for (var pi = 0; pi < bm.pairs.length; pi++) {
      var pr = bm.pairs[pi];
      if (pr.user) {
        var u = pr.user;
        if (wordIdx >= u[0].index && wordIdx <= u[u.length - 1].index) {
          return { start: u[0].w.start, end: u[u.length - 1].w.end };
        }
      }
      for (var ac = 0; ac < pr.ai.length; ac++) {
        var c = pr.ai[ac];
        if (wordIdx >= c[0].index && wordIdx <= c[c.length - 1].index) {
          return { start: c[0].w.start, end: c[c.length - 1].w.end };
        }
      }
    }
    return null;
  }

  function popShotForWordIndex(sel, wordIdx) {
    if (wordIdx < 0) {
      return;
    }
    var bi = findBeatModelIndexForWordIndex(wordIdx);
    if (bi < 0) {
      return;
    }
    var bm = beatModels[bi];
    var win = getPopShotTimeWindowForWord(bm, wordIdx);
    var tFirst = win ? win.start : beatFirstItem(bm).w.start;
    var tLast = win ? win.end : beatLastItem(bm).w.end;
    var tShow = Math.max(0, tFirst - IMAGE_LEAD_SEC);
    var tHide = Math.max(tLast + IMAGE_LAG_SEC, tShow + 1.15);
    popShot(sel, tShow, tHide);
  }

  var stage = document.getElementById("karaoke-stage");

  function appendKwSpans(container, chunk, skipEm) {
    for (var ci = 0; ci < chunk.length; ci++) {
      var item = chunk[ci];
      var w0 = item.w;
      var sp = document.createElement("span");
      sp.className = "kw" + (isEmWord(w0) && !skipEm ? " em" : "");
      sp.id = "kw-" + item.index;
      sp.textContent = w0.text + " ";
      container.appendChild(sp);
    }
  }

  for (var bi = 0; bi < beatModels.length; bi++) {
    var bm = beatModels[bi];
    var block = document.createElement("div");
    block.id = "beat-" + bi;
    block.className = "beat-block";
    if (isAiBeatModel(bm)) {
      /* Top-aligned, compact type so the whole in-app section fits on one frame. */
      block.className += " beat-ai align-left valign-top";
      if (wordCountInPairs(bm.pairs) > 24) {
        block.className += " beat-tight";
      }
    } else {
      if (bm.chunk.length > 9) {
        block.className += " beat-tight";
      }
      /* Left-justified; valign-mid keeps long lines inside the safe area (no bottom edge clip). */
      block.className += " align-left valign-mid";
    }
    block.style.zIndex = String(20 + bi);
    var inner = document.createElement("div");
    inner.className = "beat-inner";
    block.appendChild(inner);

    if (isAiBeatModel(bm)) {
      for (var pi = 0; pi < bm.pairs.length; pi++) {
        var pr = bm.pairs[pi];
        if (pr.user) {
          var userRow = document.createElement("div");
          userRow.className = "ai-dialog-user";
          appendKwSpans(userRow, pr.user, true);
          inner.appendChild(userRow);
          var gapEl = document.createElement("div");
          gapEl.className = "ai-dialog-speaker-gap";
          inner.appendChild(gapEl);
        }
        var aiRow = document.createElement("div");
        aiRow.className = "ai-dialog-ai";
        for (var ac = 0; ac < pr.ai.length; ac++) {
          appendKwSpans(aiRow, pr.ai[ac], true);
        }
        inner.appendChild(aiRow);
        if (pi < bm.pairs.length - 1) {
          var turnGap = document.createElement("div");
          turnGap.className = "ai-dialog-turn-gap";
          inner.appendChild(turnGap);
        }
      }
    } else {
      appendKwSpans(inner, bm.chunk);
    }
    stage.appendChild(block);
  }

  var tFirstAiBeat = null;
  var tLastAiEnd = null;
  for (var _abi = 0; _abi < beatModels.length; _abi++) {
    if (isAiBeatModel(beatModels[_abi])) {
      if (tFirstAiBeat == null) {
        tFirstAiBeat = beatFirstItem(beatModels[_abi]).w.start;
      }
      tLastAiEnd = beatLastItem(beatModels[_abi]).w.end;
    }
  }
  /** After the last in-app word: hold, then opacity-only AI beat exit; also when karaoke-wrap--ai is removed. */
  var AI_OUT_HOLD_SEC = 1;
  var AI_OUT_FADE_SEC = 1;
  if (tFirstAiBeat != null) {
    tl.call(
      function () {
        var w = document.getElementById("karaoke-wrap");
        if (w) w.classList.add("karaoke-wrap--ai");
      },
      [],
      Math.max(0, tFirstAiBeat - 0.22)
    );
  }
  /* karaoke-wrap--ai removal: scheduled after word loop once tAiClearStart is known (see below). */

  /* 2s silent breath after the last in-app line; bgm-post in index.html must start at the same time. */
  var postAiBgmAt = tLastAiEnd != null ? tLastAiEnd + 2 : 119.671;
  var tWipeOutOfAi = Math.max(0.4, postAiBgmAt - 0.52);

  tl.set(".beat-block", { autoAlpha: 0, y: 48, scale: 0.93 }, 0);
  tl.set("#karaoke-stage .kw", { autoAlpha: 0 }, 0);

  for (var i = 4; i < WORDS.length; i++) {
    var w = WORDS[i];
    var el = document.getElementById("kw-" + i);
    if (!el) {
      continue;
    }
    var gap = w.end - w.start;
    var jitter = 0.82 + wrnd() * 0.38;
    var enterDur = Math.max(0.13, Math.min(0.4, (gap + 0.14) * jitter));
    if (
      i > 0 &&
      stripPunct(w.text) === "today" &&
      stripPunct(WORDS[i - 1].text) === "documentation"
    ) {
      tAfterDocumentationToday = w.start + enterDur;
    }
    if (AI_WORD_LAST >= 0 && i === AI_WORD_LAST) {
      tAfterAiLastWordKinetic = w.start + enterDur;
    }

    var inAi =
      AI_WORD_FIRST >= 0 && AI_WORD_LAST >= 0 && i >= AI_WORD_FIRST && i <= AI_WORD_LAST;
    var preset;
    if (inAi) {
      preset = KINETIC_AI;
    } else {
      var pIdx = pickPresetIndex(w, i);
      preset = KINETIC_PRESETS[pIdx];
    }
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

    if (isEmWord(w) && !inAi) {
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

  var tAiClearStart =
    tAfterAiLastWordKinetic != null
      ? tAfterAiLastWordKinetic + AI_POST_KINETIC_PAUSE_SEC
      : tLastAiEnd != null
        ? tLastAiEnd + AI_OUT_HOLD_SEC
        : null;
  if (tLastAiEnd != null && tAiClearStart != null) {
    tl.call(
      function () {
        var w = document.getElementById("karaoke-wrap");
        if (w) {
          w.classList.remove("karaoke-wrap--ai");
        }
      },
      [],
      tAiClearStart + AI_OUT_FADE_SEC
    );
  }

  var nonAiBeats = 0;
  for (var bj = 0; bj < beatModels.length; bj++) {
    var b = beatModels[bj];
    var firstT = beatFirstItem(b).w.start;
    var prevLastEnd = bj > 0 ? beatLastItem(beatModels[bj - 1]).w.end : 0;
    /* Keep the full sentence until its last word has finished, then hand off to the next beat. */
    var tClearPrev = bj > 0 ? Math.max(firstT - 0.35, prevLastEnd + 0.04) : 0;
    var tClearThisPrev = tClearPrev;
    if (bj > 0 && isAiBeatModel(beatModels[bj - 1]) && tLastAiEnd != null) {
      tClearThisPrev = tAiClearStart != null ? tAiClearStart : tLastAiEnd + AI_OUT_HOLD_SEC;
    }
    var tBringIn = bj > 0 ? Math.max(firstT - 0.2, tClearThisPrev + 0.02) : firstT - 0.2;
    var bSel = "#beat-" + bj;
    if (bj > 0) {
      if (isAiBeatModel(beatModels[bj - 1]) && tLastAiEnd != null) {
        tl.to(
          "#beat-" + (bj - 1),
          { autoAlpha: 0, duration: AI_OUT_FADE_SEC, ease: "power2.inOut" },
          tClearThisPrev
        );
      } else {
        tl.to(
          "#beat-" + (bj - 1),
          { autoAlpha: 0, y: -32, scale: 0.97, duration: 0.36, ease: "power2.in" },
          tClearThisPrev
        );
      }
    }
    if (isAiBeatModel(b)) {
      tl.fromTo(
        bSel,
        { autoAlpha: 0, y: 28, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" },
        tBringIn
      );
    } else {
      var everyThird = (nonAiBeats + 1) % 3 === 0;
      var mode = (nonAiBeats * 2 + 1) % 4;
      nonAiBeats += 1;
      if (everyThird) {
        tl.set("#stage-bg", { backgroundColor: BEAT_BGS[nonAiBeats % BEAT_BGS.length] }, Math.max(0, firstT - 0.12));
      }
      if (mode === 0) {
        tl.fromTo(
          bSel,
          { autoAlpha: 0, y: 64, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out" },
          tBringIn
        );
      } else if (mode === 1) {
        tl.fromTo(
          bSel,
          { autoAlpha: 0, x: -100, scale: 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.48, ease: "power3.out" },
          tBringIn
        );
      } else if (mode === 2) {
        tl.fromTo(
          bSel,
          { autoAlpha: 0, x: 100, scale: 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.48, ease: "power3.out" },
          tBringIn
        );
      } else {
        tl.fromTo(
          bSel,
          { autoAlpha: 0, y: 36, scale: 0.88 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.52, ease: "back.out(1.2)" },
          tBringIn
        );
      }
    }
  }

  var OUTRO_T0 =
    tAfterDocumentationToday != null
      ? tAfterDocumentationToday + DOC_TODAY_PAUSE_SEC
      : NARRATION_END;
  var TOTAL = OUTRO_T0 + OUTRO_HOLD;

  tl.fromTo(
    "#ow-in",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
    WORDS[1].start
  );
  tl.fromTo(
    "#ow-the",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
    WORDS[2].start
  );
  tl.fromTo(
    "#ow-browser",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" },
    WORDS[3].start
  );

  /* Opener = “Rag / in / the / browser” — do not start color wipe until headline + sublines have room to read. */
  var OPENER_FADE = WORDS[3].end + 0.5;
  var WIPE_INTRO = OPENER_FADE + 0.2;
  tl.to("#opener", { opacity: 0, duration: 0.4, ease: "power2.in" }, OPENER_FADE);
  tl.to("#title-rag", { scale: 2.35, y: -90, opacity: 0, duration: 0.5, ease: "power3.in" }, OPENER_FADE + 0.04);

  runWipe(WIPE_INTRO, "#0c1814");

  /* “And if we mention, this is all in the browser.” — show browser-engine marquee. */
  var iIfWeMentionAnd = firstWordIndex(function (x) {
    return x.text === "And" && x.start >= 10;
  });
  var iMentionInTheBrowser = firstWordIndex(function (x) {
    return x.text === "browser." && x.start > 10 && x.start < 22;
  });
  var tBrowserPatternIn = iIfWeMentionAnd >= 0 ? Math.max(0, WORDS[iIfWeMentionAnd].start - 0.04) : 15.25;
  var tBrowserPatternOut = iMentionInTheBrowser >= 0 ? WORDS[iMentionInTheBrowser].end + 0.32 : 17.7;

  tl.to(
    "#turso-bg-pattern",
    { opacity: 1, duration: 0.38, ease: "sine.out" },
    WIPE_INTRO + 0.12
  );

  tl.to(
    "#turso-bg-pattern",
    { opacity: 0, duration: 0.42, ease: "power2.in" },
    8.45
  );
  runWipe(8.58, "#0a101c");

  tl.to(
    "#browser-bg-pattern",
    { opacity: 1, duration: 0.36, ease: "sine.out" },
    tBrowserPatternIn
  );
  tl.to(
    "#browser-bg-pattern",
    { opacity: 0, duration: 0.42, ease: "power2.in" },
    tBrowserPatternOut
  );

  runWipe(22.02, "#3a1434");
  runWipe(40.28, "#1a0f24");
  runWipe(63.95, "#0a101c");
  runWipe(90.92, "#0c1814");
  runWipe(tWipeOutOfAi, "#06080f");

  var tChat = firstWordStart(function (x) {
    return x.text === "test";
  });
  var tCfg = firstWordStart(function (x) {
    return x.text === "open" && x.start >= 69;
  });
  var tKey = firstWordStart(function (x) {
    return x.text === "API" && x.start >= 70;
  });
  var tAiBegin =
    AI_WORD_FIRST >= 0 && WORDS[AI_WORD_FIRST] ? WORDS[AI_WORD_FIRST].start : null;
  if (tAiBegin != null) {
    tl.call(
      function () {
        floatActive = 0;
        var r = document.getElementById("root");
        if (r) {
          r.classList.remove("root--with-float");
        }
      },
      [],
      tAiBegin
    );
    tl.set(
      "#shot-chat, #shot-config, #shot-apikey, #shot-talk",
      { autoAlpha: 0, opacity: 0, scale: 0.9, x: 0, y: 0 },
      tAiBegin
    );
  }

  var iChat = firstWordIndex(function (x) {
    return x.text === "test";
  });
  var iCfg = firstWordIndex(function (x) {
    return x.text === "open" && x.start >= 69;
  });
  var iKey = firstWordIndex(function (x) {
    return x.text === "API" && x.start >= 70;
  });
  popShotForWordIndex("#shot-chat", iChat);
  popShotForWordIndex("#shot-config", iCfg);
  popShotForWordIndex("#shot-apikey", iKey);

  tl.fromTo("#outro-layer", { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" }, OUTRO_T0);
  tl.fromTo(
    "#outro-layer .out-hero",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.52, ease: "expo.out" },
    OUTRO_T0 + 0.06
  );
  tl.fromTo(
    "#outro-layer .out-url",
    { scale: 0.88, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.22)" },
    OUTRO_T0 + 0.2
  );
  tl.fromTo(
    "#outro-layer .out-attr",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.48, ease: "sine.out" },
    OUTRO_T0 + 0.42
  );

  /* BGM levels (incl. dialogue mute + outro) are in index.html — HyperFrames does not use GSAP volume in the mix. */

  if (beatModels.length) {
    var lastBi = beatModels.length - 1;
    tl.to(
      "#beat-" + lastBi,
      { autoAlpha: 0, y: -28, scale: 0.97, duration: 0.42, ease: "power2.in" },
      Math.max(0, OUTRO_T0 - 0.42)
    );
  }

  tl.set({}, {}, TOTAL);
  window.__timelines["vowel-turso-rag-master"] = tl;
})();
