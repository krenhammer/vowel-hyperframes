
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });

// Scene 3 post positions: init lives in compositions/scene-03-seo.html (runs when that sub-composition inlines)

// ===== SCENE 1: Title =====
// WebMCP is already visible (large on screen)
// Rubber stamp stagger "are" "you" "ready?" with bounce
tl.from("#scene1 .ready .word1", {
  y: 60,
  opacity: 0,
  scale: 2,
  duration: 0.15,
  ease: "power4.out"
}, 0.3);

tl.from("#scene1 .ready .word2", {
  y: 60,
  opacity: 0,
  scale: 2,
  duration: 0.15,
  ease: "power4.out"
}, 0.6);

tl.from("#scene1 .ready .word3", {
  y: 60,
  opacity: 0,
  scale: 2,
  duration: 0.15,
  ease: "elastic.out(1, 0.3)"
}, 0.9);

// Transition to Scene 2: Zoom into WebMCP → white background
tl.to("#scene1 .ready", {
  opacity: 0,
  duration: 0.3
}, 2.5);

tl.to("#scene1", {
  scale: 3,
  backgroundColor: "#ffffff",
  duration: 0.6,
  ease: "power2.inOut"
}, 2.8);

tl.to("#scene2", {
  opacity: 1,
  duration: 0.4,
  ease: "power2.out"
}, 3.2);

// ===== SCENE 2: What is WebMCP =====
// Scene 2 appears with white bg, then transitions to blue

// First: "What is it?" zooms in from scale 0.5 to 1 (centered)
tl.fromTo("#scene2 .label", 
  { scale: 2, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
  3.2
);

// Pause for 1.5 seconds (longer linger to read)
// Then: zoom out + move to final position + change to blue
tl.to("#scene2 .label", {
  scale: 0.5,
  color: "#4895ef",
  top: "auto",
  left: "auto",
  x: 0,
  y: 0,
  transform: "none",
  duration: 0.6,
  ease: "power3.inOut"
}, 5.0);

// Background transitions white → blue
tl.to("#scene2", {
  backgroundColor: "#0d1b2a",
  duration: 0.6,
  ease: "power2.inOut"
}, 5.0);

// Then headline and desc come in
tl.from("#scene2 .headline", {
  y: 50,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
}, 5.7);

tl.from("#scene2 .desc", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 6.1);

// Transition to Scene 3: Cover transition (blinds)
tl.to("#scene2", {
  clipPath: "inset(0% 0)",
  duration: 0.5,
  ease: "power2.inOut"
}, 8.0);
// Scenes 1–2 must go to opacity 0 when scene 3+ take over. Later layers (4, 5, …) fade
// to transparent; if 1–2 stayed at 1, they would show through (e.g. "What is it?" after scene 4).
tl.set("#scene1", { opacity: 0 }, 8.2);
tl.set("#scene2", { opacity: 0 }, 8.2);
tl.to("#scene3", {
  opacity: 1,
  duration: 0.5,
  ease: "power2.out"
}, 8.2);

// ===== SCENE 3: SEO Experts (x-post + reddit-post mocks; ~1s between drops, then float) =====
// Question comes in first
tl.from("#scene3 .question", {
  y: -50,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
}, 8.7);

// Six cards: 1s stagger, fall, then light sine bob until exit
var scene3Slots = document.querySelectorAll("#scene3 .post-slot");
var scene3T0 = 9.5;
var scene3Stagger = 1.0;
var scene3Fall = 0.58;
var scene3Exit = 16.0;
for (var si = 0; si < scene3Slots.length; si++) {
  var el = scene3Slots[si];
  var tDrop = scene3T0 + si * scene3Stagger;
  tl.to(
    el,
    {
      y: 0,
      opacity: 1,
      duration: scene3Fall,
      ease: "bounce.out"
    },
    tDrop
  );
  var tFloat = tDrop + scene3Fall;
  var windowLeft = scene3Exit - tFloat;
  var bobDur = 0.4;
  var maxRepeats = Math.max(0, Math.min(12, Math.floor(windowLeft / (bobDur * 2))));
  if (maxRepeats > 0) {
    var bobAmp = 5 + (si % 3) * 1.2;
    var xAmp = 3.5 + (si % 2) * 1.5;
    var rotAmp = 0.6 + (si % 4) * 0.2;
    tl.to(
      el,
      {
        y: "+=" + bobAmp,
        x: "+=" + xAmp,
        rotation: "+=" + rotAmp,
        yoyo: true,
        repeat: maxRepeats,
        duration: bobDur,
        ease: "sine.inOut"
      },
      tFloat
    );
  }
}

tl.to(
  "#scene3 .post-slot",
  {
    y: -400,
    opacity: 0,
    rotation: "+=6",
    duration: 0.45,
    stagger: 0.07,
    ease: "power2.in"
  },
  15.6
);
tl.to("#scene3 .question", {
  y: -50,
  opacity: 0,
  duration: 0.35,
  ease: "power2.in"
}, 15.85);

// ===== SCENE 3 → 4: Staggered blocks cover (registry: transitions-cover pattern) =====
var coverT = 15.88;
tl.set("#cover-wipe-a", { x: -1920 }, coverT - 0.01);
tl.set("#cover-wipe-b", { x: -1920 }, coverT - 0.01);
tl.to("#cover-wipe-a", { x: 0, duration: 0.25, ease: "power3.inOut" }, coverT);
tl.to("#cover-wipe-b", { x: 0, duration: 0.25, ease: "power3.inOut" }, coverT + 0.06);
tl.set("#scene3", { opacity: 0 }, coverT + 0.2);
tl.set("#scene4", { opacity: 1 }, coverT + 0.2);
tl.to("#cover-wipe-a", { x: 1920, duration: 0.25, ease: "power3.inOut" }, coverT + 0.28);
tl.to("#cover-wipe-b", { x: 1920, duration: 0.25, ease: "power3.inOut" }, coverT + 0.34);

// ===== SCENE 4: Headlines + tool cards (same fall / float / exit as scene 3 post-slots) =====
tl.to("#scene4 .grid-title", {
  y: 0,
  opacity: 1,
  duration: 0.5,
  ease: "power3.out"
}, 16.35);
tl.to("#scene4 .grid-sub", {
  y: 0,
  opacity: 1,
  duration: 0.45,
  ease: "power2.out"
}, 16.42);
tl.to("#scene4 .grid-mcp", {
  y: 0,
  opacity: 1,
  duration: 0.45,
  ease: "power2.out"
}, 16.5);

var scene4Slots = document.querySelectorAll("#scene4 .function-slot");
var scene4T0 = 16.65;
var scene4Stagger = 0.32;
var scene4Fall = 0.5;
var scene4Exit = 19.0;
for (var fsi = 0; fsi < scene4Slots.length; fsi++) {
  var fel = scene4Slots[fsi];
  var tDrop4 = scene4T0 + fsi * scene4Stagger;
  tl.to(
    fel,
    {
      y: 0,
      opacity: 1,
      duration: scene4Fall,
      ease: "bounce.out"
    },
    tDrop4
  );
  var tFloat4 = tDrop4 + scene4Fall;
  var winLeft4 = scene4Exit - tFloat4;
  var bobDur4 = 0.4;
  var maxRep4 = Math.max(0, Math.min(12, Math.floor(winLeft4 / (bobDur4 * 2))));
  if (maxRep4 > 0) {
    var bobAmp4 = 5 + (fsi % 3) * 1.2;
    var xAmp4 = 3.5 + (fsi % 2) * 1.5;
    var rotAmp4 = 0.6 + (fsi % 4) * 0.2;
    tl.to(
      fel,
      {
        y: "+=" + bobAmp4,
        x: "+=" + xAmp4,
        rotation: "+=" + rotAmp4,
        yoyo: true,
        repeat: maxRep4,
        duration: bobDur4,
        ease: "sine.inOut"
      },
      tFloat4
    );
  }
}

tl.to(
  "#scene4 .function-slot",
  {
    y: -400,
    opacity: 0,
    rotation: "+=6",
    duration: 0.45,
    stagger: 0.06,
    ease: "power2.in"
  },
  18.92
);
tl.to(
  "#scene4 .grid-title, #scene4 .grid-sub, #scene4 .grid-mcp",
  {
    y: -50,
    opacity: 0,
    duration: 0.35,
    stagger: 0.04,
    ease: "power2.in"
  },
  19.08
);

// Transition to Scene 5: Crossfade with blur
tl.to("#scene4", {
  opacity: 0,
  filter: "blur(20px)",
  duration: 0.6,
  ease: "power2.in"
}, 19.7);
tl.to("#scene5", {
  opacity: 1,
  filter: "blur(0px)",
  duration: 0.6,
  ease: "power2.out"
}, 20.0);

// ===== SCENE 5: White → “WebMCP” / then “Sounds great…” (after flash so it’s not covered) / exit act1 / stagger pitch (pauses = stagger gap) =====
tl.fromTo(
  "#scene5-flash",
  { opacity: 1, scale: 1 },
  {
    scale: 1.65,
    opacity: 0,
    duration: 0.68,
    ease: "power2.inOut"
  },
  20.0
);
// Hero: kinetic letters — must use fromTo when CSS keeps opacity:0 (from() would tween 0→0)
tl.fromTo(
  "#scene5 .scene5-letter",
  {
    y: 110,
    opacity: 0,
    rotationX: -68,
    scale: 0.65
  },
  {
    y: 0,
    opacity: 1,
    rotationX: 0,
    scale: 1,
    duration: 0.52,
    stagger: 0.065,
    ease: "back.out(1.35)"
  },
  20.02
);

// “Sounds great, but how do I get started?” — after flash clears
tl.fromTo(
  "#scene5 .scene5-pain .word",
  { y: 36, opacity: 0, scale: 0.92 },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.32,
    stagger: 0.065,
    ease: "power3.out"
  },
  20.72
);

// Drop act1 (WebMCP + “Sounds great…”) — opacity only (act1 is translateY(-50%) centered; avoid GSAP y fighting CSS)
tl.to(
  "#scene5 .scene5-act1",
  { opacity: 0, duration: 0.45, ease: "power2.in" },
  21.75
);

// Act2: kinetic word spans; holds after Interactive Voice / open source component; beat after “re-platforming?” before exit
var scene5LineBase = 22.12;
var scene5LineGap = 0.44;
var scene5PauseAfterVoiceAI = 0.5;
var scene5PauseAfterOneChange = 0.5;
var scene5Line4Start =
  scene5LineBase +
  3 * scene5LineGap +
  scene5PauseAfterVoiceAI +
  scene5PauseAfterOneChange;
/** Line 4 is two spans: “with no” + “re-platforming?” */
var scene5Line4SpanCount = 2;
var scene5Line4TweenDur =
  0.38 + 0.06 * Math.max(0, scene5Line4SpanCount - 1);
var scene5PauseAfterReplatform = 1.42;
var scene5HoldAfterQuestion = 0.42;
var scene5ExitT =
  scene5Line4Start +
  scene5Line4TweenDur +
  scene5PauseAfterReplatform +
  scene5HoldAfterQuestion;
var scene5LineStarts = [
  scene5LineBase,
  scene5LineBase + scene5LineGap,
  scene5LineBase + 2 * scene5LineGap + scene5PauseAfterVoiceAI,
  scene5Line4Start
];
var scene5Lines = [
  '#scene5 .scene5-kline[data-k="1"] .scene5-w',
  '#scene5 .scene5-kline[data-k="2"] .scene5-w',
  '#scene5 .scene5-kline[data-k="3"] .scene5-w',
  '#scene5 .scene5-kline[data-k="4"] .scene5-w'
];
for (var si = 0; si < scene5Lines.length; si++) {
  tl.fromTo(
    scene5Lines[si],
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.38,
      stagger: 0.06,
      ease: "power3.out"
    },
    scene5LineStarts[si]
  );
}

// Transition to Scene 6: Diagonal split (after re-platforming beat)
tl.to("#scene5", {
  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  duration: 0.4,
  ease: "power2.in"
}, scene5ExitT);
tl.set("#scene6", { opacity: 1 }, scene5ExitT + 0.2);
tl.from("#scene6", {
  clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  duration: 0.5,
  ease: "power3.out"
}, scene5ExitT + 0.2);

var sc6T0 = scene5ExitT + 0.7;

// ===== SCENE 6: enter vowel (typed) → pause → Two for one + cards =====
var sc6VowelStart = sc6T0 + 0.4;
var sc6VowelLetterDur = 0.1;
var sc6VowelLetterStagger = 0.1;
var sc6VowelLetterCount = 5;
var sc6VowelTypeEnd =
  sc6VowelStart +
  sc6VowelLetterDur +
  sc6VowelLetterStagger * (sc6VowelLetterCount - 1);
var sc6PauseAfterVowel = 0.62;
var sc6SplitTitleT = sc6VowelTypeEnd + sc6PauseAfterVowel;

tl.from("#scene6 .scene6-enter-prefix", {
  y: 18,
  opacity: 0,
  duration: 0.45,
  ease: "power3.out"
}, sc6T0);

tl.fromTo(
  "#scene6 .scene6-vowel-letter",
  { opacity: 0 },
  {
    opacity: 1,
    duration: sc6VowelLetterDur,
    stagger: sc6VowelLetterStagger,
    ease: "none"
  },
  sc6VowelStart
);

tl.from("#scene6 .split-title", {
  y: -40,
  opacity: 0,
  duration: 0.55,
  ease: "power3.out"
}, sc6SplitTitleT);

tl.from("#scene6 .card.webmcp", {
  x: -200,
  opacity: 0,
  rotation: -10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, sc6SplitTitleT + 0.38);

tl.from("#scene6 .card.voice", {
  x: 200,
  opacity: 0,
  rotation: 10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, sc6SplitTitleT + 0.58);

var sc6Exit = sc6SplitTitleT + 2.55;

// Transition to Scene 8 first (GitHub Action beat), then Scene 7 (VowelBot)
tl.to("#scene6", {
  scale: 0.8,
  opacity: 0,
  duration: 0.5,
  ease: "power2.in"
}, sc6Exit);
tl.to("#scene8", {
  opacity: 1,
  scale: 1,
  duration: 0.5,
  ease: "power2.out"
}, sc6Exit + 0.3);

var sc8T0 = sc6Exit + 0.65;
var sc8Gap = 0.28;
var sc8PauseAfterLine2 = 0.28;
var sc8LineStarts = [
  sc8T0,
  sc8T0 + sc8Gap + 0.42,
  sc8T0 + 2 * sc8Gap + 0.42 + sc8PauseAfterLine2,
  sc8T0 + 3 * sc8Gap + 0.42 + sc8PauseAfterLine2 + 0.32
];
var sc8Lines = [
  '#scene8 .scene8-kline[data-k="1"] .scene8-w',
  '#scene8 .scene8-kline[data-k="2"] .scene8-w',
  '#scene8 .scene8-kline[data-k="3"] .scene8-w',
  '#scene8 .scene8-kline[data-k="4"] .scene8-w'
];
for (var sj = 0; sj < sc8Lines.length; sj++) {
  tl.fromTo(
    sc8Lines[sj],
    { y: 26, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.36,
      stagger: 0.055,
      ease: "power3.out"
    },
    sc8LineStarts[sj]
  );
}

/** Line 4: two spans (“and a” + “new branch”) */
var sc8Line4SpanCount = 2;
var sc8AnimEnd =
  sc8LineStarts[3] +
  0.36 +
  0.055 * Math.max(0, sc8Line4SpanCount - 1);
var sc8Hold = 0.28;
var sc8Exit = sc8AnimEnd + sc8Hold;

// ===== SCENE 7: VowelBot (after Scene 8) =====
tl.to("#scene8", {
  opacity: 0,
  duration: 0.35,
  ease: "power2.in"
}, sc8Exit);
tl.set("#scene7", { y: 0, scale: 1 }, sc8Exit + 0.14);
tl.to("#scene7", {
  opacity: 1,
  scale: 1,
  duration: 0.5,
  ease: "power2.out"
}, sc8Exit + 0.15);

var sc7T0 = sc8Exit + 0.45;

tl.from("#scene7 .label", {
  y: -30,
  opacity: 0,
  duration: 0.38,
  ease: "power2.out"
}, sc7T0);

tl.from("#scene7 .headline", {
  y: 50,
  opacity: 0,
  duration: 0.55,
  ease: "bounce.out"
}, sc7T0 + 0.22);

tl.from("#scene7 .feature", {
  x: 30,
  opacity: 0,
  duration: 0.36,
  stagger: 0.09,
  ease: "power2.out"
}, sc7T0 + 0.62);

var sc7Exit = sc7T0 + 2.15;

// Transition to Scene 9: Gravity drop
tl.set("#scene9", { y: 1080 }, sc7Exit - 0.05);
tl.to("#scene7", {
  y: 1080,
  duration: 0.4,
  ease: "power3.in"
}, sc7Exit);
tl.to("#scene9", {
  y: 0,
  opacity: 1,
  duration: 0.5,
  ease: "bounce.out"
}, sc7Exit + 0.18);

var sc9T0 = sc7Exit + 0.58;

// ===== SCENE 9: CTA =====
tl.from("#scene9 .headline", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  ease: "elastic.out(1, 0.5)"
}, sc9T0);

tl.from("#scene9 .cta", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, sc9T0 + 0.55);

tl.from("#scene9 .url", {
  y: 40,
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  stagger: 0.15,
  ease: "back.out(1.7)"
}, sc9T0 + 0.95);

// Final fade to black
tl.to("#scene9", {
  opacity: 0,
  duration: 1.0,
  ease: "power2.in"
}, sc9T0 + 2.05);

window.__timelines["webmcp-announce"] = tl;
