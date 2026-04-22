
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });

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

// ===== SCENE 3: SEO Experts =====
// Question comes in first
tl.from("#scene3 .question", {
  y: -50,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
}, 8.7);

// Posts drop in staggered with random positions and tilts
tl.from("#scene3 .post", {
  y: -300,
  opacity: 0,
  rotation: function(i) { return (i % 2 === 0 ? 1 : -1) * (5 + Math.random() * 10); },
  x: function(i) { return (i % 3 - 1) * 80; },
  duration: 0.5,
  stagger: 0.15,
  ease: "bounce.out"
}, 9.5);

// Pause for 1 second after last post drops (at 9.5 + 0.15*5 = 10.25)
// Then bounce exit all posts up quickly staggered
tl.to("#scene3 .post", {
  y: -400,
  opacity: 0,
  rotation: function(i) { return (i % 2 === 0 ? 1 : -1) * 15; },
  duration: 0.4,
  stagger: 0.08,
  ease: "power2.in"
}, 11.5);

// Question exits with posts
tl.to("#scene3 .question", {
  y: -50,
  opacity: 0,
  duration: 0.3,
  ease: "power2.in"
}, 11.8);

// ===== SCENE 4: Examples =====
// Entrance: stagger each card with different easing
tl.from("#scene4 .grid-title", {
  y: -30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 12.3);

tl.from("#scene4 .example", {
  y: 60,
  opacity: 0,
  scale: 0.9,
  duration: 0.6,
  stagger: 0.15,
  ease: "elastic.out(1, 0.6)"
}, 12.8);

// Transition to Scene 5: Crossfade with blur
tl.to("#scene4", {
  opacity: 0,
  filter: "blur(20px)",
  duration: 0.6,
  ease: "power2.in"
}, 15.5);
tl.to("#scene5", {
  opacity: 1,
  filter: "blur(0px)",
  duration: 0.6,
  ease: "power2.out"
}, 15.8);

// ===== SCENE 5: Vowel Intro =====
// Entrance: typewriter style words
tl.from("#scene5 .product", {
  x: -40,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 13.3);

tl.from("#scene5 .headline", {
  x: 50,
  opacity: 0,
  duration: 0.7,
  ease: "circ.out"
}, 13.6);

tl.from("#scene5 .tagline", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 14.2);

// Transition to Scene 6: Diagonal split
tl.to("#scene5", {
  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  duration: 0.4,
  ease: "power2.in"
}, 16.0);
tl.set("#scene6", { opacity: 1 }, 16.2);
tl.from("#scene6", {
  clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  duration: 0.5,
  ease: "power3.out"
}, 16.2);

// ===== SCENE 6: Two for One =====
// Entrance: cards fly in from sides
tl.from("#scene6 .split-title", {
  y: -40,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
}, 16.7);

tl.from("#scene6 .card.webmcp", {
  x: -200,
  opacity: 0,
  rotation: -10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, 17.2);

tl.from("#scene6 .card.voice", {
  x: 200,
  opacity: 0,
  rotation: 10,
  duration: 0.7,
  ease: "back.out(1.2)"
}, 17.4);

// Transition to Scene 7: Scale down to reveal
tl.to("#scene6", {
  scale: 0.8,
  opacity: 0,
  duration: 0.5,
  ease: "power2.in"
}, 19.5);
tl.to("#scene7", {
  opacity: 1,
  scale: 1,
  duration: 0.5,
  ease: "power2.out"
}, 19.8);

// ===== SCENE 7: VowelBot =====
// Entrance: cascade down
tl.from("#scene7 .label", {
  y: -30,
  opacity: 0,
  duration: 0.4,
  ease: "power2.out"
}, 20.3);

tl.from("#scene7 .headline", {
  y: 50,
  opacity: 0,
  duration: 0.6,
  ease: "bounce.out"
}, 20.6);

tl.from("#scene7 .feature", {
  x: 30,
  opacity: 0,
  duration: 0.4,
  stagger: 0.1,
  ease: "power2.out"
}, 21.2);

// Transition to Scene 8: Light leak
tl.to("#scene7", {
  opacity: 0,
  duration: 0.3,
  ease: "power2.in"
}, 23.0);
tl.fromTo("#scene8", 
  { opacity: 0 },
  { opacity: 1, duration: 0.6, ease: "power2.out" },
  23.1
);

// ===== SCENE 8: No Code =====
// Entrance: dramatic scale in
tl.from("#scene8 .headline", {
  scale: 3,
  opacity: 0,
  duration: 0.8,
  ease: "expo.out"
}, 23.6);

tl.from("#scene8 .big-text", {
  scale: 0.5,
  opacity: 0,
  rotation: -15,
  duration: 0.7,
  ease: "elastic.out(1, 0.4)"
}, 24.2);

// Transition to Scene 9: Gravity drop
tl.to("#scene8", {
  y: 1080,
  duration: 0.4,
  ease: "power3.in"
}, 26.5);
tl.to("#scene9", {
  y: 0,
  opacity: 1,
  duration: 0.5,
  ease: "bounce.out"
}, 26.7);

// ===== SCENE 9: CTA =====
// Entrance: final dramatic reveal
tl.from("#scene9 .headline", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  ease: "elastic.out(1, 0.5)"
}, 27.2);

tl.from("#scene9 .cta", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, 27.8);

tl.from("#scene9 .url", {
  y: 40,
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  stagger: 0.15,
  ease: "back.out(1.7)"
}, 28.2);

// Final fade to black
tl.to("#scene9", {
  opacity: 0,
  duration: 1.0,
  ease: "power2.in"
}, 29.0);

window.__timelines["webmcp-announce"] = tl;
