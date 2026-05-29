---
name: atmosphere
description: >
  Enhances the dynamic sky background system with richer multi-stop gradients
  and CSS-only atmospheric elements. Replaces the original two-stop flat
  gradients with realistic sky depth, and adds pseudo-element effects — sun
  glow, moon, stars, rain streaks, fog layer, and snow shimmer.
  Always read AGENTS.md first before applying any changes.
---

## Goal
Make the dynamic sky backgrounds visually immersive.
The original gradients were two-color and flat.
This skill upgrades them to multi-stop, directional,
sky-accurate gradients with atmospheric depth elements —
all using pure CSS, zero images, zero libraries.

## Scope
- Modifies: style.css only
- Touches: background state classes, body pseudo-elements
- Does NOT touch: index.html, any JS file, glass card styles,
  typography, spacing, or any other existing CSS rules

## How To Use This Skill
Feed Codex:
1. AGENTS.md
2. skills/atmosphere/SKILL.md

Prompt to use:
"Read AGENTS.md and skills/atmosphere/SKILL.md completely.
Update style.css only. Replace all 8 background gradient
classes with the upgraded versions in this skill.
Add all atmospheric pseudo-element effects exactly as
specified. Add the snowy contrast override.
Add the z-index stacking rule.
Do not touch any other CSS rules, HTML, or JS files.
Comment every new block clearly.
After applying, run skills/review/SKILL.md and report
every change made."

---

## Part 1 — Upgraded Background Gradient Classes

Replace ALL existing background state classes entirely.
Use 180deg (top to bottom) — not 135deg.
Each class has 4-5 color stops for sky depth.
Darker at the top, lighter toward the horizon.

```css
/* ── CLEAR DAY ──────────────────────────────────────────
   Deep navy at the top, brilliant blue midday,
   soft light blue toward the horizon.
   Simulates a bright, sunny afternoon sky. */
.weather-clear-day {
  background: linear-gradient(180deg,
    #0a2463 0%,
    #1565c0 25%,
    #1e88e5 55%,
    #64b5f6 80%,
    #e3f2fd 100%);
}

/* ── CLEAR NIGHT ─────────────────────────────────────────
   True black at the top fading into deep midnight blue.
   Stars and moon glow added via pseudo-elements below. */
.weather-clear-night {
  background: linear-gradient(180deg,
    #000000 0%,
    #0a0a2e 30%,
    #0d1b4b 60%,
    #1a237e 100%);
}

/* ── CLOUDY ──────────────────────────────────────────────
   Dark steel grey at the top, layered toward silver-white.
   Realistic overcast sky with visible depth between layers. */
.weather-cloudy {
  background: linear-gradient(180deg,
    #546e7a 0%,
    #78909c 30%,
    #90a4ae 60%,
    #b0bec5 85%,
    #cfd8dc 100%);
}

/* ── RAINY ───────────────────────────────────────────────
   Near-black at the top transitioning to dark moody blue.
   Heavy, oppressive feeling matching rain conditions.
   Rain streak texture added via pseudo-element below. */
.weather-rainy {
  background: linear-gradient(180deg,
    #0d1117 0%,
    #0f1f35 30%,
    #1a2f4a 60%,
    #1e3a5f 100%);
}

/* ── STORMY ──────────────────────────────────────────────
   Pure black fading into dark teal-black.
   Maximum drama — this feels dangerous and heavy. */
.weather-stormy {
  background: linear-gradient(180deg,
    #000000 0%,
    #0a0f0f 25%,
    #0d1f1f 55%,
    #102020 80%,
    #0f2027 100%);
}

/* ── SNOWY ───────────────────────────────────────────────
   Cool grey-blue at the top, fading to near-white below.
   Snow dot shimmer added via pseudo-element below.
   NOTE: Requires contrast override — see Part 3. */
.weather-snowy {
  background: linear-gradient(180deg,
    #90a4ae 0%,
    #b0bec5 25%,
    #cfd8dc 55%,
    #e3eaf0 80%,
    #f5f8fa 100%);
}

/* ── FOGGY ───────────────────────────────────────────────
   Muted grey-purple top to medium blue-grey.
   Dense fog layer rising from the bottom added
   via pseudo-element below. */
.weather-foggy {
  background: linear-gradient(180deg,
    #37474f 0%,
    #546e7a 30%,
    #607d8b 60%,
    #78909c 85%,
    #90a4ae 100%);
}

/* ── DEFAULT ─────────────────────────────────────────────
   Classic clean sky blue — fallback and loading state.
   Used on page load before first search. */
.weather-default {
  background: linear-gradient(180deg,
    #0d47a1 0%,
    #1565c0 30%,
    #1976d2 60%,
    #42a5f5 85%,
    #90caf9 100%);
}
```

---

## Part 2 — Atmospheric Pseudo-Element Effects

These effects use ::before and ::after on the body element.
They are position: fixed so they always cover the full viewport.
pointer-events: none ensures they never block user interaction.
z-index: 0 keeps them behind all content.

### Required body setup
Add position: relative to body if not already present.
The overflow-x: hidden prevents horizontal scroll from
any pseudo-element that extends slightly beyond the viewport.

```css
/* Body must be positioned for pseudo-elements to anchor.
   overflow-x hidden prevents any pseudo-element bleed. */
body {
  position: relative;
  overflow-x: hidden;
}
```

### Sun Glow — Clear Day
A warm radial gradient in the upper right corner.
Simulates the glow of the sun behind the sky.

```css
/* Sun glow effect — only visible on clear day background.
   Positioned upper right. Radial gradient fades to transparent. */
.weather-clear-day::before {
  content: '';
  position: fixed;
  top: -80px;
  right: 10%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 236, 100, 0.5) 0%,
    rgba(255, 200, 50, 0.25) 40%,
    transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

### Moon Glow — Clear Night
A cool blue-white radial glow in the upper right.
Smaller and cooler than the sun — moonlight feel.

```css
/* Moon glow effect — only visible on clear night background.
   Softer and cooler than the sun glow. */
.weather-clear-night::before {
  content: '';
  position: fixed;
  top: 40px;
  right: 12%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(200, 220, 255, 0.45) 0%,
    rgba(180, 200, 255, 0.2) 40%,
    transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

### Stars — Clear Night
Ten scattered star dots using stacked radial-gradients.
Each dot is 1px, slightly different opacity for realism.

```css
/* Star field — only visible on clear night background.
   Ten static star positions using stacked radial gradients.
   1px dots at varying opacity to simulate real stars. */
.weather-clear-night::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 25% 8%,  rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 5%,  rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 12%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 7%,  rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 15% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 90% 25%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 40%, rgba(255,255,255,0.3) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
```

### Rain Streaks — Rainy
Subtle diagonal repeating gradient simulating falling rain.
Very low opacity — suggestive, not literal.

```css
/* Rain streak texture — only visible on rainy background.
   Repeating diagonal lines at very low opacity.
   Creates a sense of rainfall without being distracting. */
.weather-rainy::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: repeating-linear-gradient(
    100deg,
    transparent,
    transparent 2px,
    rgba(174, 214, 241, 0.04) 2px,
    rgba(174, 214, 241, 0.04) 4px
  );
  pointer-events: none;
  z-index: 0;
}
```

### Fog Layer — Foggy
A dense semi-transparent overlay rising from the bottom.
Creates the feeling of ground fog obscuring the horizon.

```css
/* Ground fog layer — only visible on foggy background.
   Linear gradient from transparent top to misty bottom.
   Sits at the bottom 40% of the viewport. */
.weather-foggy::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(176, 190, 197, 0.3) 60%,
    rgba(176, 190, 197, 0.5) 100%
  );
  pointer-events: none;
  z-index: 0;
}
```

### Snow Shimmer — Snowy
Eight scattered snow dot positions using radial gradients.
Slightly larger than stars (2px) and bright white.

```css
/* Snow shimmer — only visible on snowy background.
   Eight static snow dot positions using radial gradients.
   2px dots, bright white, scattered across the viewport. */
.weather-snowy::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 15% 20%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 30% 50%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(2px 2px at 50% 30%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(2px 2px at 70% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(2px 2px at 85% 25%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 45% 70%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(2px 2px at 60% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(2px 2px at 20% 75%, rgba(255,255,255,0.8) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
```

---

## Part 3 — Snowy Background Contrast Override

The snowy gradient ends at near-white (#f5f8fa).
White text on near-white fails WCAG contrast requirements.
Override text color and glass card style for snowy state only.

```css
/* Snowy contrast override.
   White text is unreadable on near-white background.
   Switch key text elements to dark on snowy state only.
   Glass card border also adjusted for light background.
   Class names match the actual app as built — verified. */
.weather-snowy .weather-card__temperature,
.weather-snowy .weather-card__location,
.weather-snowy .weather-card__description,
.weather-snowy .weather-card__meta-label,
.weather-snowy .weather-card__meta-value,
.weather-snowy .forecast-card__day,
.weather-snowy .forecast-card__temps {
  color: #1a1a2e;
}

.weather-snowy .glass-card {
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.12);
}
```

---

## Part 4 — Z-Index Stacking Rule

All content must sit above pseudo-element atmospheric effects.
Add position: relative and z-index: 1 to all major content
containers. This ensures pseudo-elements never overlap content.

```css
/* Z-index stacking — ensures all content sits above
   the pseudo-element atmospheric effects (z-index: 0).
   Every major container must have position: relative. */
.glass-card,
.forecast-section,
.forecast-container,
.app-header,
.app-footer,
.app-shell {
  position: relative;
  z-index: 1;
}
```

---

## Review Checklist — Atmosphere Specific

After applying, verify all of the following:

- [ ] All 8 gradient classes use 180deg not 135deg
- [ ] All 8 gradient classes have at least 4 color stops
- [ ] .weather-clear-day::before produces sun glow
- [ ] .weather-clear-night::before produces moon glow
- [ ] .weather-clear-night::after produces star field
- [ ] .weather-rainy::after produces rain streak texture
- [ ] .weather-foggy::after produces ground fog layer
- [ ] .weather-snowy::before produces snow shimmer
- [ ] All pseudo-elements have pointer-events: none
- [ ] All pseudo-elements have z-index: 0
- [ ] All pseudo-elements have position: fixed
- [ ] All content containers have z-index: 1
- [ ] Snowy contrast override applied to text and glass card
- [ ] Body has position: relative and overflow-x: hidden
- [ ] Background transition still reads: transition: background 1.2s ease
- [ ] No CSS rules unrelated to this skill were modified or removed
- [ ] No HTML or JS files were touched
- [ ] Every new block has a comment above it

## What NOT To Do

- Do not change the glass card base styles, except for the snowy override
- Do not change any typography rules
- Do not change spacing or layout
- Do not add any JS for these effects — CSS only
- Do not add any external images or assets
- Do not modify CSS rules unrelated to background states,
  atmospheric effects, z-index stacking, or snowy contrast
- Do not add animations or keyframes — static effects only
- Do not remove existing CSS rules that are not being replaced