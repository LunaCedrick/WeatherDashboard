---
name: setup
description: Create the Weather Dashboard foundation only. Do not add feature logic.
---

## Purpose

Create the Weather Dashboard foundation only. Do not add feature logic.

## Inputs

- `AGENTS.md`
- `PLAN.md` if extra setup context is needed

## Scope

Create:

- `index.html`
- `style.css`
- `js/config.js`
- `js/api.js`
- `js/ui.js`
- `js/app.js`
- `skills/*/SKILL.md`
- `README.md`

## Rules

- Body must start with `weather-default`.
- Link Google Fonts: Poppins 600/900 and Inter 400.
- Load scripts in this exact order: `config.js`, `api.js`, `ui.js`, `app.js`.
- Use semantic HTML.
- Use no inline styles.
- Add only setup-level CSS: reset, tokens, base layout, glass card, search controls, background classes.
- Add no API fetch logic.
- Add no render logic.
- Add no app state or event logic.
- Comment every section.

## Review

After setup, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
