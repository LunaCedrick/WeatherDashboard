---
name: autocomplete
description: Add city search suggestions using OpenWeatherMap Geocoding API, including accessible in-flow suggestion layout for the Weather Dashboard glass-card UI.
---

## Purpose

Add a city autocomplete feature to the existing search flow.
Users should see suggested locations while typing, then select a suggestion
to search that location.

## Scope

This is a cross-module feature. It may modify only:

- `index.html`
- `style.css`
- `js/config.js`
- `js/api.js`
- `js/ui.js`
- `js/app.js`

## API Layer

In `config.js`:

- Add the OpenWeatherMap geocoding base URL or endpoint constant.
- Add a suggestion limit constant.
- Add a debounce delay constant.
- Keep `config.js` constants-only.

In `api.js`:

- Add `fetchCitySuggestions(query)`.
- Use OpenWeatherMap Geocoding API:
  `/geo/1.0/direct?q={query}&limit={limit}&appid={API_KEY}`
- Return parsed suggestion data or throw existing typed API errors.
- No DOM access.
- No UI rendering.
- No state management.

## UI Layer

In `index.html`:

- Add a suggestions container near the search input.
- Place the suggestions container inside the search field group, directly after the input.
- Keep semantic, accessible markup.
- Do not add inline styles.

In `style.css`:

- Style suggestions as an in-flow panel below the search input by default.
- Do not use absolute positioning for the suggestions panel unless a user explicitly asks for an overlay.
- If an overlay is explicitly requested, define the parent and sibling stacking contexts so `backdrop-filter` glass cards cannot cover the dropdown.
- Keep the search button and unit toggle from being overlapped when suggestions are open.
- Use the existing glass visual language and include `backdrop-filter` and `-webkit-backdrop-filter` when the panel uses frosted glass.
- Ensure long city, state, and country labels wrap instead of causing horizontal overflow.

In `ui.js`:

- Add `renderSuggestions(suggestions)`.
- Add `clearSuggestions()`.
- Add `renderNoSuggestions()` only if needed.
- Render all suggestion text with `textContent`.
- Each suggestion should include city name, optional state, and country.
- Suggestion buttons/items must be keyboard-focusable.
- No fetch calls.
- No app state.

## App Layer

In `app.js`:

- Add debounced input handling.
- Do not call the suggestions API for empty or too-short input.
- Call `fetchCitySuggestions(query)` only after debounce delay.
- Handle suggestion click/keyboard selection.
- On selection, populate the search input and call `handleSearch(cityLabel)`.
- Preserve existing `handleSearch()` behavior.
- Preserve `Promise.all` for current weather + forecast.
- Do not store converted temperatures.

## UX Rules

- Suggestions appear below the search input.
- Suggestions must participate in normal layout and push later controls/cards down.
- Suggestions clear after successful selection.
- Suggestions clear when input is empty.
- Suggestions must not cause horizontal overflow on mobile.
- Dropdown must remain readable on all weather backgrounds.
- The weather card, search button, and unit toggle must never cover or be covered incoherently by suggestions.
- Keep touch targets at least 44px tall.
- Do not show raw API errors inside the suggestions dropdown.

## Accessibility Rules

- Suggestions container should be announced or associated with the search input.
- Search input should expose autocomplete state with ARIA where appropriate.
- Suggestion items must be reachable by keyboard.
- Escape should close suggestions if implemented.
- Error messages still use the existing main weather-card error flow.

## Error Handling

- Network/API failures while fetching suggestions should fail quietly or clear suggestions.
- Main search errors still use `renderError()`.
- Never expose raw API messages or status codes.

## Testing

Test manually or with mocks:

- Typing `Man` shows up to the configured limit of suggestions.
- Empty input clears suggestions and makes no API call.
- Spaces-only input clears suggestions and makes no API call.
- Selecting a suggestion triggers the existing search flow.
- Search still works by pressing Enter without selecting a suggestion.
- Unit toggle still re-renders from stored Kelvin data without a new API call.
- Forecast still filters noon entries.
- Suggestions open without overlapping the search button, unit toggle, or weather card.
- No horizontal overflow at 375px, 768px, 1024px, and 1440px.

## Review

After building, read `.agents/skills/review/SKILL.md` and report PASS, WARN, or FAIL.
