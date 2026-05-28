---
name: review
description: Audit the current session's work before reporting completion.
---

## Purpose

Audit the current session's work before reporting completion.

## Output Format

Use:

- PASS
- WARN
- FAIL

## Checklist

- `AGENTS.md` was read before coding.
- File structure matches the project structure.
- Script order is `config.js`, `api.js`, `ui.js`, `app.js`.
- Body starts with exactly one weather background class.
- `api.js` has no DOM access.
- `ui.js` has no fetch calls.
- `app.js` has no direct fetch calls.
- `config.js` contains constants only.
- `Promise.all` is used when both weather endpoints are called.
- Temperatures are stored as Kelvin and converted only in UI rendering.
- Forecast is filtered to noon entries.
- All errors shown to users are human-readable.
- Error messages use `role="alert"`.
- All API/user text is rendered with `textContent`.
- No `console.log` remains.
- No CSS or JS framework was added.
- `backdrop-filter` and `-webkit-backdrop-filter` both exist.
- Every function has JSDoc once functions are implemented.
- No module outside the active skill scope was changed.

## Notes

Flag setup-only sessions separately when a feature checklist item is not applicable yet.
