/* One second hold (linger) after the last motion in a beat, then the next transition. */
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });

var xfd = 0.45;
var L = 1;

function xf(tStart, outSel, inSel) {
  tl.to(outSel, { opacity: 0, duration: xfd, ease: "power2.inOut" }, tStart);
  tl.to(inSel, { opacity: 1, duration: xfd, ease: "power2.inOut" }, tStart);
}

function runWipe(wipeT, outSel, inSel) {
  tl.set("#cover-wipe-a", { x: -1080 }, wipeT);
  tl.set("#cover-wipe-b", { x: -1080 }, wipeT);
  tl.to("#cover-wipe-a", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT);
  tl.to("#cover-wipe-b", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.05);
  tl.set(outSel, { opacity: 0 }, wipeT + 0.14);
  tl.set(inSel, { opacity: 1 }, wipeT + 0.14);
  tl.to("#cover-wipe-a", { x: 1080, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.25);
  tl.to("#cover-wipe-b", { x: 1080, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.3);
  return wipeT + 0.4;
}

// ===== Scenes 1–2 =====
// Scene 1: RAG + “in / the / Browser!” — Scene 2: TURSO + SiTurso mark → move up → kinetic copy →
// “How does this work?” → shrink to kicker, then WASM in three parts (kinetic-style stagger)
tl.set("#scene2 .k-w, #s2Label", { opacity: 0 }, 0);
tl.set("#s2Headline", { autoAlpha: 0 }, 0);
tl.set("#s2Headline .s2-h2-line", { opacity: 0, y: 8 }, 0);
tl.set("#s2Kinetic", { opacity: 0, visibility: "hidden" }, 0);

tl.from(
  "#scene1 .ready .word1",
  { y: 60, opacity: 0, scale: 2, duration: 0.15, ease: "power4.out" },
  0.3
);
tl.from(
  "#scene1 .ready .word2",
  { y: 60, opacity: 0, scale: 2, duration: 0.15, ease: "power4.out" },
  0.6
);
tl.from(
  "#scene1 .ready .word3",
  { y: 60, opacity: 0, scale: 2, duration: 0.15, ease: "elastic.out(1, 0.3)" },
  0.9
);
tl.to("#scene1 .ready", { opacity: 0, duration: 0.3 }, 2.1);
tl.to(
  "#scene1",
  { scale: 3, backgroundColor: "#ffffff", duration: 0.6, ease: "power2.inOut" },
  2.4
);

/* Cover wipe 1 → 2 (Turso — subtle green; timing continues after 0.4s wipe) */
var tW12 = 2.8;
runWipe(tW12, "#scene1", "#scene2");
var tS2 = tW12 + 0.4;
tl.set(
  "#s2PrologueCenter",
  { display: "flex", autoAlpha: 1, visibility: "visible" },
  tS2
);
tl.set("#s2Prologue", { y: 0, autoAlpha: 1 }, tS2);
tl.fromTo(
  "#s2TursoHero",
  { scale: 0.32, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.42, ease: "expo.out" },
  tS2
);
var t2bMove = tS2 + 0.5;
/* Lift logo + lines together (keeps vertical rhythm) */
tl.to("#s2Prologue", { y: -64, duration: 0.38, ease: "power2.out" }, t2bMove);
var tKin0 = t2bMove + 0.4;
tl.set("#s2Kinetic", { visibility: "visible" }, tKin0);
tl.to("#s2Kinetic", { opacity: 1, duration: 0.2, ease: "power1.out" }, tKin0);

var tL1 = tKin0 + 0.22;
var pauseAB = 0.32;
var pauseBC = 0.32;
tl.to(
  "#scene2 .s2-line1 .k-w",
  { opacity: 1, y: 0, duration: 0.16, stagger: 0.07, ease: "power2.out" },
  tL1
);
var tL2s = tL1 + 0.16 + 0.07 * 3 + 0.12 + pauseAB;
tl.to(
  "#scene2 .s2-line2 .k-w",
  { opacity: 1, y: 0, duration: 0.16, stagger: 0.08, ease: "power2.out" },
  tL2s
);
var tL3s = tL2s + 0.16 + 0.08 * 4 + 0.1 + pauseBC;
tl.to(
  "#scene2 .s2-line3 .k-w",
  { opacity: 1, y: 0, duration: 0.16, stagger: 0.08, ease: "power2.out" },
  tL3s
);
var tAfterKinetic = tL3s + 0.16 + 0.08 * 2 + 0.12;
/* Prologue must fully clear before the title (no overlap with HOW DOES THIS WORK) */
var tPrologueOut = tAfterKinetic + 0.2;
tl.to(
  "#s2PrologueCenter",
  { autoAlpha: 0, duration: 0.5, ease: "power2.in" },
  tPrologueOut
);
tl.set("#s2PrologueCenter", { display: "none" }, tPrologueOut + 0.5);
tl.set("#s2Prologue", { y: 0, transform: "none" }, tPrologueOut + 0.5);
var tLabelIn = tPrologueOut + 0.58;
tl.set("#s2Label", { transformOrigin: "50% 50%" }, tLabelIn);
tl.fromTo(
  "#s2Label",
  { scale: 1.1, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.45, ease: "expo.out" },
  tLabelIn
);
var tLabelCorner = tLabelIn + 1.0;
/* Do NOT set transform: "none" or top/left: "auto" here — that nukes scale and breaks full-bleed layout. */
tl.to(
  "#s2Label",
  {
    scale: 0.46,
    color: "#4895ef",
    y: -320,
    transformOrigin: "50% 50%",
    duration: 0.6,
    ease: "power3.inOut",
  },
  tLabelCorner
);
tl.to("#scene2", { backgroundColor: "#0a1210", duration: 0.6, ease: "power2.inOut" }, tLabelCorner);
var tS2Head = tLabelCorner + 0.7;
/* Same beat as prologue k-w: three parts, opacity + y staggered (SCRIPT_DRAFT line 15 = three pause-separated phrases). */
tl.set("#s2Headline", { autoAlpha: 1 }, tS2Head);
/* Pauses between parts ~ same energy as s2-line1 → s2-line2 (pauseAB 0.32) but compressed for this stack */
var s2H2Stagger = 0.24;
var s2H2PartDur = 0.18;
tl.to(
  "#s2Headline .s2-h2-line",
  {
    opacity: 1,
    y: 0,
    duration: s2H2PartDur,
    stagger: s2H2Stagger,
    ease: "power2.out",
  },
  tS2Head
);
var t2ContentEnd = tS2Head + s2H2Stagger * 2 + s2H2PartDur + 0.5;
var s2Handoff = t2ContentEnd + L;
/* Cover wipe 2 → 3 */
var tAfterW23 = runWipe(s2Handoff, "#scene2", "#scene3");
// ----- Scene 3 -----
var t3 = tAfterW23 + 0.1;
tl.from("#scene3 .s3h", { y: 40, opacity: 0, duration: 0.5, ease: "expo.out" }, t3);
tl.from(
  "#scene3 .stat.s1",
  { x: -30, opacity: 0, duration: 0.45, ease: "power3.out" },
  t3 + 0.1
);
tl.from(
  "#scene3 .stat.s2",
  { x: 30, opacity: 0, duration: 0.45, ease: "power3.out" },
  t3 + 0.22
);
var punchT = t3 + 0.5;
tl.from(
  "#scene3 .punch",
  { y: 50, scale: 0.96, opacity: 0, duration: 0.6, ease: "back.out(1.25)" },
  punchT
);
var t3End = punchT + 0.6;
/* Cover wipe 3 → 4 */
var tW34 = t3End + L;
var tAfterW34 = runWipe(tW34, "#scene3", "#scene4");
var t4 = tAfterW34 + 0.05;

// ----- Scene 4: two sections, sec1 fully clears before sec2; line-by-line, with *extra* stillness:
// (1) after sec1 line 1 — before the pre-embed headline (d4PreLine2).
// (2) after sec1 line 2 — before “Well / voweldocs” (d4AfterS1L2).
// (3) after sec1 line 4 — time to read before part one fades (d4AfterS1Last).
// (4) after sec2 line 3 — extra stillness before the last line of part two (d4PreLast).
// (5) after sec2 line 4 — time to read that line on screen before the scene handoff (d4AfterS2Last).
var d4In = 0.36;
var d4Gap = 0.1;
var d4PreLine2 = 0.65;
var d4AfterS1L2 = 0.9;
var d4AfterS1Last = 1.25;
var d4PreLast = 1.1;
var d4AfterS2Last = 1.35;
var d4Ease = "power2.out";
function d4in(sel, tStart) {
  tl.fromTo(
    sel,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: d4In, ease: d4Ease },
    tStart
  );
}
tl.set("#d4-sec1 .d4-line, #d4-sec2 .d4-line", { opacity: 0, y: 12 }, 0);
tl.set("#d4-sec2", { autoAlpha: 0 }, 0);
var tS1L1 = t4;
d4in("#d4-sec1 .d4l1", tS1L1);
var tS1L2 = tS1L1 + d4In + d4Gap + d4PreLine2;
d4in("#d4-sec1 .d4l2", tS1L2);
var tS1L3 = tS1L2 + d4In + d4Gap + d4AfterS1L2;
d4in("#d4-sec1 .d4l3", tS1L3);
var tS1L4 = tS1L3 + d4In + d4Gap;
d4in("#d4-sec1 .d4l4", tS1L4);
var tS1Out = tS1L4 + d4In + d4AfterS1Last;
/* “So you could say” (full pink) → “we now inject” (deep purple) */
tl.to("#scene4", { backgroundColor: "#22122e", duration: 0.55, ease: "power2.inOut" }, tS1Out);
tl.to("#d4-sec1", { autoAlpha: 0, duration: 0.42, ease: "power2.in" }, tS1Out);
var tS2Start = tS1Out + 0.42;
tl.set("#d4-sec2", { autoAlpha: 1 }, tS2Start);
var tS2L5 = tS2Start + 0.06;
d4in("#d4-sec2 .d4l5", tS2L5);
var tS2L6 = tS2L5 + d4In + d4Gap;
d4in("#d4-sec2 .d4l6", tS2L6);
var tS2L7 = tS2L6 + d4In + d4Gap;
d4in("#d4-sec2 .d4l7", tS2L7);
var tS2L8 = tS2L7 + d4In + d4Gap + d4PreLast;
d4in("#d4-sec2 .d4l8", tS2L8);
var t4End = tS2L8 + d4In + d4AfterS2Last;
xf(t4End + L, "#scene4", "#scene5");

// ----- Scene 5 → 6 crossfade (no cover wipe; covers only 1–2, 2–3, 3–4) -----
var t5 = t4End + L + xfd + 0.05;
tl.set("#s5-zoom-root", { scale: 1, z: 0, transformOrigin: "50% 50%", display: "none" }, t5);
tl.set("#s5-text-col", { maxHeight: "none", overflow: "visible", clearProps: "transform,top,left", y: 0 }, t5);
/* Do NOT clearProps #s5-stage — its centering is transform: translate(-50%,-50%) in CSS */
tl.set("#scene5 .s5-callouts", { display: "none" }, t5);
tl.set("#scene5 .wow-w1", { opacity: 0, y: 14 }, t5);
tl.set("#scene5 .wow-w2", { opacity: 0, y: 14 }, t5);
tl.set("#scene5 .s5-qw", { opacity: 0, y: 11 }, t5);
tl.set("#scene5 .s5-goto", { opacity: 0, y: 14, scale: 1 }, t5);
tl.set("#scene5 .s5-instruct .s5-iw", { opacity: 0 }, t5);
/* Callouts default display:none in CSS; keep out of flow so faded lines cannot push the next line down. */
tl.set(
  "#scene5 .s5-instruct, #scene5 .s5-panel-lead, #scene5 .s5-tab-docs, #scene5 .s5-tab-chat",
  { display: "none", opacity: 0, y: 0 },
  t5
);
tl.set("#scene5 .s5-img-docs", { opacity: 1 }, t5);
tl.set("#scene5 .s5-img-rag, #scene5 .s5-img-chat", { opacity: 0 }, t5);
tl.set("#s5-shot", { opacity: 0, x: 440 }, t5);
tl.set("#s5-card-root", { transformOrigin: "50% 50%" }, t5);

/* Draft “..” = pause: stagger + holds, not punctuation on the type */
tl.fromTo(
  "#scene5 .wow-w1",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
  t5
);
tl.fromTo(
  "#scene5 .wow-w2",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" },
  t5 + 0.52
);
var t5QIn = t5 + 0.96;
tl.fromTo(
  "#scene5 .s5-qw",
  { opacity: 0, y: 11 },
  {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.068,
    ease: "power2.out",
  },
  t5QIn
);
tl.to(
  "#scene5 .wow-w1, #scene5 .wow-w2, #scene5 .s5-qw",
  { opacity: 0, y: -11, duration: 0.32, ease: "power2.in" },
  t5 + 1.58
);
/* URL line: large hero in center → pause → shrink + lift (clear of screenshot) */
var t5GotoIn = t5 + 1.86;
tl.fromTo(
  "#scene5 .s5-goto",
  { opacity: 0, y: 28, scale: 1 },
  { opacity: 1, y: 0, scale: 1.88, duration: 0.58, ease: "power2.out" },
  t5GotoIn
);
var t5GotoHeroHold = t5GotoIn + 0.58 + 0.92;
var t5TextToTop = t5GotoHeroHold;
tl.to(
  "#scene5 .s5-goto",
  { scale: 0.9, y: -168, duration: 0.68, ease: "power2.inOut" },
  t5TextToTop
);
tl.to(
  "#s5-text-col",
  { y: -132, duration: 0.68, ease: "power2.inOut" },
  t5TextToTop
);
/* Light recede on the shot only (copy is outside zoom-root) */
var t5ZoomStart = t5TextToTop - 0.08;
tl.to(
  "#s5-zoom-root",
  { scale: 0.9, z: -48, duration: 2.35, ease: "power1.inOut" },
  t5ZoomStart
);
var t5ShotIn = t5TextToTop + 0.06;
tl.set("#s5-zoom-root", { display: "flex" }, t5ShotIn);
tl.set(
  "#s5-card-root",
  { rotationX: 3.5, rotationY: -14, rotationZ: 0.1, transformOrigin: "50% 50%" },
  t5ShotIn
);
tl.to(
  "#s5-shot",
  { opacity: 1, x: 0, duration: 0.68, ease: "power3.out" },
  t5ShotIn
);
var t5ShotSettled = t5ShotIn + 0.68;
var t5PauseDocs = 1.12;
var t5RotLeft = t5ShotSettled + t5PauseDocs;
tl.to(
  "#s5-card-root",
  { rotationY: -28, rotationX: 7.5, rotationZ: 0.14, duration: 0.88, ease: "power2.inOut" },
  t5RotLeft
);
var t5ClearGoto = t5RotLeft + 0.82;
tl.to(
  "#scene5 .s5-goto",
  { opacity: 0, y: -14, duration: 0.28, ease: "power2.in" },
  t5ClearGoto
);
var t5TypeIn = t5ClearGoto + 0.12;
var s5Read = 0.5;
var s5Between = 0.4;
var s5Fade = 0.28;
tl.set("#scene5 .s5-callouts", { display: "flex" }, t5TypeIn);
tl.set("#scene5 .s5-instruct", { display: "block" }, t5TypeIn);
tl.to("#scene5 .s5-instruct", { opacity: 1, duration: 0.15 }, t5TypeIn);
tl.to(
  "#scene5 .s5-instruct .s5-iw",
  { opacity: 1, duration: 0.09, stagger: 0.065, ease: "power1.out" },
  t5TypeIn + 0.08
);
/* Instruct complete → read → clear → gap → RAG swap */
var t5InstructDone = t5TypeIn + 0.08 + 7 * 0.065 + 0.09;
var t5ClearInstruct = t5InstructDone + s5Read;
tl.to(
  "#scene5 .s5-instruct",
  { opacity: 0, y: -10, duration: s5Fade, ease: "power2.in" },
  t5ClearInstruct
);
tl.set("#scene5 .s5-instruct .s5-iw", { opacity: 0 }, t5ClearInstruct + s5Fade);
tl.set("#scene5 .s5-instruct", { display: "none" }, t5ClearInstruct + s5Fade);
var t5SwapRag = t5ClearInstruct + s5Fade + s5Between;
tl.to("#scene5 .s5-img-docs", { opacity: 0, duration: 0.38, ease: "power1.inOut" }, t5SwapRag);
tl.to("#scene5 .s5-img-rag", { opacity: 1, duration: 0.42, ease: "power1.inOut" }, t5SwapRag);
var t5LeadIn = t5SwapRag + 0.44 + 0.32;
tl.set("#scene5 .s5-panel-lead", { display: "block" }, t5LeadIn);
tl.fromTo(
  "#scene5 .s5-panel-lead",
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" },
  t5LeadIn
);
var t5TabDocsIn = t5LeadIn + 0.52 + 0.38;
tl.set("#scene5 .s5-tab-docs", { display: "block" }, t5TabDocsIn);
tl.fromTo(
  "#scene5 .s5-tab-docs",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.54, ease: "power2.out" },
  t5TabDocsIn
);
var t5HoldRagRead = t5TabDocsIn + 0.54 + s5Read + 0.62;
tl.to(
  "#scene5 .s5-tab-docs",
  { opacity: 0, y: -10, duration: 0.32, ease: "power2.in" },
  t5HoldRagRead
);
tl.set("#scene5 .s5-tab-docs", { display: "none" }, t5HoldRagRead + 0.32);
/* Same layout: crossfade stack only; card root stays put. Swing rotationY back toward the right. */
var t5SwapChat = t5HoldRagRead + 0.18;
tl.to("#scene5 .s5-img-rag", { opacity: 0, duration: 0.42, ease: "power1.inOut" }, t5SwapChat);
tl.to("#scene5 .s5-img-chat", { opacity: 1, duration: 0.44, ease: "power1.inOut" }, t5SwapChat);
tl.to(
  "#s5-card-root",
  { rotationY: 14, rotationX: 3.6, rotationZ: -0.07, duration: 1.05, ease: "power2.inOut" },
  t5SwapChat
);
var t5TabChatIn = t5SwapChat + 0.48;
tl.set("#scene5 .s5-tab-chat", { display: "block" }, t5TabChatIn);
tl.fromTo(
  "#scene5 .s5-tab-chat",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" },
  t5TabChatIn
);
var t5End = t5TabChatIn + 0.52 + 0.55 + 0.35;
var t5to6 = t5End + L;
xf(t5to6, "#scene5", "#scene6");
var afterWef = t5to6 + xfd + 0.05;

// ----- Scene 6: voice + nav (same layout as scene 5) -----
var t6 = afterWef;
tl.set("#s6-zoom-root", { scale: 1, z: 0, transformOrigin: "50% 50%", display: "none" }, t6);
tl.set("#s6-card-root", { transformOrigin: "50% 50%" }, t6);
tl.set("#s6-shot", { opacity: 0, x: 440 }, t6);
tl.set(".h6-cap", { opacity: 0, y: 8 }, t6);
tl.set("#s6-cfg-beat", { autoAlpha: 0 }, t6);
tl.set(".s6-nav, .s6-mic", { opacity: 0 }, t6);
tl.from(".h6-sec", { y: 20, opacity: 0, duration: 0.35, ease: "expo.out" }, t6);
tl.from(".h6-line", { y: 28, opacity: 0, duration: 0.45, ease: "power3.out" }, t6 + 0.06);
var t6Shot = t6 + 0.2;
tl.set("#s6-zoom-root", { display: "flex" }, t6Shot);
tl.set(
  "#s6-card-root",
  { rotationX: 3.5, rotationY: -14, rotationZ: 0.1, transformOrigin: "50% 50%" },
  t6Shot
);
tl.to(
  "#s6-shot",
  { opacity: 1, x: 0, duration: 0.68, ease: "power3.out" },
  t6Shot
);
tl.to(
  "#s6-card-root",
  { rotationY: -22, rotationX: 6, rotationZ: 0.12, duration: 0.9, ease: "power2.inOut" },
  t6Shot + 0.5
);
tl.to(".s6-nav, .s6-mic", { opacity: 1, duration: 0.4, ease: "back.out(1.1)" }, t6Shot + 0.18);
tl.from(".h6-cap", { opacity: 0, y: 12, duration: 0.4, ease: "sine.out" }, t6Shot + 0.5);
var t6Swap = t6Shot + 1.2;
tl.to("#s6-hero-beat", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, t6Swap);
tl.to("#s6-cfg-beat", { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, t6Swap + 0.05);
tl.set("#s6-card-root", { className: "ui3d-sway s5-card-tilt sway-on" }, t6Swap + 0.35);
var t6End = t6Swap + 0.55 + 0.35;
xf(t6End + L, "#scene6", "#scene7");

// ----- Scene 7 (duck BGM) — talk UI + lines, self-host + answer (same layout as scene 5) -----
var t7 = t6End + L + xfd + 0.05;
tl.set("#s7-zoom-root", { display: "none" }, t7);
tl.set("#s7-shot", { opacity: 0, x: 440 }, t7);
tl.set("#self7", { opacity: 0 }, t7);
tl.fromTo(
  "#el-a",
  { volume: 0.55 },
  { volume: 0.1, duration: 0.3, ease: "none" },
  t7
);
tl.fromTo(
  "#s7-eyebrow",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
  t7
);
tl.set("#s7-zoom-root", { display: "flex" }, t7 + 0.1);
tl.to("#s7-shot", { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" }, t7 + 0.1);
tl.fromTo(
  "#talk7",
  { opacity: 0, y: 16, scale: 0.99 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
  t7 + 0.1
);
tl.set("#sway7-talk", { className: "ui3d-sway s5-card-tilt sway-on" }, t7 + 0.68);
/* Hold on talk still (VO); no on-screen assistant rows or faux mic — same pacing as former d1/d2 beat. */
var t7swap = t7 + 0.84 + 0.38 + L;
tl.to(
  "#talk7",
  { opacity: 0, duration: 0.38, ease: "power2.in" },
  t7swap + 0.04
);
tl.to(
  "#self7",
  { opacity: 1, duration: 0.45, ease: "power2.out" },
  t7swap + 0.1
);
tl.set(
  "#sway7-self",
  { className: "ui3d-sway s5-card-tilt sway-on" },
  t7swap + 0.2
);
/* Long self-host TTS: hold on full-bleed screenshot only (no on-screen wall of text). */
var t7End = t7swap + 0.55 + 1.0;
tl.to(
  "#el-a",
  { volume: 0.55, duration: 0.45, ease: "none" },
  t7End + 0.4
);
xf(t7End + L, "#scene7", "#scene8");

// ----- Scene 8 outro -----
var t8 = t7End + L + xfd + 0.05;
tl.from(
  "#scene8 .out1",
  { y: 50, opacity: 0, duration: 0.55, ease: "expo.out" },
  t8
);
tl.from(
  "#scene8 .url-pill",
  { y: 30, scale: 0.92, opacity: 0, duration: 0.5, ease: "back.out(1.3)" },
  t8 + 0.2
);
var t8OutEnd = t8 + 0.2 + 0.5;
var fadeMs = 2.0;
var totalSec = t8OutEnd + L + fadeMs;
tl.fromTo(
  "#el-a",
  { volume: 0.55 },
  { volume: 0, duration: fadeMs, ease: "power1.out" },
  totalSec - fadeMs
);

tl.set({}, {}, totalSec);
window.__timelines["turso-rag-master"] = tl;

/**
 * Scene 6 (nav / voweldocs button): mount AnimatedImageBackground after sub-composition HTML exists.
 */
function tryInitS6AnimatedBg() {
  var host = document.getElementById("s6-animated-bg-host");
  if (!host) {
    return false;
  }
  if (host.getAttribute("data-aib") === "1") {
    return true;
  }
  if (!window.AnimatedImageBackground) {
    return false;
  }
  host.setAttribute("data-aib", "1");
  new window.AnimatedImageBackground(host, {
    imageSrc: "assets/voweldocs-button.png",
    backgroundColor: "#121b2e",
    ringColor: "rgba(62, 207, 142, 0.42)",
    accentColor: "#3ecf8e",
    pressAnimation: "random",
    seed: 0x5a7e1c3f,
  });
  return true;
}
if (!tryInitS6AnimatedBg()) {
  var _s6Tries = 0;
  var _s6Id = setInterval(function () {
    _s6Tries += 1;
    if (tryInitS6AnimatedBg() || _s6Tries > 80) {
      clearInterval(_s6Id);
    }
  }, 50);
}
