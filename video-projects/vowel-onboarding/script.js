/* global gsap */
(function () {
  window.__timelines = window.__timelines || {};

  var WORDS = window.ONBOARDING_WORDS;
  var MASTER = 91;
  var AI_FIRST = 78;
  var SCENE_HANDOFF = 28.35;
  var OUTRO_IN = 80.35;
  /** CTA: transcript “…clearing out that support inbox.” — re-show + reset comp-inbox; “clearing” @ 78.68s. */
  var INBOX_CTA = 78.4;
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

  function vdCaptionSet(spec, state) {
    var el = document.getElementById("vd-caption");
    if (!el) {
      return;
    }
    spec = spec || { lines: [] };
    el.setAttribute("data-vd-state", state || "inactive");
    el.setAttribute("data-vd-speaker", spec.speaker || "");
    el.className = "vd-caption clip vd-cap--" + (state || "inactive");
    var body = el.querySelector("#vd-cap-body");
    if (body) {
      body.innerHTML = (spec.lines || [])
        .map(function (w) {
          return '<div class="abs-bar clip cap-w-' + w + '" aria-hidden="true"></div>';
        })
        .join("");
    }
  }

  window.vdCaptionSet = vdCaptionSet;

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

  var tl = gsap.timeline({ paused: true });

  gsap.set("#bb-promo", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#karaoke-wrap", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#bb-ai", { autoAlpha: 0, visibility: "hidden" });
  gsap.set("#scene-voweldocs-host", { autoAlpha: 0 });
  gsap.set("#scene-inbox-host", { autoAlpha: 1 });
  gsap.set("#vd-inapp-dialogue-chrome", { autoAlpha: 0 });
  gsap.set("#vd-caption", {
    xPercent: 0,
    left: "1.5%",
    right: "1.5%",
    width: "auto",
    autoAlpha: 0,
    y: -16,
    force3D: true,
  });

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

  tl.to("#bb-promo", { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, SCENE_HANDOFF);
  tl.fromTo(
    "#bb-ai",
    { autoAlpha: 0, visibility: "visible" },
    { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
    SCENE_HANDOFF + 0.02
  );

  tl.add(
    function () {
      var wrap = document.getElementById("karaoke-wrap");
      if (wrap) {
        wrap.classList.add("karaoke-wrap--ai");
      }
    },
    SCENE_HANDOFF
  );

  tl.to("#vd-inapp-dialogue-chrome", { autoAlpha: 1, duration: 0.4, ease: "sine.out" }, SCENE_HANDOFF + 0.05);

  tl.to("#scene-inbox-host", { autoAlpha: 0, duration: 0.4, ease: "power3.in" }, SCENE_HANDOFF);
  tl.fromTo(
    "#scene-voweldocs-host",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
    SCENE_HANDOFF
  );

  /* Vowel Docs: swap title/sections + sidebar when dialogue moves between Voice client and Vowelbot. */
  tl.add(
    function () {
      vowelDocsModeRun("client");
    },
    36.62
  );
  tl.add(
    function () {
      vowelDocsModeRun("vowelbot");
    },
    44.78
  );
  tl.add(
    function () {
      vowelDocsModeRun("client");
    },
    56.28
  );

  /* Captions: neutral chrome; states drive FAB palette on #vd-fab inside comp-voweldocs (see COMPONENTS.md). */
  tl.add(
    function () {
      vdCaptionSet({ speaker: "user", lines: ["100", "88", "72"] }, "user");
    },
    29.1
  );
  tl.fromTo(
    "#vd-caption",
    { autoAlpha: 0, y: -20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      ease: "back.out(1.15)",
      overwrite: "auto",
    },
    29.05
  );

  tl.add(
    function () {
      vdCaptionSet({ speaker: "ai", lines: ["100", "92", "80"] }, "thinking");
    },
    32.4
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "ai", lines: ["100", "88"] }, "ai");
    },
    34.2
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "user", lines: ["92", "70"] }, "user");
    },
    38.5
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "ai", lines: ["100", "88", "76"] }, "thinking");
    },
    42.0
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "ai", lines: ["100", "92", "88", "60"] }, "ai");
    },
    44.0
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "user", lines: ["88", "80"] }, "user");
    },
    52.0
  );
  tl.add(
    function () {
      vdCaptionSet({ speaker: "ai", lines: ["100", "88", "72"] }, "ai");
    },
    55.5
  );
  tl.add(
    function () {
      vdCaptionSet({ lines: ["100", "92"] }, "active");
    },
    68.0
  );

  /* CTA: bring inbox back (not continuous — only for this line); reset to full 16 rows + static camera. */
  tl.add(
    function () {
      if (typeof window.resetInboxToFullList === "function") {
        window.resetInboxToFullList();
      }
      var inh = document.getElementById("scene-inbox-host");
      if (inh) {
        inh.classList.add("scene-inbox-reprise");
      }
    },
    INBOX_CTA
  );
  tl.to(
    "#scene-voweldocs-host",
    { autoAlpha: 0, duration: 0.4, filter: "blur(2px)", ease: "power2.in" },
    INBOX_CTA
  );
  tl.to(
    "#scene-inbox-host",
    { autoAlpha: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" },
    INBOX_CTA
  );

  tl.fromTo("#outro-layer", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: "power2.out" }, OUTRO_IN);
  tl.add(
    function () {
      var inh = document.getElementById("scene-inbox-host");
      if (inh) {
        inh.classList.remove("scene-inbox-reprise");
      }
    },
    OUTRO_IN
  );
  tl.to("#karaoke-wrap", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, OUTRO_IN);
  tl.to("#scene-voweldocs-host", { autoAlpha: 0, filter: "blur(8px)", duration: 0.5 }, OUTRO_IN);
  tl.to("#scene-inbox-host", { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, OUTRO_IN);
  tl.to("#vd-inapp-dialogue-chrome", { autoAlpha: 0, duration: 0.35 }, OUTRO_IN);
  tl.to("#vd-caption", { autoAlpha: 0, duration: 0.3 }, OUTRO_IN);

  tl.set({}, {}, MASTER);

  window.__timelines["vowel-onboarding-master"] = tl;
})();
