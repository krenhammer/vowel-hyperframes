# Vowel Design System

Voice agent platform. Natural, immediate, intelligent conversations.

## Usage

```bash
npx getdesign@latest add vowel
```

Run this command from your project root, then ask your AI assistant to use `DESIGN.md` for UI work.

## Preview

![Vowel Design System Preview](https://getdesign.md/api/og/vowel/design-md)

**Note:** This is an unofficial design system inspired by Uber's bold aesthetic. It's a curated starting point for building vowel-like UIs with your AI coding agent.

Vowel is designed around voice AI and uses natural, immediate interactions with clean, confident minimalism. Every element serves the conversation.

---

# Design System Inspired by Vowel

A bold, black-and-white design language built for clarity, efficiency, and confident minimalism in voice-first interfaces. Every element serves the conversation.

---

## Color Palette

### Natural Duality

**Vowel Black**
#000000
Primary headings, nav, footer, active states

**Pure White**
#ffffff
Page background, card surface, inverse text

**Chip Gray**
#efefef
Chip buttons, filter toggles, borders

**Hover Gray**
#e2e2e2
Button hover state

**Hover Light**
#f3f3f3
Subtle hover for floating buttons

**Body Gray**
#4b4b4b
Secondary text, descriptions

**Muted Gray**
#afafaf
Tertiary text, footer links, placeholders

**Default Link Blue**
#0000ee
Underlined text links in body content

---

## Typography Scale

### Vowel Voice Type System

| Sample | Role | Specs |
| --- | --- | --- |
| Display Hero | Display / Hero | 52px / Bold 700 / 1.23 |
| Section Heading | Section Heading | 36px / Bold 700 / 1.22 |
| Card Title | Card Title | 32px / Bold 700 / 1.25 |
| Sub-heading | Sub-heading | 24px / Bold 700 / 1.33 |
| Small Heading | Small Heading | 20px / Bold 700 / 1.40 |
| Navigation / UI Large | Nav / UI Large | 18px / Medium 500 / 1.33 |
| Body text and button labels | Body / Button | 16px / Regular 400 / 1.50 |
| Caption and metadata | Caption | 14px / Medium 500 / 1.43 |
| Micro text and fine print | Micro | 12px / Regular 400 / 1.67 |

---

## Button Variants

### Pill-Shaped Actions

**Primary Black**
Start Conversation

**Secondary Outline**
View Documentation

**Chip / Filter**
Audio Input
Voice Mode

**Chip Active**
Real-time
Low Latency

**Floating**
Voice Button

**On Dark Surface**
Sign Up
Get Started
View Pricing

**Chip Navigation Row**
Voice
Text
Video
Analytics

---

## Card Examples

### Conversation Cards

```
[Waveform Visualization]

How can I help you today?

[Quick Actions]
Ask Question
Transcribe
Analyze
```

### Feature Cards

```
[Illustration]

Real-time latency

Class-leading speech-to-speech performance delivers conversations that feel natural and immediate.

Try now
```

```
[Illustration]

Self-hosted control

Deploy vowel on your own infrastructure for full control over data, compliance, and scaling.

Get started
```

---

## Form Elements

### Voice Input Components

```
[Microphone Button with Visualizer]

Press and hold to speak
```

```
[Audio Waveform Display]

Speaking...
```

```
[Transcript Display]

User: What's the weather like today?
Vowel: It's 72°F and sunny today.
```

```
[Conversation Controls]
Function calling integration
Tool calling
Real-time voice AI
STT, LLM, TTS, VAD
```

---

## Spacing Scale

### 8px Grid System

```
4px   0.25rem
8px   0.50rem
12px  0.75rem
16px  1.00rem
20px  1.25rem
24px  1.50rem
32px  2.00rem
48px  3.00rem
64px  4.00rem
```

---

## Border Radius Scale

### Corner Shapes

```
None    0px
Standard    8px
Comfortable    12px
Full Pill    999px
Circle    50%
```

---

## Elevation / Depth

### Shadow Hierarchy

```
Flat    No shadow, border only
Subtle    rgba(0,0,0,0.12) 0 4px 16px
Medium    rgba(0,0,0,0.16) 0 4px 16px
Floating    rgba(0,0,0,0.16) 0 2px 8px + lift
Pressed    rgba(0,0,0,0.08) inset
```

---

## Voice-Specific Elements

### Waveform Visualizations

```
[Audio Waveform]
______|______|______|______|______
```

### Conversation Indicators

```
[Speaking State]
●●●●● (pulsing)

[Listening State]
● (static)
```

### Latency Display

```
[Latency Indicator]
Class-leading speech-to-speech latency
<50ms
```

---

## Iconography

### Voice-First Icons

- **Microphone**: Primary action for voice input
- **Waveform**: Audio visualization
- **Chat Bubble**: Conversation history
- **Settings**: Configuration
- **Database**: Self-hosted deployment
- **Shield**: Security and compliance
- **Star**: Featured/intelligent features
- **Cheat**: Tool calling/integration

---

## Layout Patterns

### Conversation Layout

```
[Header]
[Voice Input Area]
[Conversation History]
[Quick Actions]
[Footer]
```

### Dashboard Layout

```
[Sidebar Navigation]
[Main Content Area]
[Voice Control Panel]
[Analytics Panel]
```

### Pricing Layout

```
[Hero Section]
[Feature Cards]
[Pricing Plans]
[FAQ Section]
[CTA Section]
```

---

## Dark Mode Support

### Dark Surface Colors

**Dark Background**
#1a1a1a
Main dark surface

**Dark Surface**
#242424
Card surfaces, panels

**Dark Text**
#ffffff
Primary text on dark backgrounds

**Dark Muted**
#a0a0a0
Secondary text on dark backgrounds

**Dark Border**
#333333
Borders and dividers

---

## Accessibility

### Color Contrast

- **Black on White**: 21:1 (AAA)
- **White on Black**: 21:1 (AAA)
- **Gray on White**: 4.5:1 (AAA)
- **Gray on Black**: 4.5:1 (AAA)

### Focus States

```
[Focus Outline]
__________
|        |
|        |
|________|
```

### Keyboard Navigation

- All interactive elements accessible via Tab
- Enter/Space for actions
- Escape to dismiss modals
- Arrow keys for navigation

---

## Animation Guidelines

### Voice Feedback Animations

```
[Speaking Indicator]
●●●●● (smooth pulse)
duration: 1.5s
ease: ease-in-out

[Listening Indicator]
● (static)
duration: 0s

[Waveform Animation]
______|______|______|______|______
animation: waveMove 2s infinite
```

### Transitions

- **Button Hover**: 0.2s ease
- **Card Hover**: 0.2s ease
- **Modal Open**: 0.3s ease
- **Waveform Play**: 0.5s ease

---

## Component Libraries

### Available Components

1. **VoiceButton**: Primary voice input interaction
2. **ConversationCard**: Individual message display
3. **Waveform**: Audio visualization
4. **LatencyIndicator**: Real-time performance display
5. **QuickActions**: Common conversation actions
6. **PricingCard**: Plan comparison
7. **FeatureCard**: Value proposition display
8. **FAQItem**: Question and answer display

---

## Best Practices

### Voice-First Design

1. **Prioritize Conversations**: Main interface should center on voice interactions
2. **Visual Feedback**: Clear indicators for speaking/listening states
3. **Latency Transparency**: Display real-time performance metrics
4. **Quick Actions**: Common tasks accessible from voice input
5. **Transparency**: Show transcript and tool calls for clarity

### Design Principles

1. **Confident Minimalism**: Every element serves a purpose
2. **Natural Interactions**: Design for human-like conversation flow
3. **Immediate Feedback**: Real-time visual/audio responses
4. **Clear Hierarchy**: Guide users through conversation naturally
5. **Accessibility**: Inclusive design for all users

---

## Implementation Examples

### Basic Voice Button

```html
<button class="voice-button" aria-label="Start conversation">
  <svg>...</svg>
</button>
```

### Conversation Card

```html
<div class="conversation-card">
  <div class="waveform">...</div>
  <p class="transcript">...</p>
  <div class="actions">...</div>
</div>
```

### Latency Indicator

```html
<div class="latency-indicator">
  <span>Real-time performance</span>
  <span class="latency-value">&lt;50ms</span>
</div>
```

---

## Resources

- **Official Docs**: https://docs.vowel.to/
- **GitHub**: https://github.com/usevowel/core
- **Pricing**: https://vowel.to/pricing
- **Support**: support@vowel.to

---

## Version History

- **v1.0.0** (2026-01): Initial design system inspired by Uber's aesthetic, adapted for voice AI platform