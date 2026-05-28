---
name: ui
description: Build all rendering functions in `js/ui.js`.
---

## Purpose

Build all rendering functions in `js/ui.js`.

## Scope

- Preserve the existing background system.
- Implement `renderWeather(data, unit)`.
- Implement `renderForecast(data, unit)`.
- Implement `renderLoading()`.
- Implement `renderError(message)`.
- Implement `clearUI()`.
- Implement Kelvin conversion helpers.

## Rules

- Use `textContent` for user and API data.
- Never use `innerHTML` for external data.
- Do not fetch data.
- Do not import or call API functions.
- Do not manage global app state.
- Filter forecasts to entries whose `dt_txt` includes `12:00:00`.
- Convert temperatures only at render time.
- Every function must have JSDoc.

## Review

After building, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
