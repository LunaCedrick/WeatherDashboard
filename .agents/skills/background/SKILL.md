---
name: background
description: Build the dynamic sky background system.
---

## Purpose

Build the dynamic sky background system.

## Scope

- Ensure all eight weather background classes exist in `style.css`.
- Ensure `body` has `transition: background 1.2s ease`.
- Add `setBackground(conditionCode, currentTime, sunrise, sunset)` to `js/ui.js`.
- Body must always have exactly one weather background class.

## Mapping

- 800 daytime: `weather-clear-day`
- 800 nighttime: `weather-clear-night`
- 801 to 802 daytime: `weather-cloudy`
- 801 to 802 nighttime: `weather-clear-night`
- 803 to 804: `weather-cloudy`
- 300 to 321: `weather-rainy`
- 500 to 531: `weather-rainy`
- 200 to 232: `weather-stormy`
- 600 to 622: `weather-snowy`
- 701 to 781: `weather-foggy`
- Any other code: `weather-default`

## Rules

- Do not modify `api.js`.
- No fetch calls.
- No state management.
- Use current time, sunrise, and sunset from the API response.
- Every function must have JSDoc.
- Test mapping logic before reporting complete.

## Review

After building, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
