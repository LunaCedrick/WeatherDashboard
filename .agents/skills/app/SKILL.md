---
name: app
description: Wire the complete application in `js/app.js`.
---

## Purpose

Wire the complete application in `js/app.js`.

## Scope

- Add the application state object.
- Implement `handleSearch(city)`.
- Add search form submit handling.
- Add Enter/search behavior through the form.
- Add Celsius and Fahrenheit toggle behavior.
- Use `Promise.all` for current weather and forecast calls.
- Read the last city from localStorage on page load.
- Write the last successful city to localStorage.

## Rules

- Do not modify `api.js`, `ui.js`, or `config.js`.
- No direct fetch calls.
- No direct DOM rendering.
- State lives only in `app.js`.
- Store raw Kelvin API data in `state.lastRawData`.
- Re-render from stored data when toggling units.
- Every function and event listener block must have comments.

## Review

After building, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
