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
  tl.set("#cover-wipe-a", { x: -1920 }, wipeT);
  tl.set("#cover-wipe-b", { x: -1920 }, wipeT);
  tl.to("#cover-wipe-a", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT);
  tl.to("#cover-wipe-b", { x: 0, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.05);
  tl.set(outSel, { opacity: 0 }, wipeT + 0.14);
  tl.set(inSel, { opacity: 1 }, wipeT + 0.14);
  tl.to("#cover-wipe-a", { x: 1920, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.25);
  tl.to("#cover-wipe-b", { x: 1920, duration: 0.2, ease: "power3.inOut" }, wipeT + 0.3);
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

var tS2 = 2.8;
tl.set(
  "#s2PrologueCenter",
  { display: "flex", autoAlpha: 1, visibility: "visible" },
  tS2
);
tl.set("#s2Prologue", { y: 0, autoAlpha: 1 }, tS2);
tl.to("#scene2", { opacity: 1, duration: 0.35, ease: "power2.out" }, tS2);
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
tl.to("#scene2", { backgroundColor: "#0d1b2a", duration: 0.6, ease: "power2.inOut" }, tLabelCorner);
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
tl.to(
  "#scene2",
  { clipPath: "inset(0% 0)", duration: 0.5, ease: "power2.inOut" },
  s2Handoff
);
tl.set("#scene1", { opacity: 0 }, s2Handoff + 0.2);
tl.set("#scene2", { opacity: 0 }, s2Handoff + 0.2);
tl.to(
  "#scene3",
  { opacity: 1, duration: 0.5, ease: "power2.out" },
  s2Handoff + 0.2
);

// ----- Scene 3 -----
var t3 = s2Handoff + 0.35;
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
xf(t3End + L, "#scene3", "#scene4");

// ----- Scene 4: two sections, sec1 fully clears before sec2; line-by-line, with *extra* stillness:
// (1) after sec1 line 1 — before the pre-embed headline (d4PreLine2).
// (2) after sec1 line 2 — before “Well / voweldocs” (d4AfterS1L2).
// (3) after sec1 line 4 — time to read before part one fades (d4AfterS1Last).
// (4) after sec2 line 3 — extra stillness before the last line of part two (d4PreLast).
// (5) after sec2 line 4 — time to read that line on screen before the scene handoff (d4AfterS2Last).
var t4 = t3End + L + xfd + 0.05;
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

// ----- Scene 5 → wipe 6 -----
var t5 = t4End + L + xfd + 0.05;
tl.from(
  "#scene5 .wow",
  { x: -50, opacity: 0, duration: 0.4, ease: "expo.out" },
  t5
);
tl.from(
  "#scene5 .q5",
  { y: 24, opacity: 0, duration: 0.4, ease: "power2.out" },
  t5 + 0.1
);
tl.from(
  "#scene5 .url-pill",
  { y: 40, scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.35)" },
  t5 + 0.2
);
var t5End = t5 + 0.2 + 0.5;
var afterWef = runWipe(t5End + L, "#scene5", "#scene6");

// ----- Scene 6 -----
var t6 = afterWef;
tl.from("#scene6 .kicker", { opacity: 0, y: 16, duration: 0.35, ease: "power2.out" }, t6);
tl.from(
  "#scene6 .s6h",
  { opacity: 0, y: 16, duration: 0.4, ease: "expo.out" },
  t6 + 0.06
);
tl.fromTo(
  "#zoom6",
  { scale: 1, x: 0, y: 0 },
  { scale: 1.12, x: 40, y: 24, duration: 1.0, ease: "power2.inOut" },
  t6 + 0.12
);
tl.to(
  "#scene6 .debug-ol",
  { opacity: 1, duration: 0.35, ease: "power2.out" },
  t6 + 0.2
);
tl.from(
  "#scene6 .cap6",
  { opacity: 0, y: 12, duration: 0.4, ease: "sine.out" },
  t6 + 0.25
);
var ragIn = t6 + 0.35;
tl.fromTo(
  "#scene6 .rag-3d",
  { opacity: 0, y: 36 },
  { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
  ragIn
);
var t6End = ragIn + 0.65;
/* Continuous 3D orbit on the corner panel (no GSAP transform — inner .ui3d-sway animates) */
tl.set("#sway6-rag", { className: "ui3d-sway sway-on" }, ragIn + 0.7);
tl.set("#sway6-zoom", { className: "ui3d-sway sway-on" }, t6 + 1.15);
xf(t6End + L, "#scene6", "#scene7");

// ----- Scene 7 → wipe 8 -----
var t7 = t6End + L + xfd + 0.05;
tl.from(
  "#scene7 .s7h",
  { y: 36, opacity: 0, duration: 0.45, ease: "expo.out" },
  t7
);
tl.from(
  "#scene7 .s7sub",
  { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" },
  t7 + 0.08
);
tl.fromTo(
  "#scene7 .g-3d",
  { scale: 0.97, opacity: 0, y: 24 },
  { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
  t7 + 0.12
);
tl.set("#sway7-chat", { className: "ui3d-sway sway-on" }, t7 + 0.88);
var t7End = t7 + 0.12 + 0.75;
var afterWgh = runWipe(t7End + L, "#scene7", "#scene8");

// ----- Scene 8 -----
var t8 = afterWgh;
tl.from(
  "#scene8 .sec8",
  { y: 20, opacity: 0, duration: 0.35, ease: "expo.out" },
  t8
);
tl.from(
  "#scene8 .h8",
  { y: 28, opacity: 0, duration: 0.45, ease: "power3.out" },
  t8 + 0.06
);
tl.fromTo(
  "#scene8 .hero8",
  { scale: 0.98, opacity: 0, y: 20 },
  { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
  t8 + 0.1
);
tl.to(
  "#scene8 .nav8",
  { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.1)" },
  t8 + 0.18
);
tl.from(
  "#scene8 .cfg8-intro",
  { opacity: 0, y: 12, duration: 0.35, ease: "sine.out" },
  t8 + 0.4
);
tl.fromTo(
  "#scene8 .cfg8-3d",
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
  t8 + 0.5
);
tl.set("#sway8-hero", { className: "ui3d-sway sway-on" }, t8 + 0.62);
tl.set("#sway8-cfg", { className: "ui3d-sway sway-on" }, t8 + 1.2);
tl.fromTo(
  "#scene8 .mic8",
  { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" },
  { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" },
  t8 + 0.65
);
var t8End = t8 + 0.65 + 0.4;
xf(t8End + L, "#scene8", "#scene9");

// ----- Scene 9 (duck BGM) — talk UI + lines, 1s linger, then self-host + answer (no duplicate chrome) -----
var t9 = t8End + L + xfd + 0.05;
tl.fromTo(
  "#el-a",
  { volume: 0.55 },
  { volume: 0.1, duration: 0.3, ease: "none" },
  t9
);
tl.fromTo(
  "#s9-eyebrow",
  { opacity: 0, y: -6 },
  { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
  t9
);
tl.fromTo(
  "#faux9",
  { opacity: 0, scale: 0.88 },
  { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(1.2)" },
  t9 + 0.05
);
tl.to(
  "#faux9",
  { scale: 0.95, yoyo: true, repeat: 1, duration: 0.1, ease: "power1.inOut" },
  t9 + 0.35
);
tl.fromTo(
  "#talk9",
  { opacity: 0, y: 16, scale: 0.99 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
  t9 + 0.1
);
tl.set("#sway9-talk", { className: "ui3d-sway sway-on" }, t9 + 0.68);
var d1T = t9 + 0.5;
var d2T = t9 + 0.84;
tl.fromTo(
  "#d1",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
  d1T
);
tl.fromTo(
  "#d2",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
  d2T
);
var d2End = d2T + 0.38;
var t9swap = d2End + L;
tl.to(
  "#d1, #d2",
  { opacity: 0, y: -8, duration: 0.22, ease: "power2.in" },
  t9swap
);
tl.to(
  "#faux9",
  { opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in" },
  t9swap
);
tl.to(
  "#talk9",
  { opacity: 0, duration: 0.38, ease: "power2.in" },
  t9swap + 0.04
);
tl.to(
  "#self9",
  { opacity: 1, duration: 0.45, ease: "power2.out" },
  t9swap + 0.1
);
tl.set("#sway9-self", { className: "ui3d-sway sway-on" }, t9swap + 0.2);
tl.set("#d3", { visibility: "visible" }, t9swap + 0.2);
tl.fromTo(
  "#d3",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
  t9swap + 0.2
);
var t9End = t9swap + 0.2 + 0.5;
tl.to(
  "#el-a",
  { volume: 0.55, duration: 0.45, ease: "none" },
  t9End + 0.4
);
xf(t9End + L, "#scene9", "#scene10");

// ----- Scene 10 -----
var t10 = t9End + L + xfd + 0.05;
tl.from(
  "#scene10 .out1",
  { y: 50, opacity: 0, duration: 0.55, ease: "expo.out" },
  t10
);
tl.from(
  "#scene10 .url-pill",
  { y: 30, scale: 0.92, opacity: 0, duration: 0.5, ease: "back.out(1.3)" },
  t10 + 0.2
);
var t10End = t10 + 0.2 + 0.5;
var fadeMs = 2.0;
var totalSec = t10End + L + fadeMs;
tl.fromTo(
  "#el-a",
  { volume: 0.55 },
  { volume: 0, duration: fadeMs, ease: "power1.out" },
  totalSec - fadeMs
);

tl.set({}, {}, totalSec);
window.__timelines["turso-rag-master"] = tl;
