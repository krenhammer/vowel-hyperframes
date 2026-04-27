/* global gsap */
(function () {
  window.__timelines = window.__timelines || {};

  var WORDS = window.ONBOARDING_WORDS;
  var MASTER = 91;
  var AI_FIRST = 78;
  /** Inbox out → Vowel Docs in on “What if your users…” (transcript: `VOWEL_VOWELDOCS_IN` in index). */
  var VOWELDOCS_IN =
    typeof window.VOWEL_VOWELDOCS_IN === "number" ? window.VOWEL_VOWELDOCS_IN : 12.99;
  /** Karaoke: promo block → in-app dialogue (`#bb-ai`, word-level transcript). */
  var KARAOKE_HANDOFF = 28.35;
  var INBOX_HOST_START =
    typeof window.VOWEL_INBOX_HOST_START === "number" ? window.VOWEL_INBOX_HOST_START : 2.23;
  /** After “give Vowel a try” + NE/cost/unwind (~7.4s); karaoke through “that support inbox.” ~80.8s. */
  var OUTRO_IN = 81.25;
  /** Return to inbox + static NE + cost (comp-inbox reprise at ~74.55s). Email strip-out runs at `T_INBOX_EMAIL_UNLOAD` (“head start on”). */
  var INBOX_REPRISE = 74.55;
  /** No karaoke during word-stack intro — keep in sync with `#scene-intro-host` + comp-wordstack-intro TOTAL. */
  var WORDSTACK_INTRO_END = 3.38;

  function stripPunct(s) {
    return String(s).replace(/[.,?!:;'"'"]/g, "").trim();
  }

  function isEm(w, prevText) {
    var t = stripPunct(w.text);
    if (/^RAG$/i.test(t)) {
      return true;
    }
    if (/^Terso$/i.test(t) || /^Turso$/i.test(t)) {
      return true;
    }
    if (/super-intelligence/i.test(w.text)) {
      return true;
    }
    if (/^Vowelbot$/i.test(t)) {
      return true;
    }
    if (/^GitHub$/i.test(t)) {
      return true;
    }
    return false;
  }

  function isEmVowel(w, prevText) {
    var t = stripPunct(w.text);
    if (/^vowel$/i.test(t)) {
      return true;
    }
    if (/docs\.vowel\.to/i.test(w.text)) {
      return true;
    }
    if (prevText != null && /^docs\.?$/i.test(t) && /^vowel$/i.test(stripPunct(prevText))) {
      return true;
    }
    return false;
  }

  /** True when `text` ends a sentence for karaoke reset (matches transcript punctuation). */
  function endsSentence(text) {
    return /[.?!…]["']?$/.test(String(text).trim());
  }

  /** First word index of the sentence that ends at `endWordIdx` (inclusive). */
  function sentenceStartBefore(endWordIdx) {
    var w = endWordIdx;
    while (w > 0 && !endsSentence(WORDS[w - 1].text)) {
      w -= 1;
    }
    return w;
  }

  function wordNorm(t) {
    return stripPunct(String(t)).toLowerCase();
  }

  /**
   * Display text for karaoke (timing stays on transcript words; copy-only fixes).
   * Merged pairs: first index shows the full token; second gets class `kw-merge-tail` (see style.css).
   */
  function karaokeDisplayForIndex(i) {
    if (i === 65 && wordNorm(WORDS[i].text) === "rag") {
      return "RAG";
    }
    if (i === 169 && /^pool\.?$/i.test(String(WORDS[i].text).trim())) {
      return "pull";
    }
    /* “welcome to Vowel Docs.” → “voweldocs” + hidden tail word */
    if (i === 81 && wordNorm(WORDS[i].text) === "vowel" && WORDS[i + 1] && /^docs\.?$/i.test(String(WORDS[i + 1].text).trim())) {
      return "voweldocs";
    }
    if (i === 82 && WORDS[i - 1] && wordNorm(WORDS[i - 1].text) === "vowel" && /^docs\.?$/i.test(String(WORDS[i].text).trim())) {
      return "";
    }
    /* “GitHub code space” → “Codespace” + hidden tail */
    if (i === 180 && wordNorm(WORDS[i].text) === "code" && WORDS[i + 1] && wordNorm(WORDS[i + 1].text) === "space") {
      return "Codespace";
    }
    if (i === 181 && WORDS[i - 1] && wordNorm(WORDS[i - 1].text) === "code" && wordNorm(WORDS[i].text) === "space") {
      return "";
    }
    return WORDS[i].text;
  }

  /** Transcript time: “Vowel’s … agent skills?” — fire when “skills?” hits (title + nav sync to the phrase). */
  function findAgentSkillsMention() {
    var i;
    for (i = AI_FIRST; i < WORDS.length - 1; i++) {
      if (wordNorm(WORDS[i].text) === "agent") {
        var n2 = wordNorm(WORDS[i + 1].text);
        if (n2 === "skills" || n2 === "skills?") {
          return { t: WORDS[i + 1].start, idx: i + 1 };
        }
      }
    }
    return null;
  }

  /** Transcript time: first “Vowelbot” in the in-app dialogue (AI asks about Vowelbot). */
  function findFirstVowelbotInDialogue() {
    var j;
    for (j = AI_FIRST; j < WORDS.length; j++) {
      if (wordNorm(WORDS[j].text) === "vowelbot") {
        return { t: WORDS[j].start, idx: j };
      }
    }
    return null;
  }

  /**
   * After the Vowelbot Q&A, return the mock to Self-host when the user acknowledges the long AI
   * answer (first “Wow,” in dialogue). Do not use “Vowel” + “client” — that lands mid-answer while
   * the agent is still explaining Vowelbot / add flow, and reads as a false title change.
   */
  function findUserWowAfterVowelbotSection() {
    var w;
    for (w = AI_FIRST; w < WORDS.length; w++) {
      if (/^Wow,?\s*$/i.test(String(WORDS[w].text).trim())) {
        return { t: WORDS[w].start, idx: w };
      }
    }
    return null;
  }

  /** First word of “head start on” (closing VO) — email rack unload in comp-inbox lines up with this phrase. */
  function findHeadStartOnTime() {
    var i;
    for (i = 0; i < WORDS.length - 2; i++) {
      if (
        wordNorm(WORDS[i].text) === "head" &&
        wordNorm(WORDS[i + 1].text) === "start" &&
        wordNorm(WORDS[i + 2].text) === "on"
      ) {
        return WORDS[i].start;
      }
    }
    return 77.85;
  }

  /** First word of the closing CTA “Give Vowel a try …” — promo-sized karaoke, ahead of inbox reprise. */
  function findGiveVowelATryTime() {
    var i;
    for (i = 0; i < WORDS.length - 3; i++) {
      if (
        wordNorm(WORDS[i].text) === "give" &&
        wordNorm(WORDS[i + 1].text) === "vowel" &&
        wordNorm(WORDS[i + 2].text) === "a" &&
        /^try/.test(wordNorm(WORDS[i + 3].text))
      ) {
        return WORDS[i].start;
      }
    }
    return 73.73;
  }

  var VD_MODES = {
    selfhost: {
      h1: "Self-host",
      subA: "# What is Vowel?",
      subB: "TLS & certificates",
    },
    agentskills: {
      h1: "Agent Skills",
      subA: "# Skills & tools",
      subB: "Plug-ins & capabilities",
    },
    vowelbot: {
      h1: "Vowelbot",
      subA: "# Install & connect",
      subB: "Repo & GitHub",
    },
  };

  function vdGetCompRoot() {
    var r = document.querySelector(
      '#scene-voweldocs-host [data-composition-id="comp-voweldocs"]'
    );
    if (r) {
      return r;
    }
    r = document.querySelector('[data-composition-id="comp-voweldocs"]');
    if (r) {
      return r;
    }
    var h = document.getElementById("scene-voweldocs-host");
    if (!h) {
      return null;
    }
    if (h.shadowRoot) {
      r = h.shadowRoot.querySelector('[data-composition-id="comp-voweldocs"]');
      if (r) {
        return r;
      }
    }
    return h.querySelector('[data-composition-id="comp-voweldocs"]');
  }

  function vdModeTargets() {
    var root = vdGetCompRoot();
    if (!root) {
      return null;
    }
    return {
      root: root,
      h1: root.querySelector("#vd-h1"),
      subA: root.querySelector("#vd-sub-a"),
      subB: root.querySelector("#vd-sub-b"),
      acInner: root.querySelector("#vd-abstract-captions .vd-ac-inner"),
    };
  }

  function vdNavForMode(root, mode) {
    var ids = ["vd-sb-self", "vd-sb-skills", "vd-sb-vowelbot"];
    var activeId =
      mode === "agentskills" ? "vd-sb-skills" : mode === "vowelbot" ? "vd-sb-vowelbot" : "vd-sb-self";
    var k;
    for (k = 0; k < ids.length; k++) {
      var row = root.querySelector("#" + ids[k]);
      if (!row) {
        continue;
      }
      if (ids[k] === activeId) {
        row.classList.add("on");
        row.classList.remove("dim");
      } else {
        row.classList.remove("on");
        row.classList.add("dim");
      }
    }
  }

  /**
   * Voice session button is `#vd-fab` in comp-voweldocs (bottom-right in the mock; blue `#vd-rag-fab` is RAG, not this).
   * Keys + hex are the former in-comp `VOICE_FAB_COLORS`; the master sets `backgroundColor` from dialogue — no comp timeline.
   */
  var VOICE_FAB = {
    inactive: "#6b7280",
    active: "#22c55e",
    userSpeaking: "#3b82f6",
    thinking: "#eab308",
    aiSpeaking: "#a855f7",
    idle: "#27272a",
  };

  function setVdVoiceFabState(key) {
    var c = VOICE_FAB[key];
    if (!c) {
      return;
    }
    var root = vdGetCompRoot();
    var fab = root ? root.querySelector("#vd-fab") : null;
    if (!fab) {
      return;
    }
    gsap.set(fab, { backgroundColor: c, overwrite: "auto" });
  }

  /**
   * Who is “speaking” for each transcript word in the in-app block (index ≥ AI_FIRST=78), from SCRIPT_DRAFT line order.
   * 199+ = closing narration over the CTA, not the in-mock host — FAB idles.
   */
  function inAppDialogueRole(idx) {
    if (idx < AI_FIRST) {
      return "promo";
    }
    if (idx > 218) {
      return "promo";
    }
    if (idx >= 199) {
      return "narrator";
    }
    if (idx <= 86) {
      return "ai";
    }
    if (idx <= 107) {
      return "user";
    }
    if (idx <= 126) {
      return "ai";
    }
    if (idx <= 133) {
      return "user";
    }
    if (idx <= 188) {
      return "ai";
    }
    if (idx <= 198) {
      return "user";
    }
    return "narrator";
  }

  function inAppDialogueRoleToFabKey(role) {
    if (role === "ai") {
      return "aiSpeaking";
    }
    if (role === "user") {
      return "userSpeaking";
    }
    if (role === "narrator") {
      return "idle";
    }
    return "idle";
  }

  /** True at the first word of a new AI or user turn (not on every word while the same party speaks). */
  function vdAbstractIsNewTurn(idx) {
    if (idx < AI_FIRST || idx > 198) {
      return false;
    }
    var r = inAppDialogueRole(idx);
    if (r !== "ai" && r !== "user") {
      return false;
    }
    if (idx === AI_FIRST) {
      return true;
    }
    return inAppDialogueRole(idx - 1) !== r;
  }

  /** Deterministic abstract bar widths (%) — no Math.random (render contract). */
  var VD_ABS_WIDTHS = [100, 92, 88, 80, 72, 68, 62, 55];

  function vdAbstractCaptionIdle() {
    var root = vdGetCompRoot();
    if (!root) {
      return;
    }
    var inner = root.querySelector("#vd-abstract-captions .vd-ac-inner");
    var lines = root.querySelectorAll("#vd-abstract-captions .vd-ac-line");
    if (!inner || !lines.length) {
      return;
    }
    var base = [44, 58];
    var li;
    for (li = 0; li < lines.length; li++) {
      lines[li].style.display = li < 2 ? "block" : "none";
      if (li < 2) {
        lines[li].style.width = (base[li] || 50) + "%";
      }
    }
  }

  /**
   * New toast content for this turn only (called on speaker change, not each word).
   * 1–3 lines, neutral — simulates a new “toast” when a party starts speaking.
   */
  function vdAbstractCaptionUpdate(wordIdx) {
    var root = vdGetCompRoot();
    if (!root) {
      return;
    }
    var inner = root.querySelector("#vd-abstract-captions .vd-ac-inner");
    var lines = root.querySelectorAll("#vd-abstract-captions .vd-ac-line");
    if (!inner || !lines.length) {
      return;
    }
    if (wordIdx < AI_FIRST || wordIdx > 198) {
      return;
    }
    var role = inAppDialogueRole(wordIdx);
    if (role !== "ai" && role !== "user") {
      vdAbstractCaptionIdle();
      return;
    }
    var nLines = 1 + ((wordIdx * 19 + (role === "ai" ? 1 : 2) * 7) % 3);
    var li;
    for (li = 0; li < lines.length; li++) {
      var show = li < nLines;
      lines[li].style.display = show ? "block" : "none";
      if (show) {
        lines[li].style.width =
          VD_ABS_WIDTHS[(wordIdx * 13 + li * 5 + (role === "ai" ? 0 : 1)) % VD_ABS_WIDTHS.length] + "%";
      }
    }
  }

  function wireVdAbstractCaptionsToMaster(timeline) {
    timeline.add(
      function () {
        vdAbstractCaptionIdle();
      },
      VOWELDOCS_IN
    );
    var ac;
    for (ac = AI_FIRST; ac <= 198; ac++) {
      if (!WORDS[ac]) {
        break;
      }
      if (!vdAbstractIsNewTurn(ac)) {
        continue;
      }
      (function (ix) {
        timeline.add(
          function () {
            vdAbstractCaptionUpdate(ix);
          },
          WORDS[ix].start
        );
      })(ac);
    }
    timeline.add(
      function () {
        vdAbstractCaptionIdle();
      },
      INBOX_REPRISE
    );
  }

  function wireVoweldocsVoiceFabToMaster(timeline) {
    timeline.add(
      function () {
        setVdVoiceFabState("inactive");
      },
      VOWELDOCS_IN
    );
    timeline.add(
      function () {
        setVdVoiceFabState("active");
      },
      KARAOKE_HANDOFF
    );
    var w;
    for (w = 78; w <= 218; w += 1) {
      if (!WORDS[w]) {
        break;
      }
      (function (i) {
        if (inAppDialogueRole(i) === "promo") {
          return;
        }
        timeline.add(
          function () {
            setVdVoiceFabState(inAppDialogueRoleToFabKey(inAppDialogueRole(i)));
          },
          WORDS[i].start
        );
      })(w);
    }
    var g;
    for (g = 78; g < 198; g += 1) {
      if (!WORDS[g] || !WORDS[g + 1]) {
        break;
      }
      var r1 = inAppDialogueRole(g);
      var r2 = inAppDialogueRole(g + 1);
      if (r1 === r2) {
        continue;
      }
      if ((r1 !== "ai" && r1 !== "user") || (r2 !== "ai" && r2 !== "user")) {
        continue;
      }
      var gap = WORDS[g + 1].start - WORDS[g].end;
      if (gap < 0.05) {
        continue;
      }
      (function (tThink) {
        timeline.add(function () {
          setVdVoiceFabState("thinking");
        }, tThink);
      })(WORDS[g].end + Math.min(0.05, gap * 0.3));
    }
    timeline.add(
      function () {
        setVdVoiceFabState("inactive");
      },
      INBOX_REPRISE
    );
  }

  /** Last applied Vowel Docs nav mode; avoids re-animating on ensure retries. */
  var vdLastAppliedMode = null;

  /**
   * Draw attention when the doc page mode changes: staggered blur+slide+fade on h1 and subs;
   * slight scale pop on the main title.
   */
  function vowelDocsAnimateModeChange(t) {
    var els = [t.h1, t.subA, t.subB].filter(Boolean);
    if (!els.length) {
      return;
    }
    gsap.killTweensOf(els);
    var tlA = gsap.timeline({ defaults: { ease: "power2.out" } });
    if (t.h1) {
      gsap.set(t.h1, { transformOrigin: "0% 50%" });
      tlA.fromTo(
        t.h1,
        { y: 14, autoAlpha: 0.3, filter: "blur(5px)", scale: 0.94 },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.48,
          ease: "back.out(1.25)",
        },
        0
      );
    }
    var subEls = [t.subA, t.subB].filter(Boolean);
    if (subEls.length) {
      tlA.fromTo(
        subEls,
        { y: 10, autoAlpha: 0.25, filter: "blur(4px)" },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.38, stagger: 0.08 },
        0.06
      );
    }
    tlA.eventCallback("onComplete", function () {
      gsap.set(els, { clearProps: "filter" });
    });
  }

  /** Apply copy + sidebar; optional entrance motion when `mode` differs from last application. */
  function vowelDocsApplyModeImmediate(mode) {
    var spec = VD_MODES[mode];
    var t = vdModeTargets();
    if (!t || !spec || !t.h1) {
      return false;
    }
    var isChange = vdLastAppliedMode != null && vdLastAppliedMode !== mode;
    vdLastAppliedMode = mode;
    t.h1.textContent = spec.h1;
    var subAText = spec.subA.replace(/^#\s*/, "");
    if (t.subA) {
      t.subA.innerHTML = '<span class="hashsym">#</span> ' + subAText;
    }
    if (t.subB) {
      t.subB.textContent = spec.subB;
    }
    vdNavForMode(t.root, mode);
    if (isChange) {
      vowelDocsAnimateModeChange(t);
    } else {
      gsap.set([t.h1, t.subA, t.subB].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
    }
    return true;
  }

  /**
   * Immediate apply + aggressive retry (sub-comp often mounts after timeline callbacks).
   * No fade — fades were leaving titles invisible when GSAP + clip timing fought.
   */
  function vowelDocsEnsureMode(mode) {
    function tryOnce() {
      return vowelDocsApplyModeImmediate(mode);
    }
    if (tryOnce()) {
      return;
    }
    var host = document.getElementById("scene-voweldocs-host");
    var n = 0;
    var id = setInterval(function () {
      if (tryOnce() || n++ > 200) {
        clearInterval(id);
      }
    }, 25);
    if (host && typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function () {
        tryOnce();
      });
      obs.observe(host, { childList: true, subtree: true });
      setTimeout(function () {
        obs.disconnect();
      }, 12000);
    }
  }

  if (!WORDS || !WORDS.length) {
    window.__timelines["vowel-onboarding-master"] = gsap.timeline({ paused: true }).set({}, {}, 0.1);
    return;
  }

  var stage = document.getElementById("karaoke-stage");
  if (!stage) {
    window.__timelines["vowel-onboarding-master"] = gsap.timeline({ paused: true }).set({}, {}, 0.1);
    return;
  }

  var bbPromo = document.createElement("div");
  bbPromo.id = "bb-promo";
  bbPromo.className = "beat-block valign-mid align-left";
  var innerP = document.createElement("div");
  innerP.className = "beat-inner";
  bbPromo.appendChild(innerP);

  var bbAi = document.createElement("div");
  bbAi.id = "bb-ai";
  bbAi.className = "beat-block beat-ai beat-tight align-left";
  var innerA = document.createElement("div");
  innerA.className = "beat-inner";
  bbAi.appendChild(innerA);

  stage.appendChild(bbPromo);
  stage.appendChild(bbAi);

  var prevText = null;
  var i;
  for (i = 0; i < WORDS.length; i++) {
    var sp = document.createElement("span");
    sp.className = "kw";
    sp.id = "kw-" + i;
    var disp = karaokeDisplayForIndex(i);
    if (disp === "") {
      sp.classList.add("kw-merge-tail");
    }
    if (isEmVowel(WORDS[i], prevText)) {
      sp.classList.add("em-vowel");
    } else if (isEm(WORDS[i], prevText)) {
      sp.classList.add("em");
    }
    sp.textContent = disp === "" ? "" : disp + "\u00a0";
    prevText = WORDS[i].text;
    if (i < AI_FIRST) {
      innerP.appendChild(sp);
    } else {
      innerA.appendChild(sp);
    }
  }

  var agentSk = findAgentSkillsMention();
  var vowelbotAsk = findFirstVowelbotInDialogue();
  var wowAfterBot = findUserWowAfterVowelbotSection();
  var T_VD_AGENT_SKILLS = agentSk ? agentSk.t : 42.12;
  var T_VD_VOWELBOT = vowelbotAsk ? vowelbotAsk.t : 44.78;
  /** Back to Self-host when the user breaks in after the full GitHub / client answer (not mid “add the Vowel client…”). */
  var T_VD_RETURN = wowAfterBot ? wowAfterBot.t : 68.74;
  var T_INBOX_EMAIL_UNLOAD = findHeadStartOnTime();
  var T_GIVE_VOWEL_TRY = findGiveVowelATryTime();

  var tl = gsap.timeline({ paused: true });

  gsap.set("#bb-promo", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#karaoke-wrap", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#bb-ai", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#scene-voweldocs-host", { autoAlpha: 0 });
  /* Inbox hidden until after “how’s it going?”; host `data-start` = `VOWEL_INBOX_HOST_START`. */
  gsap.set("#scene-inbox-host", { autoAlpha: 0 });

  tl.to(
    "#karaoke-wrap",
    { autoAlpha: 1, visibility: "visible", duration: 0.2, ease: "none" },
    WORDSTACK_INTRO_END
  );
  tl.fromTo(
    "#bb-promo",
    { autoAlpha: 0, visibility: "visible" },
    { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
    WORDSTACK_INTRO_END
  );
  tl.to(
    "#scene-inbox-host",
    { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
    INBOX_HOST_START
  );

  var idx;
  for (idx = 0; idx < WORDS.length; idx++) {
    var w = WORDS[idx];
    var t0 = w.start;
    var sel = "#kw-" + idx;
    if (idx > 0 && endsSentence(WORDS[idx - 1].text)) {
      var from = sentenceStartBefore(idx - 1);
      var tClear = Math.max(0, t0 - 0.03);
      (function (fromIdx, toIdx, activeIdx) {
        tl.add(function () {
          var k;
          for (k = fromIdx; k <= toIdx; k++) {
            var sameBeat = (k < AI_FIRST) === (activeIdx < AI_FIRST);
            if (sameBeat) {
              /*
                autoAlpha+visibility still reserves layout for .kw { display: inline-block } — cleared
                lines stack as invisible “ghost” width, so the next sentence drifts down. True clear = display.
              */
              gsap.set("#kw-" + k, {
                display: "none",
                opacity: 0,
                visibility: "hidden",
                scale: 1,
                y: 0,
                overwrite: "auto",
              });
            }
          }
        }, tClear);
      })(from, idx - 1, idx);
    }
    /* Do not dim the word we just sentence-cleared (would fight autoAlpha: 0). */
    if (idx > 0 && !endsSentence(WORDS[idx - 1].text)) {
      if (karaokeDisplayForIndex(idx) === "") {
        /* Second half of a merged on-screen word — do not dim the previous span (81 / 180). */
      } else {
        var dimAt = idx - 1;
        if (karaokeDisplayForIndex(dimAt) === "") {
          dimAt = idx - 2;
        }
        if (dimAt >= 0) {
          tl.to(
            "#kw-" + dimAt,
            { opacity: 0.38, scale: 0.99, duration: 0.12, ease: "sine.out" },
            t0
          );
        }
      }
    }
    if (karaokeDisplayForIndex(idx) === "") {
      tl.set(sel, { opacity: 0, y: 0, scale: 1, display: "inline-block" }, t0);
    } else {
      tl.fromTo(
        sel,
        { opacity: 0, y: 10, scale: 0.98, display: "inline-block" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          display: "inline-block",
          duration: 0.14,
          ease: "power2.out",
          overwrite: "auto",
        },
        t0
      );
    }
  }

  tl.to("#scene-inbox-host", { autoAlpha: 0, duration: 0.4, ease: "power3.in" }, VOWELDOCS_IN);
  tl.fromTo(
    "#scene-voweldocs-host",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
    VOWELDOCS_IN
  );

  tl.to("#bb-promo", { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, KARAOKE_HANDOFF);
  tl.fromTo(
    "#bb-ai",
    { autoAlpha: 0, visibility: "visible" },
    { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
    KARAOKE_HANDOFF + 0.02
  );

  tl.add(
    function () {
      var wrap = document.getElementById("karaoke-wrap");
      if (wrap) {
        wrap.classList.add("karaoke-wrap--ai");
        wrap.classList.add("karaoke-wrap--dialogue");
      }
    },
    KARAOKE_HANDOFF
  );

  /* Vowel Docs: Self-host → Agent Skills → Vowelbot → Self-host after user “Wow,” (end of Vowelbot answer). */
  tl.add(
    function () {
      vowelDocsEnsureMode("selfhost");
    },
    VOWELDOCS_IN
  );
  tl.add(
    function () {
      vowelDocsEnsureMode("agentskills");
    },
    T_VD_AGENT_SKILLS
  );
  tl.add(
    function () {
      vowelDocsEnsureMode("vowelbot");
    },
    T_VD_VOWELBOT
  );
  tl.add(
    function () {
      vowelDocsEnsureMode("selfhost");
    },
    T_VD_RETURN
  );
  /* Backup: sub-comp can attach just after these beats. */
  tl.add(
    function () {
      vowelDocsEnsureMode("agentskills");
    },
    T_VD_AGENT_SKILLS + 0.35
  );

  wireVoweldocsVoiceFabToMaster(tl);
  wireVdAbstractCaptionsToMaster(tl);

  tl.add(
    function () {
      var wrap = document.getElementById("karaoke-wrap");
      if (!wrap) {
        return;
      }
      wrap.classList.remove("karaoke-wrap--dialogue");
      wrap.classList.remove("karaoke-wrap--ai");
      wrap.classList.add("karaoke-wrap--closing-narration");
    },
    T_GIVE_VOWEL_TRY
  );

  /* Closing CTA: cut to inbox in static NE; email rows unload on “head start on”; cost chip stays until inbox hide. */
  tl.to(
    "#scene-voweldocs-host",
    { autoAlpha: 0, duration: 0.45, filter: "blur(2px)", ease: "power2.in" },
    INBOX_REPRISE
  );
  tl.to(
    "#scene-inbox-host",
    { autoAlpha: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" },
    INBOX_REPRISE
  );
  tl.add(
    function () {
      var inh = document.getElementById("scene-inbox-host");
      if (inh) {
        inh.classList.add("scene-inbox-reprise");
      }
      var anim = typeof window.playInboxNeCostUnwindReprise === "function" ? window.playInboxNeCostUnwindReprise() : null;
      if (anim && typeof anim.play === "function") {
        anim.play(0);
      }
    },
    INBOX_REPRISE + 0.04
  );

  tl.add(
    function () {
      var anim =
        typeof window.playInboxEmailUnloadReprise === "function" ? window.playInboxEmailUnloadReprise() : null;
      if (anim && typeof anim.play === "function") {
        anim.play(0);
      }
    },
    T_INBOX_EMAIL_UNLOAD
  );

  tl.fromTo("#outro-layer", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: "power2.out" }, OUTRO_IN);
  var T_END_CHROME = MASTER - 0.5;
  tl.to("#karaoke-wrap", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, T_END_CHROME);
  tl.to("#scene-voweldocs-host", { autoAlpha: 0, filter: "blur(8px)", duration: 0.45, ease: "power2.in" }, T_END_CHROME);
  tl.to("#scene-inbox-host", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, T_END_CHROME);
  tl.add(
    function () {
      var inh = document.getElementById("scene-inbox-host");
      if (inh) {
        inh.classList.remove("scene-inbox-reprise");
      }
    },
    T_END_CHROME + 0.46
  );
  tl.set("#outro-layer", { autoAlpha: 1 }, MASTER);

  tl.set({}, {}, MASTER);

  window.__timelines["vowel-onboarding-master"] = tl;
})();
