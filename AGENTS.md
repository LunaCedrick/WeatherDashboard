# AGENTS.md — Weather Dashboard
## Developer: Cedrick Masalunga Luna
## Project: Weather Dashboard
## Version: 1.0
## Status: Active Development

---

Read this file completely before writing any code.
This is the single source of truth for the entire project.
Every session starts here. No exceptions.

---

## 1. PROJECT OVERVIEW

A living, breathing weather dashboard.
The app visually IS the weather — not just about it.

When a user searches a city, the entire background
transitions to a sky gradient that matches the actual
weather condition returned by the API. Sunny cities
show warm gold skies. Stormy cities show dark teal.
Snowy cities show pale blue-white. Night searches
show deep navy. Frosted glass cards float on top of
the sky — clean, premium, readable.

This is a standalone project. It has its own design
identity completely separate from the portfolio.
Do not apply portfolio styles here. Start from zero.

Core behavior:
- User types a city name → app fetches real weather data
- User types at least 2 characters → app shows city suggestions
- User selects a suggestion → app searches that selected location
- Background transitions to match the weather condition
- Frosted glass cards display current weather + 5-day forecast
- Temperature toggles between Celsius and Fahrenheit instantly
- Last searched city persists across page reloads
- All errors are handled — no silent failures, ever

---

## 2. DESIGN SYSTEM

### Design Identity
Style    : Dynamic sky gradients + CSS-only atmospheric effects + frosted glass cards
Aesthetic: Weather-native, immersive, premium
Approach : Each background state IS a weather condition
           The design responds to real data — not decoration

### Background States
Eight CSS classes applied to the <body> element.
Swapped by JavaScript based on weather condition code
and time of day from the API response.
Body must always have exactly ONE background class.
Background gradients are multi-stop, top-to-bottom skies.
Use 180deg gradients only.

```css
.weather-clear-day {
  background: linear-gradient(180deg, #0a2463 0%, #1565c0 25%, #1e88e5 55%, #64b5f6 80%, #e3f2fd 100%);
}
.weather-clear-night {
  background: linear-gradient(180deg, #000000 0%, #0a0a2e 30%, #0d1b4b 60%, #1a237e 100%);
}
.weather-cloudy {
  background: linear-gradient(180deg, #546e7a 0%, #78909c 30%, #90a4ae 60%, #b0bec5 85%, #cfd8dc 100%);
}
.weather-rainy {
  background: linear-gradient(180deg, #0d1117 0%, #0f1f35 30%, #1a2f4a 60%, #1e3a5f 100%);
}
.weather-stormy {
  background: linear-gradient(180deg, #000000 0%, #0a0f0f 25%, #0d1f1f 55%, #102020 80%, #0f2027 100%);
}
.weather-snowy {
  background: linear-gradient(180deg, #90a4ae 0%, #b0bec5 25%, #cfd8dc 55%, #e3eaf0 80%, #f5f8fa 100%);
}
.weather-foggy {
  background: linear-gradient(180deg, #37474f 0%, #546e7a 30%, #607d8b 60%, #78909c 85%, #90a4ae 100%);
}
.weather-default {
  background: linear-gradient(180deg, #0d47a1 0%, #1565c0 30%, #1976d2 60%, #42a5f5 85%, #90caf9 100%);
}
```

Background transition — on the body element:
```css
body {
  transition: background 1.2s ease;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
```

Default class on page load: weather-default
This must be set in index.html before JS loads.

### Atmospheric Effects
Atmospheric effects are CSS-only pseudo-elements on the body element.
They must never require JavaScript, images, external assets, libraries,
or keyframe animations.

Required effects:
- Clear day uses `.weather-clear-day::before` for sun glow
- Clear night uses `.weather-clear-night::before` for moon glow
- Clear night uses `.weather-clear-night::after` for stars
- Rainy uses `.weather-rainy::after` for rain streaks
- Foggy uses `.weather-foggy::after` for ground fog
- Snowy uses `.weather-snowy::before` for snow shimmer

Pseudo-element rules:
- `position: fixed`
- `pointer-events: none`
- `z-index: 0`
- Content containers sit above effects with `position: relative` and `z-index: 1`
- Effects are static; no animations or keyframes

Snowy contrast rules:
- White text on snowy near-white backgrounds is not allowed
- Snowy state may override key weather/forecast text to dark
- Snowy state may override `.glass-card` background and border only as a state-specific contrast fix
- Do not change the base `.glass-card` style

### Condition Code → Background Class Mapping
OpenWeatherMap returns a numeric condition code.
Time of day is determined by comparing the current
Unix timestamp (dt) against sys.sunrise and sys.sunset.
All three values are in the API response — no extra call.

```
Code 800        → clear sky
  daytime       → weather-clear-day
  nighttime     → weather-clear-night

Code 801, 802   → few/scattered clouds
  daytime       → weather-cloudy
  nighttime     → weather-clear-night

Code 803, 804   → broken/overcast clouds
                → weather-cloudy

Code 300–321    → drizzle
Code 500–531    → rain
                → weather-rainy

Code 200–232    → thunderstorm
                → weather-stormy

Code 600–622    → snow
                → weather-snowy

Code 701–781    → atmosphere (fog, mist, haze, smoke)
                → weather-foggy

Any other code  → weather-default
```

### Frosted Glass Card
All cards use this exact CSS — no exceptions.
Always include -webkit-backdrop-filter for Safari support.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}
```

### Typography
```
Headline font  : Poppins, weight 900 (temperature numbers)
                 Poppins, weight 600 (section labels, city name)
Body font      : Inter, weight 400 (descriptions, metadata)

Text primary   : #ffffff
Text muted     : rgba(255, 255, 255, 0.7)
Text very muted: rgba(255, 255, 255, 0.5)
```

Google Fonts import — both fonts, correct weights:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;900&family=Inter:wght@400&display=swap" rel="stylesheet">
```

### Search Input — Glass Style
```css
.search__input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
}
.search__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.search__input:focus {
  border-color: rgba(255, 255, 255, 0.8);
}
```

### City Suggestions Dropdown
Suggestions are part of the search layout, not a floating overlay.
The suggestions container must sit directly below the search input
inside the search field group and participate in normal document flow.

Rules:
- Suggestions push the search button, unit toggle, and weather card down
- Suggestions must not overlap or be covered by frosted glass cards
- Do not use absolute positioning unless explicitly building an overlay
- If an overlay is explicitly requested, define parent/sibling stacking contexts
  so backdrop-filter cards cannot cover the dropdown
- Suggestion rows are keyboard-focusable buttons/items
- Suggestion text wraps safely and never causes horizontal scrolling
- Dropdown remains readable on all weather backgrounds

### Buttons
```css
/* Search button */
.search__button {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  color: #ffffff;
  transition: background 0.2s ease;
}
.search__button:hover {
  background: rgba(255, 255, 255, 0.35);
}

/* Unit toggle — active */
.unit-toggle__btn--active {
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #ffffff;
}

/* Unit toggle — inactive */
.unit-toggle__btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}
```

### Spacing and Shape
```
Card border-radius   : 20px
Button/input radius  : 12px
Card padding desktop : 32px
Card padding mobile  : 24px
Gap between cards    : 20px
Max content width    : 900px centered
All transitions      : 0.2s ease (except background: 1.2s ease)
```

---

## 3. TECH STACK

```
Frontend     : HTML5, CSS3, Vanilla JavaScript (ES6+)
API          : OpenWeatherMap — free tier
               Current Weather endpoint
               5-Day Forecast endpoint
               Weather icon CDN
Fonts        : Google Fonts — Poppins + Inter
Deployment   : Vercel
Version ctrl : GitHub
Editor       : VS Code + Codex
Frameworks   : NONE — no Bootstrap, Tailwind, jQuery, React
```

---

## 4. FILE STRUCTURE

```
weather-dashboard/
├── index.html          ← Single page, semantic HTML
├── style.css           ← All styles, no exceptions
├── js/
│   ├── config.js       ← API key, base URL, constants only
│   ├── api.js          ← All fetch calls, no UI logic
│   ├── ui.js           ← All DOM manipulation, no API logic
│   └── app.js          ← Orchestrator, state, event listeners
├── skills/
│   ├── setup/SKILL.md
│   ├── api/SKILL.md
│   ├── atmosphere/SKILL.md
│   ├── autocomplete/SKILL.md
│   ├── background/SKILL.md
│   ├── ui/SKILL.md
│   ├── app/SKILL.md
│   ├── review/SKILL.md
│   ├── responsive/SKILL.md
│   ├── performance/SKILL.md
│   └── vercel-deploy/SKILL.md
├── AGENTS.md           ← This file
├── PLAN.md             ← Full project plan
└── README.md           ← Project documentation
```

Script loading order in index.html — this order is mandatory:
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

---

## 5. MODULE ARCHITECTURE

### Strict Separation of Concerns
Each module has one job. Modules never cross into each
other's responsibilities. This is non-negotiable.

```
config.js
  ✅ API key constant
  ✅ Base API URL constant
  ✅ Default unit constant (Celsius)
  ✅ Named constants for magic numbers
  ❌ No functions
  ❌ No DOM access
  ❌ No fetch calls

api.js
  ✅ fetchCurrentWeather(city) — returns data or throws error
  ✅ fetchForecast(city) — returns data or throws error
  ✅ fetchCitySuggestions(query) — returns geocoding suggestions or throws error
  ✅ HTTP error handling (401, 404, 429, 500)
  ✅ Throws typed, descriptive errors
  ❌ No DOM access — never touches the HTML
  ❌ No UI rendering — never calls renderAnything()
  ❌ No state management

ui.js
  ✅ renderWeather(data, unit) — populates weather card
  ✅ renderForecast(data, unit) — populates forecast cards
  ✅ renderSuggestions(suggestions) — populates city suggestion list
  ✅ clearSuggestions() — hides and empties city suggestion list
  ✅ renderLoading() — shows loading state
  ✅ renderError(message) — shows error in card area
  ✅ clearUI() — resets display to empty state
  ✅ setBackground(code, currentTime, sunrise, sunset)
  ✅ Temperature conversion helpers (Kelvin to C or F)
  ❌ No fetch calls — never calls fetch() directly
  ❌ No API imports — does not use api.js functions
  ❌ No state management — receives data as parameters

app.js
  ✅ Application state object
  ✅ handleSearch(city) — full search flow orchestrator
  ✅ Debounced suggestion input handling
  ✅ Suggestion selection event handling
  ✅ Event listeners (search, Enter key, unit toggle)
  ✅ Promise.all for parallel API calls
  ✅ localStorage read on page load
  ✅ localStorage write on successful search
  ✅ Connects api.js output to ui.js input
  ❌ No direct fetch calls — always uses api.js functions
  ❌ No direct DOM manipulation — always uses ui.js functions
```

### Application State
Lives exclusively in app.js.
Single source of truth for the entire application.

```javascript
const state = {
  currentCity: '',       // Last successfully searched city
  currentUnit: 'C',     // Active temperature unit: 'C' or 'F'
  lastRawData: {         // Raw Kelvin data from last successful fetch
    current: null,
    forecast: null
  }
};
```

### Temperature Rule — Critical
Always store temperatures in Kelvin — exactly as the API returns.
Never store converted values. Convert only at render time in ui.js.

```javascript
// CORRECT — store Kelvin, convert at render
state.lastRawData.current = apiResponse; // contains temp in Kelvin
renderWeather(state.lastRawData.current, state.currentUnit); // convert here

// WRONG — never do this
state.currentTemp = kelvinToCelsius(apiResponse.main.temp);
```

This ensures unit toggle never needs a new API call —
it just re-renders from the stored Kelvin data.

### Parallel API Calls — Mandatory
Both API calls must always run in parallel.
Sequential calls are a performance failure.

```javascript
// CORRECT
const [currentData, forecastData] = await Promise.all([
  fetchCurrentWeather(city),
  fetchForecast(city)
]);

// WRONG — sequential, doubles wait time
const currentData = await fetchCurrentWeather(city);
const forecastData = await fetchForecast(city);
```

---

## 6. API REFERENCE

### Base URL
```
https://api.openweathermap.org/data/2.5/
```

### Current Weather Endpoint
```
GET /weather?q={city}&appid={API_KEY}&units=standard
```

Key response fields:
```
weather[0].id          → condition code (integer)
weather[0].description → condition description (string)
weather[0].icon        → icon code (string, e.g. "10d")
main.temp              → temperature in Kelvin
main.feels_like        → feels like in Kelvin
main.humidity          → humidity percentage
wind.speed             → wind speed in m/s
visibility             → visibility in metres
name                   → city name
sys.country            → country code
sys.sunrise            → sunrise Unix timestamp
sys.sunset             → sunset Unix timestamp
dt                     → current time Unix timestamp
```

### Forecast Endpoint
```
GET /forecast?q={city}&appid={API_KEY}&units=standard
```

Key response fields:
```
list[]                 → array of 40 forecast objects (3hr intervals)
list[].dt              → Unix timestamp for that forecast point
list[].dt_txt          → human-readable datetime string
list[].main.temp_max   → max temp in Kelvin for that 3hr block
list[].main.temp_min   → min temp in Kelvin for that 3hr block
list[].weather[0].icon → icon code for that block
list[].weather[0].description → condition description
```

### Forecast Filtering — Critical
The forecast API returns 40 data points — one every 3 hours.
To get one result per day, filter to the entry closest to noon.
Check dt_txt for "12:00:00" in the time portion.
This gives 5 daily entries, not 40 random ones.

```javascript
// Filter forecast list to one entry per day (noon)
const dailyForecasts = data.list.filter(item =>
  item.dt_txt.includes('12:00:00')
);
```

### Weather Icon URL
```
https://openweathermap.org/img/wn/{iconCode}@2x.png
```

### Direct Geocoding Endpoint
```
GET /geo/1.0/direct?q={query}&limit={limit}&appid={API_KEY}
```

Used only for search suggestions.
Suggestion failures should fail quietly or clear suggestions.
Do not show suggestion API errors in the dropdown.

### HTTP Error Codes
```
401 → Invalid API key
404 → City not found
429 → Rate limit exceeded
5xx → Server error
```

---

## 7. ERROR HANDLING

Every error must produce a human-readable message.
Never expose raw API error messages or status codes to users.

```
Empty input          → "Please enter a city name."
Spaces only input    → "Please enter a city name."
City not found (404) → "City not found. Please check the spelling."
Invalid API key(401) → "Service unavailable. Please try again later."
Rate limit (429)     → "Too many requests. Please wait a moment."
Network failure      → "Connection failed. Check your internet."
Server error (5xx)   → "Something went wrong. Please try again."
Unknown error        → "An unexpected error occurred. Try again."
```

Error display rules:
- Error message appears inside the main weather card area
- Previous weather data is cleared when error shows
- Error uses role="alert" for screen reader announcement
- Background stays at current state — does not reset to default

---

## 8. NAMING CONVENTIONS

### CSS — kebab-case, BEM structure
```
Block     : .weather-card
Element   : .weather-card__temperature
Modifier  : .weather-card--loading
Background: .weather-clear-day (exception — not BEM, state class)
```

### JavaScript — camelCase
```
Variables : currentCity, lastRawData, conditionCode
Functions : fetchCurrentWeather, renderWeather, setBackground
            handleSearch, kelvinToCelsius, kelvinToFahrenheit
Constants : API_KEY, BASE_URL, DEFAULT_UNIT (SCREAMING_SNAKE_CASE)
```

### Files — lowercase
```
index.html, style.css, config.js, api.js, ui.js, app.js
```

### IDs — kebab-case, unique per page
```
id="search-input", id="search-button"
id="city-suggestions"
id="weather-card", id="forecast-container"
id="error-message", id="loading-state"
id="unit-celsius", id="unit-fahrenheit"
```

---

## 9. CODE STANDARDS

### HTML
- Semantic tags only — header, main, section, footer
- No inline styles — ever
- No JS logic in HTML — event listeners in app.js only
- All images have descriptive alt attributes
- All interactive elements have aria-label or aria-labelledby
- Script tags at bottom of body, in correct module order

### CSS
- All styles in style.css — no inline styles, no style tags
- No CSS frameworks — no Bootstrap, Tailwind, or any other
- Use CSS custom properties for repeated values
- Mobile-first — base styles for mobile, media queries for larger
- Animations use transform and opacity only — never width/height
- Atmospheric background effects are static CSS-only pseudo-elements
- All transitions 0.2s ease (except body background: 1.2s ease)
- Always include -webkit-backdrop-filter with backdrop-filter

### JavaScript
- ES6+ syntax throughout — const, let, arrow functions, async/await
- No var — use const by default, let only when reassignment needed
- No jQuery or any external JS libraries
- textContent for all user-supplied or API data — never innerHTML
- Every function has a JSDoc comment above it
- No console.log in production — development only, remove before push
- try/catch around every async operation
- Typed errors thrown from api.js — never generic Error()

### Comment Standards
Every function must have a comment block:
```javascript
/**
 * What this function does in one sentence.
 * @param {type} paramName - What this parameter is
 * @returns {type} What this returns
 */
```

Every complex logic block gets an inline comment above it.
No magic numbers — use named constants from config.js.

---

## 10. RESPONSIVE RULES

- Mobile first — base styles target 375px
- Breakpoints:
  - 768px  → tablet
  - 1024px → desktop
- Never allow horizontal scrolling
- City suggestions open in-flow below the input and push content down
- City suggestions never overlap the search button, unit toggle, or weather card
- Forecast cards scroll horizontally on mobile (touch swipe)
- Forecast cards display in a row on desktop
- Main weather card is full width on mobile
- Content max-width 900px, centered on desktop
- Glass card padding: 32px desktop, 24px mobile
- Temperature font size uses clamp() for fluid scaling
- Touch targets minimum 44px height for all buttons

---

## 11. ACCESSIBILITY STANDARDS

- One h1 per page only
- Logical heading hierarchy: h1 → h2 → h3
- All images have descriptive alt text
- Error messages use role="alert"
- Search input has aria-label="Search for a city"
- Search input uses aria-autocomplete, aria-controls, and aria-expanded when suggestions exist
- Suggestions container is associated with the search input
- Suggestion items are keyboard-focusable
- Escape closes suggestions when implemented
- Unit toggle buttons have aria-pressed="true/false"
- Full keyboard navigation — Enter fires search from input
- Focus states visible — never outline: none without replacement
- Background transitions do not affect text readability
- Snowy background: apply and verify dark text contrast meets WCAG AA

---

## 12. SECURITY RULES

- API key stored in config.js — never hardcoded elsewhere
- config.js added to .gitignore for local development
- Use Vercel environment variables for deployed API key
- All user input trimmed before use
- textContent used everywhere — never innerHTML on external data
- External links use rel="noopener noreferrer"

---

## 13. GIT WORKFLOW

### Branch Strategy
```
main     → production — clean, deployed code only
dev      → active development
feature/ → individual features branched from dev
```

### Commit Convention
```
feat: short description     ← new feature added
fix: short description      ← bug fixed
style: short description    ← CSS/visual only
refactor: short description ← code restructured, no behavior change
docs: short description     ← README or comments updated
```

### Rules
- Never commit directly to main
- One feature per commit — keep commits atomic
- No console.log in any committed code
- Run skill-review before every commit to dev

---

## 14. SKILL FILES DIRECTORY

```
skills/setup/SKILL.md       → Day 1: folder, HTML, CSS reset, fonts
skills/api/SKILL.md         → API layer: config.js + api.js
skills/atmosphere/SKILL.md  → Immersive CSS-only sky atmosphere effects
skills/autocomplete/SKILL.md → City search suggestions via Geocoding API
skills/background/SKILL.md  → Sky gradient system + condition mapping
skills/ui/SKILL.md          → Render functions in ui.js
skills/app/SKILL.md         → Orchestrator: app.js, state, events
skills/review/SKILL.md      → QA gate — run after every session
skills/responsive/SKILL.md  → Full mobile pass after all features done
skills/performance/SKILL.md → Pre-deployment cleanup
skills/vercel-deploy/SKILL.md → Vercel build-time config generation
```

### Skill Usage Rule
Always feed AGENTS.md first, then the relevant skill.
Never feed two build skills in the same session.
Review skill can be combined with any build skill.

Correct:
AGENTS.md + skills/api/SKILL.md → build API layer

Wrong:
AGENTS.md + skills/api/SKILL.md + skills/ui/SKILL.md → too much

---

## 15. BUILD PROMPTS

Copy these prompts exactly when starting each session.
Always attach AGENTS.md and the named skill file.

---

### PROMPT: build-setup
```
Read AGENTS.md and skills/setup/SKILL.md completely.
Build the project setup exactly as specified.
Create all files and folders as defined.
Comment every section of every file.
Do not add any features — setup only.
After building, perform a self-review using skills/review/SKILL.md.
Report what was created and flag any issues.
```

### PROMPT: build-api
```
Read AGENTS.md and skills/api/SKILL.md completely.
The project setup already exists — do not recreate it.
Build config.js and api.js exactly as specified.
Fetch in standard (Kelvin) units only.
Handle all HTTP error codes with typed errors.
Comment every function with JSDoc format.
After building, perform a self-review using skills/review/SKILL.md.
Report what was built and flag any issues.
```

### PROMPT: build-background
```
Read AGENTS.md and skills/background/SKILL.md completely.
The API layer already exists — do not modify api.js.
Build the dynamic background system exactly as specified.
Add all 8 gradient classes to style.css.
Write setBackground() in ui.js.
Test your own condition code mapping logic.
Comment every section.
After building, perform a self-review using skills/review/SKILL.md.
Report what was built and flag any issues.
```

### PROMPT: build-atmosphere
```
Read AGENTS.md and skills/atmosphere/SKILL.md completely.
Update style.css only.
Replace all 8 background gradient classes with the upgraded 180deg versions.
Add CSS-only atmospheric pseudo-element effects exactly as specified.
Add the snowy contrast override.
Add the z-index stacking rule for content above atmospheric effects.
Do not touch HTML or JavaScript files.
Do not change unrelated CSS rules, typography, spacing, or base glass-card styles.
After building, perform a self-review using skills/review/SKILL.md.
Report every change made and flag any issues.
```

### PROMPT: build-ui
```
Read AGENTS.md and skills/ui/SKILL.md completely.
The background system already exists in ui.js — preserve it.
Build all render functions exactly as specified.
Use textContent — never innerHTML for external data.
Store and convert temperatures from Kelvin only.
Comment every function with JSDoc format.
After building, perform a self-review using skills/review/SKILL.md.
Report what was built and flag any issues.
```

### PROMPT: build-app
```
Read AGENTS.md and skills/app/SKILL.md completely.
All modules exist — do not modify api.js, ui.js, or config.js.
Wire everything together in app.js exactly as specified.
Use Promise.all for parallel API calls — never sequential.
Manage state in the state object only.
Comment every function and every event listener.
After building, perform a self-review using skills/review/SKILL.md.
Report what was built and flag any issues.
```

### PROMPT: build-autocomplete
```
Read AGENTS.md and skills/autocomplete/SKILL.md completely.
The core app already exists — preserve existing search behavior.
Add city suggestions using the OpenWeatherMap Geocoding API.
Suggestions must open in-flow below the input and push content down.
Do not allow suggestions to overlap the search button, unit toggle, or weather card.
Use textContent — never innerHTML for external data.
Preserve Promise.all for weather + forecast calls.
After building, perform a self-review using skills/review/SKILL.md.
Report what was built and flag any issues.
```

### PROMPT: run-responsive
```
Read AGENTS.md and skills/responsive/SKILL.md completely.
All features are complete — do not add new functionality.
Audit and fix the full project for responsive behavior.
Test every breakpoint: 375px, 768px, 1024px, 1440px.
Fix all issues found.
After fixing, perform a self-review using skills/review/SKILL.md.
Report every change made.
```

### PROMPT: run-performance
```
Read AGENTS.md and skills/performance/SKILL.md completely.
This is the final pass before deployment.
Clean up all unused code, remove all console.logs,
verify all optimizations listed in the skill.
Do not change any functionality — cleanup only.
Report every change made.
```

### PROMPT: deploy-vercel
```
Read AGENTS.md and skills/vercel-deploy/SKILL.md completely.
Configure Vercel deployment using build-time generation of js/config.js.
Do not commit js/config.js or any real API key.
Use OPENWEATHER_API_KEY as the Vercel environment variable name.
Create the minimal package.json, vercel.json, and generation script needed.
Verify the build script with a dummy key.
After setup, perform a self-review using skills/review/SKILL.md.
Report what was built and the exact Vercel environment variable to set.
```

---

## 16. RULES OF THE ROAD

- Read AGENTS.md before writing any code — every session
- Never modify a module outside its assigned skill scope
- Never add CSS frameworks, JS libraries, or external dependencies
- Never add images, libraries, JavaScript, or animations for atmospheric sky effects
- Never use innerHTML for user-supplied or API-sourced data
- Never store converted temperatures — Kelvin is the source of truth
- Never make sequential API calls — always Promise.all
- Never make autocomplete suggestions an absolute overlay unless explicitly requested
- Never allow suggestions to overlap or be covered by weather cards or controls
- Never commit js/config.js or a real OpenWeatherMap API key
- Never commit with console.log statements
- Never skip the review skill before committing
- Never work on two modules in the same session
- Always comment every function before ending a session
- Always push to GitHub after each session — incremental safety net
- If something feels wrong — stop and consult PLAN.md
