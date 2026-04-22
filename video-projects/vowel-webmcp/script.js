
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

// ===== SCENE 4: Examples =====
// (timings +4.2s after longer scene 3)
tl.from("#scene4 .grid-title", {
  y: -30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 16.5);

tl.from("#scene4 .example", {
  y: 60,
  opacity: 0,
  scale: 0.9,
  duration: 0.6,
  stagger: 0.15,
  ease: "elastic.out(1, 0.6)"
}, 17.0);

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

// ===== SCENE 5: Vowel Intro =====
tl.from("#scene5 .product", {
  x: -40,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 20.15);

tl.from("#scene5 .headline", {
  x: 50,
  opacity: 0,
  duration: 0.7,
  ease: "circ.out"
}, 20.45);

tl.from("#scene5 .tagline", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 20.95);

// Transition to Scene 6: Diagonal split (after scene 5 copy finishes)
tl.to("#scene5", {
  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  duration: 0.4,
  ease: "power2.in"
}, 22.0);
tl.set("#scene6", { opacity: 1 }, 22.2);
tl.from("#scene6", {
  clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  duration: 0.5,
  ease: "power3.out"
}, 22.2);

// ===== SCENE 6: Two for One =====
tl.from("#scene6 .split-title", {
  y: -40,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
}, 22.7);

tl.from("#scene6 .card.webmcp", {
  x: -200,
  opacity: 0,
  rotation: -10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, 23.2);

tl.from("#scene6 .card.voice", {
  x: 200,
  opacity: 0,
  rotation: 10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, 23.4);

// Transition to Scene 7: Scale down to reveal
tl.to("#scene6", {
  scale: 0.8,
  opacity: 0,
  duration: 0.5,
  ease: "power2.in"
}, 25.5);
tl.to("#scene7", {
  opacity: 1,
  scale: 1,
  duration: 0.5,
  ease: "power2.out"
}, 25.8);

// ===== SCENE 7: VowelBot =====
tl.from("#scene7 .label", {
  y: -30,
  opacity: 0,
  duration: 0.4,
  ease: "power2.out"
}, 26.3);

tl.from("#scene7 .headline", {
  y: 50,
  opacity: 0,
  duration: 0.6,
  ease: "bounce.out"
}, 26.6);

tl.from("#scene7 .feature", {
  x: 30,
  opacity: 0,
  duration: 0.4,
  stagger: 0.1,
  ease: "power2.out"
}, 27.2);

// Transition to Scene 8: Light leak
tl.to("#scene7", {
  opacity: 0,
  duration: 0.3,
  ease: "power2.in"
}, 29.0);
tl.fromTo("#scene8", 
  { opacity: 0 },
  { opacity: 1, duration: 0.6, ease: "power2.out" },
  29.1
);

// ===== SCENE 8: No Code =====
tl.from("#scene8 .headline", {
  scale: 3,
  opacity: 0,
  duration: 0.8,
  ease: "expo.out"
}, 29.6);

tl.from("#scene8 .big-text", {
  scale: 0.5,
  opacity: 0,
  rotation: -15,
  duration: 0.7,
  ease: "elastic.out(1, 0.4)"
}, 30.2);

// Transition to Scene 9: Gravity drop
tl.to("#scene8", {
  y: 1080,
  duration: 0.4,
  ease: "power3.in"
}, 32.5);
tl.to("#scene9", {
  y: 0,
  opacity: 1,
  duration: 0.5,
  ease: "bounce.out"
}, 32.7);

// ===== SCENE 9: CTA =====
tl.from("#scene9 .headline", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  ease: "elastic.out(1, 0.5)"
}, 33.2);

tl.from("#scene9 .cta", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 33.8);

tl.from("#scene9 .url", {
  y: 40,
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  stagger: 0.15,
  ease: "back.out(1.7)"
}, 34.2);

// Final fade to black
tl.to("#scene9", {
  opacity: 0,
  duration: 1.0,
  ease: "power2.in"
}, 35.0);

window.__timelines["webmcp-announce"] = tl;
