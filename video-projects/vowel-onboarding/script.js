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
  /** Return to inbox + play NE zoom / costs / email unload (comp-inbox `playInboxNeCostUnwindReprise`). “try” ends ~74.65s. */
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

  /** Transcript time: first “voice … client” (user integrating the client). */
  function findVoiceClientStart() {
    var i;
    for (i = 0; i < WORDS.length - 1; i++) {
      if (wordNorm(WORDS[i].text) === "voice" && wordNorm(WORDS[i + 1].text) === "client") {
        return { t: WORDS[i].start, idx: i };
      }
    }
    return null;
  }

  /** Transcript time: first “Vowelbot” in the in-app dialogue (AI asks about Vowelbot). */
  function findFirstVowelbotInDialogue() {
    var i;
    for (i = AI_FIRST; i < WORDS.length; i++) {
      if (wordNorm(WORDS[i].text) === "vowelbot") {
        return { t: WORDS[i].start, idx: i };
      }
    }
    return null;
  }

  /** After Vowelbot beat: “… add the Vowel client to” — back to Voice client doc view. */
  function findVowelClientPairAfter(minIdx) {
    var i;
    for (i = Math.max(0, minIdx || 0); i < WORDS.length - 1; i++) {
      if (wordNorm(WORDS[i].text) === "vowel" && wordNorm(WORDS[i + 1].text) === "client") {
        return { t: WORDS[i].start, idx: i };
      }
    }
    return null;
  }

  var VD_MODES = {
    client: {
      h1: "Voice client",
      subA: "# Integrating the client",
      subB: "App shell & routing",
    },
    vowelbot: {
      h1: "Vowelbot",
      subA: "# Agent skills",
      subB: "Actions & tools",
    },
  };

  function vdModeTargets() {
    var host = document.getElementById("scene-voweldocs-host");
    if (!host) {
      return null;
    }
    var root = host.querySelector('[data-composition-id="comp-voweldocs"]');
    if (!root) {
      return null;
    }
    return {
      root: root,
      h1: root.querySelector("#vd-h1"),
      subA: root.querySelector("#vd-sub-a"),
      subB: root.querySelector("#vd-sub-b"),
    };
  }

  function vdNavForMode(root, mode) {
    var start = root.querySelector("#sb-start");
    var rag = root.querySelector("#sb-rag");
    if (!start || !rag) {
      return;
    }
    if (mode === "client") {
      start.classList.add("on");
      start.classList.remove("dim");
      rag.classList.remove("on");
      rag.classList.add("dim");
    } else {
      start.classList.remove("on");
      start.classList.add("dim");
      rag.classList.remove("dim");
      rag.classList.add("on");
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
    var host = document.getElementById("scene-voweldocs-host");
    if (!host) {
      return;
    }
    var fab = host.querySelector("#vd-fab");
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

  /** Fade doc title/sections + swap copy + sidebar (run when timeline hits — comp DOM may load after first paint). */
  function vowelDocsModeRun(mode) {
    var spec = VD_MODES[mode];
    var t = vdModeTargets();
    if (!t || !spec) {
      return;
    }
    var els = [t.h1, t.subA, t.subB].filter(Boolean);
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .to(els, { autoAlpha: 0, y: -10, duration: 0.22, stagger: 0.04, ease: "power2.in" })
      .add(function () {
        t.h1.textContent = spec.h1;
        var subAText = spec.subA.replace(/^#\s*/, "");
        if (t.subA) {
          t.subA.innerHTML = '<span class="hashsym">#</span> ' + subAText;
        }
        if (t.subB) {
          t.subB.textContent = spec.subB;
        }
        vdNavForMode(t.root, mode);
      })
      .fromTo(els, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.07, ease: "power2.out" });
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
    if (isEmVowel(WORDS[i], prevText)) {
      sp.classList.add("em-vowel");
    } else if (isEm(WORDS[i], prevText)) {
      sp.classList.add("em");
    }
    sp.textContent = WORDS[i].text + "\u00a0";
    prevText = WORDS[i].text;
    if (i < AI_FIRST) {
      innerP.appendChild(sp);
    } else {
      innerA.appendChild(sp);
    }
  }

  var voiceClient = findVoiceClientStart();
  var vowelbotAsk = findFirstVowelbotInDialogue();
  var vowelClientAfterBot = vowelbotAsk ? findVowelClientPairAfter(vowelbotAsk.idx + 1) : null;
  var T_VD_CLIENT = voiceClient ? voiceClient.t : 36.62;
  var T_VD_VOWELBOT = vowelbotAsk ? vowelbotAsk.t : 44.78;
  var T_VD_CLIENT_RETURN = vowelClientAfterBot ? vowelClientAfterBot.t : 56.28;

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
  tl.add(
    function () {
      var wrap = document.getElementById("karaoke-wrap");
      if (wrap) {
        wrap.classList.add("karaoke-wrap--abstract-on");
      }
    },
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
      tl.to(
        "#kw-" + (idx - 1),
        { opacity: 0.38, scale: 0.99, duration: 0.12, ease: "sine.out" },
        t0
      );
    }
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

  /* Vowel Docs: page title + sections + sidebar track transcript (Voice client ↔ Vowelbot). */
  tl.add(
    function () {
      vowelDocsModeRun("client");
    },
    T_VD_CLIENT
  );
  tl.add(
    function () {
      vowelDocsModeRun("vowelbot");
    },
    T_VD_VOWELBOT
  );
  tl.add(
    function () {
      vowelDocsModeRun("client");
    },
    T_VD_CLIENT_RETURN
  );

  wireVoweldocsVoiceFabToMaster(tl);

  /* Closing CTA: NE zoom to costs, then stagger + unload — after “give Vowel a try”; leads into “clearing out that support inbox.” */
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

  tl.fromTo("#outro-layer", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: "power2.out" }, OUTRO_IN);
  tl.add(
    function () {
      var inh = document.getElementById("scene-inbox-host");
      if (inh) {
        inh.classList.remove("scene-inbox-reprise");
      }
      var wrap = document.getElementById("karaoke-wrap");
      if (wrap) {
        wrap.classList.remove("karaoke-wrap--dialogue", "karaoke-wrap--abstract-on");
      }
    },
    OUTRO_IN
  );
  tl.to("#karaoke-wrap", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, OUTRO_IN);
  tl.to("#scene-voweldocs-host", { autoAlpha: 0, filter: "blur(8px)", duration: 0.5 }, OUTRO_IN);
  tl.to("#scene-inbox-host", { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, OUTRO_IN);

  tl.set({}, {}, MASTER);

  window.__timelines["vowel-onboarding-master"] = tl;
})();
