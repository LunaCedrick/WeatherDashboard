---
name: api
description: Build the data layer in `js/config.js` and `js/api.js`.
---

## Purpose

Build the data layer in `js/config.js` and `js/api.js`.

## Scope

- Add API constants to `config.js`.
- Implement `fetchCurrentWeather(city)`.
- Implement `fetchForecast(city)`.
- Fetch with `units=standard` only.
- Parse JSON responses.
- Throw typed, descriptive errors for HTTP and network failures.

## Error Mapping

- 401: service unavailable
- 404: city not found
- 429: too many requests
- 5xx: server error
- network failure: connection failed
- unknown: unexpected error

## Rules

- No DOM access.
- No UI rendering.
- No state management.
- No generic `Error` for app errors.
- Every function must have JSDoc.
- No `console.log`.

## Review

After building, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
