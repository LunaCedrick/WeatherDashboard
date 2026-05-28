# WEATHER DASHBOARD — PROJECT PLAN
## Planned By: Claude (Senior Engineer Perspective)
## Skill Applied: skill-project-startup.md
## Developer: Cedrick Masalunga Luna
## Status: Pre-Development — Architecture Phase

---

## QUICK REFERENCE

Project Name   : Weather Dashboard
Type           : Frontend Web Application + External API
Stack          : HTML, CSS, Vanilla JavaScript, OpenWeatherMap API
Deployment     : Vercel (recommended) or GitHub Pages
Estimated Time : 2–3 weeks at consistent daily sessions
Portfolio      : Yes — live deployed, linked on portfolio site

---

## 1. PROBLEM STATEMENT

### The Real Problem
People need fast, reliable, and clean weather information.
Most existing weather apps are:
- Cluttered with ads and bloated features
- Designed for mobile only — poor desktop experience
- Generic in design — forgettable user experience
- Over-complicated for a simple need: "What is the weather right now?"

### Why This System Needs To Exist
From a portfolio perspective — almost no fresh graduate can
demonstrate real API integration with clean error handling,
loading states, and a polished UI. This project fills that gap.

From a user perspective — a fast, immersive, weather-reactive
app that works instantly and looks premium does not exist at
the level a motivated developer would build for their portfolio.

### What Happens Without It
Without this project:
- Cedrick's portfolio has no API integration demonstration
- Interviews on async/await and fetch() cannot be answered
  with real project experience
- The portfolio lacks a second live, functional project

### Gaps In Current Solutions
- No personal weather tool with a dynamic, weather-reactive background
- No project in Cedrick's portfolio that fetches and renders
  real-time external data
- No demonstrated understanding of API data flow in his stack
- Most portfolio weather apps look the same — this one will not

---

## 2. PROJECT VISION

A living, breathing weather dashboard.
The app literally feels like the weather it is showing.
Dynamic sky gradients shift with every search — warm gold
for sunshine, deep navy for night, stormy dark teal for
thunderstorms. Frosted glass cards float on top of the
sky — clean, modern, premium.

Identity:
- Weather-native — the design IS the weather, not just about it
- Immersive — background responds to real API data dynamically
- Premium — frosted glass aesthetic, smooth transitions
- Fast — results appear quickly, no loading friction
- Honest — errors handled clearly, never broken silently
- Distinct — completely separate visual identity from portfolio

This project should feel like a real product, not a tutorial clone.
Anyone who opens it should feel the weather before reading a number.
The visual experience is the first data point.

---

## 3. OBJECTIVES & GOALS

### Core Goals (MVP — must achieve these)
- Fetch and display real-time weather data from an external API
- Allow users to search any city in the world by name
- Display current weather conditions clearly and accurately
- Display a 5-day weather forecast
- Handle all errors gracefully — no silent failures ever
- Be fully responsive — works on mobile and desktop
- Be deployed and accessible via a public live URL

### Secondary Goals (polish — achieve after core)
- Toggle between Celsius and Fahrenheit without re-fetching
- Show loading states during API calls — no blank screens
- Persist last searched city using localStorage
- Animate weather card transitions for polish

### Future Goals (after MVP is deployed)
- Auto-detect user location via Geolocation API
- Save and compare multiple cities simultaneously
- Add air quality index data
- Convert to a Progressive Web App (PWA) for offline support

### Success Indicators
- Live URL works and loads in under 3 seconds
- Searching any major city returns correct weather data
- Invalid city name shows a clear, friendly error message
- API failure shows a fallback error, not a broken page
- Page looks correct on 375px mobile and 1440px desktop
- Recruiter can open it and understand it in under 10 seconds

---

## 4. TARGET USERS

### Primary Users
General public — anyone who wants to check weather quickly.
Technically non-demanding. They just want accurate weather fast.
They will not tolerate broken states or confusing UI.

### Secondary Users
Recruiters and developers viewing Cedrick's portfolio.
They are technically literate. They will:
- Check if the API actually returns real data
- Test error handling by typing a fake city name
- View the source code on GitHub
- Judge the code quality, not just the visual

### Developer (Cedrick himself)
The most important user during development.
Must understand every line of code that goes into this project.
Cannot ship code he cannot explain in an interview.

---

## 5. SCOPE DEFINITION

### What The System WILL Do
- Accept a city name as text input
- Call OpenWeatherMap API for current weather data
- Call OpenWeatherMap API for 5-day forecast data
- Display: temperature, humidity, wind speed, weather condition,
  weather description, and weather icon
- Display a 5-day forecast with daily high/low temperatures
- Toggle temperature units between Celsius and Fahrenheit
- Show loading state while API calls are in progress
- Show friendly error messages for invalid cities
- Show friendly error messages if API fails
- Remember the last searched city via localStorage
- Be fully responsive across all screen sizes

### What The System WILL NOT Do (MVP boundaries)
- No user accounts or authentication
- No saving of multiple cities (single search only in MVP)
- No weather maps or radar
- No hourly breakdown (daily forecast only)
- No push notifications
- No backend — this is a frontend-only project
- No paid API tier features

### Feature Priority
MUST HAVE  : Search, current weather, 5-day forecast,
             error handling, loading states, responsive design
SHOULD HAVE: Celsius/Fahrenheit toggle, localStorage persistence,
             smooth animations
NICE TO HAVE: Geolocation, multiple cities, weather maps

---

## 6. FEATURE PLANNING

---

### FEATURE 1 — City Search

Purpose:
Entry point for all weather data. User types a city name
and the system fetches and displays weather for that city.

Input:
Text input field — city name (string)

Output:
Triggers API fetch → renders weather data on success
Renders error message on failure

Workflow:
User types city name
→ Presses Enter or clicks Search button
→ Input is validated (not empty, not just spaces)
→ Loading state activates
→ API call fires
→ On success: render weather data, store city in localStorage
→ On failure: render specific error message, clear loading state

Edge Cases To Handle:
- Empty input → do not fire API, show "Please enter a city name"
- Input with only spaces → trim and treat as empty
- City not found (API 404) → show "City not found. Check spelling."
- API down or network error → show "Unable to connect. Try again."
- City name with special characters → pass directly, API handles it
- Long city names → input must not overflow its container

Dependencies:
- API module must be initialized first
- Input must be accessible via keyboard (Enter key triggers search)

---

### FEATURE 2 — Current Weather Display

Purpose:
Show the most important weather information for the searched city.
This is the centerpiece of the dashboard.

Input:
API response object from OpenWeatherMap Current Weather endpoint

Output:
Rendered weather card showing:
- City name and country code
- Current date and local time
- Weather condition icon (from OpenWeatherMap icon CDN)
- Weather description (e.g. "Partly Cloudy")
- Temperature (current, feels like)
- Humidity percentage
- Wind speed
- Visibility

Workflow:
API returns weather object
→ UI module extracts relevant fields
→ Icon URL is constructed from icon code
→ Temperature is converted to selected unit
→ All values rendered into weather card DOM elements

Edge Cases:
- Missing fields in API response → show "N/A" not undefined
- Icon fails to load → show fallback emoji or text
- Extreme temperatures → display must not break layout

---

### FEATURE 3 — 5-Day Forecast Display

Purpose:
Show upcoming weather to give context beyond just today.

Input:
API response from OpenWeatherMap Forecast endpoint
(Returns 40 data points — one every 3 hours for 5 days)

Output:
5 forecast cards showing:
- Day of the week
- Weather icon
- High temperature
- Low temperature
- Weather condition

Data Processing Note — IMPORTANT:
The forecast API returns data every 3 hours, not once per day.
To get one result per day, filter the response to take only
the data point closest to noon (12:00) for each date.
This must be handled in the API or UI module — not left raw.

Workflow:
API returns 40 forecast objects
→ Filter by unique dates, select the noon data point per day
→ Extract day name, icon, high, low, condition
→ Render 5 forecast cards in a row

---

### FEATURE 4 — Celsius / Fahrenheit Toggle

Purpose:
Allow users to switch temperature units without re-fetching data.
This is a UI-only operation — no new API call needed.

Input:
Toggle button click event

Output:
All temperature values on screen update instantly

Implementation:
Store raw Kelvin temperature from API response in memory.
Convert to Celsius or Fahrenheit on render based on active unit.
Never store converted values — always convert from Kelvin source.

Formula:
Celsius    = Kelvin - 273.15
Fahrenheit = (Kelvin - 273.15) × 9/5 + 32

State:
currentUnit = 'C' or 'F'
Toggle flips the state and re-renders temperature values only.

---

### FEATURE 5 — Loading States

Purpose:
Prevent blank screens during API calls. Users must always
know the system is working, not broken or frozen.

Input:
Triggered on every API call start and end

Output:
Visual loading indicator replaces weather card during fetch
Loading indicator disappears when data renders or error shows

Implementation:
Simple CSS animation — pulsing skeleton or spinner.
Must be in the same location as the weather card so layout
does not shift when data appears.

---

### FEATURE 6 — Error Handling

Purpose:
Every possible failure must be caught and communicated clearly.
Silent failures destroy user trust instantly.

Error Types And Messages:

| Scenario                  | Message To User                          |
|---------------------------|------------------------------------------|
| Empty input               | "Please enter a city name."             |
| City not found (404)      | "City not found. Please check spelling."|
| Network failure           | "Connection failed. Check your internet."|
| API key invalid (401)     | "Service unavailable. Try again later." |
| Rate limit exceeded (429) | "Too many requests. Please wait."       |
| Unknown server error      | "Something went wrong. Try again."      |

All error messages must:
- Be human-readable — no raw error codes shown to users
- Appear in the same location as weather data
- Not break the layout
- Be dismissible or replaced by next successful search

---

### FEATURE 7 — localStorage Persistence

Purpose:
Remember the last city the user searched.
When they return to the app, auto-load that city's weather.

Input:
Successful search result

Output:
City name saved to localStorage key: "weather_last_city"

On Page Load Workflow:
Check localStorage for "weather_last_city"
→ If exists: auto-trigger search for that city
→ If not: show default empty state or placeholder

---

## 7. SYSTEM ARCHITECTURE

### Architecture Type
Single Page Application (SPA) — no routing, no page reloads.
Frontend only — no server, no backend, no database.
Data flows in one direction: User → App → API → Render.

### Data Flow Diagram

```
USER INPUT (city name)
        │
        ▼
  INPUT VALIDATION
  (empty check, trim)
        │
        ▼
   LOADING STATE ON
        │
        ▼
  API MODULE (api.js)
  ┌─────────────────────────────────┐
  │  fetchCurrentWeather(city)      │──── OpenWeatherMap API ────┐
  │  fetchForecast(city)            │──── OpenWeatherMap API ──┐ │
  └─────────────────────────────────┘                         │ │
        │                                                     │ │
        ▼                                                     │ │
  PROMISE RESOLUTION                  ◄────────────────────── ┘ │
  (both API calls run in parallel     ◄──────────────────────────┘
   using Promise.all)
        │
        ├── SUCCESS → UI MODULE (ui.js) → renderWeather()
        │                               → renderForecast()
        │                               → updateUnit()
        │
        └── FAILURE → UI MODULE (ui.js) → renderError()

  STATE MODULE (app.js)
  Holds: currentCity, currentUnit, lastRawData
```

### Module Structure

```
weather-dashboard/
├── index.html          # Single page — semantic HTML structure
├── style.css           # All styles — no frameworks
├── js/
│   ├── config.js       # API key, base URL, constants
│   ├── api.js          # All fetch calls — no UI logic here
│   ├── ui.js           # All DOM manipulation — no API logic here
│   └── app.js          # Entry point — event listeners, state,
│                       # wires api.js and ui.js together
├── assets/
│   └── images/         # Any local icons or fallback images
└── README.md           # Project documentation
```

### Module Responsibilities — Strict Separation

config.js:
- API key constant
- Base API URL constant
- Default unit constant
- Nothing else

api.js:
- fetchCurrentWeather(city) → returns raw API data or throws error
- fetchForecast(city) → returns raw API data or throws error
- No DOM access, no UI rendering, no state
- Handles HTTP error codes and throws typed errors

ui.js:
- renderWeather(data, unit) → populates weather card
- renderForecast(data, unit) → populates forecast cards
- renderLoading() → shows loading state
- renderError(message) → shows error message
- clearUI() → resets display
- No fetch calls, no business logic

app.js:
- Imports and connects api.js and ui.js
- Manages application state (currentUnit, currentCity)
- Handles all event listeners (search, toggle, Enter key)
- Calls localStorage get/set
- Orchestrates the full search flow

### API Endpoints Used

Current Weather:
```
GET https://api.openweathermap.org/data/2.5/weather
    ?q={cityName}
    &appid={API_KEY}
    &units=standard
```

5-Day Forecast:
```
GET https://api.openweathermap.org/data/2.5/forecast
    ?q={cityName}
    &appid={API_KEY}
    &units=standard
```

Note: Always fetch in standard (Kelvin) units.
Convert to Celsius or Fahrenheit in ui.js based on current state.
This means one fetch works for both units — no double API calls.

Weather Icons:
```
https://openweathermap.org/img/wn/{iconCode}@2x.png
```

---

## 8. TECH STACK DECISION

| Layer        | Technology           | Reason                                      |
|--------------|----------------------|---------------------------------------------|
| Frontend     | HTML5, CSS3, Vanilla JS | Matches portfolio stack, no framework needed |
| API          | OpenWeatherMap Free  | Free tier, well documented, reliable        |
| Icons        | OpenWeatherMap CDN   | Built-in weather icons, no extra library    |
| Fonts        | Google Fonts         | Poppins (temps/headlines) + Inter (body)    |
| Deployment   | Vercel               | Free, fast, environment variable support    |
| Version Ctrl | GitHub               | Already set up, public repo for portfolio   |
| Editor       | VS Code + Codex      | Existing workflow                           |

### Why Vercel Over GitHub Pages
GitHub Pages serves static files only and has no environment
variable support. Cedrick's API key will be exposed in JS
regardless for this MVP, but Vercel is better practice to learn
now for future projects that will need environment variables.

### Why No Framework (React, Vue)
React comes in Project 5 (IoT Dashboard Rebuild).
This project must demonstrate pure JavaScript competence.
Interviewers test vanilla JS fundamentals — async/await, fetch,
DOM manipulation, error handling — this project is that proof.

### Why OpenWeatherMap
- Free tier: 60 calls/minute, 1M calls/month — more than enough
- Returns all needed data in one call
- Industry standard API — many developers know it
- Excellent documentation at openweathermap.org/api
- No credit card required for free tier

---

## 9. DATABASE PLANNING

This project has NO database.

Weather data is ephemeral — it changes every few minutes.
Storing it serves no purpose for this use case.

The only persistent storage used is localStorage — a browser-side
key/value store. It holds only one value: the last searched city name.

localStorage Schema:
```
Key   : "weather_last_city"
Value : "Manila"  (string — city name only)
```

No server-side storage. No accounts. No user data collected.

---

## 10. UI/UX PLANNING

### Design Direction
Dynamic Sky Background + Frosted Glass Cards.
Each project has its own design identity — this is NOT
the dark tech aesthetic of the portfolio. This design
is weather-native: the app visually IS the weather.

---

### Design System

#### Background States
CSS classes swapped by JavaScript based on the weather
condition code and time of day from the API response.
All backgrounds are linear-gradient, full viewport height.
Background transitions smoothly: transition: background 1.2s ease

```
.weather-clear-day    → linear-gradient(135deg, #f7b733, #fc4a1a)
                        Warm gold to orange — sunny day

.weather-clear-night  → linear-gradient(135deg, #0f0c29, #302b63)
                        Deep navy to purple — clear night

.weather-cloudy       → linear-gradient(135deg, #757F9A, #D7DDE8)
                        Steel grey to silver — overcast

.weather-rainy        → linear-gradient(135deg, #1a1a2e, #16213e)
                        Dark blue-grey — rain and drizzle

.weather-stormy       → linear-gradient(135deg, #0f2027, #203a43)
                        Near-black teal — thunderstorm

.weather-snowy        → linear-gradient(135deg, #e0eafc, #cfdef3)
                        Pale blue-white — snow

.weather-foggy        → linear-gradient(135deg, #606c88, #3f4c6b)
                        Muted grey-blue — fog, mist, haze

.weather-default      → linear-gradient(135deg, #2980B9, #6DD5FA)
                        Clean sky blue — fallback/loading state
```

#### Weather Condition → Background Mapping
OpenWeatherMap returns a condition code (integer) in the API
response. Time of day comes from sys.sunrise and sys.sunset
fields — already in the response, no extra API call needed.

```
Code 800           → clear sky
  If current time between sunrise and sunset → weather-clear-day
  If current time outside sunrise/sunset    → weather-clear-night

Code 801, 802      → few/scattered clouds
  Day              → weather-cloudy (light)
  Night            → weather-clear-night

Code 803, 804      → broken/overcast clouds
                   → weather-cloudy

Code 300–321       → drizzle
Code 500–531       → rain
                   → weather-rainy

Code 200–232       → thunderstorm
                   → weather-stormy

Code 600–622       → snow
                   → weather-snowy

Code 701–781       → atmosphere (fog, mist, haze, smoke)
                   → weather-foggy
```

#### Frosted Glass Cards
All cards use this exact CSS treatment — the core visual effect:

```css
background    : rgba(255, 255, 255, 0.15)
backdrop-filter: blur(20px)
-webkit-backdrop-filter: blur(20px)   /* Safari support */
border        : 1px solid rgba(255, 255, 255, 0.25)
box-shadow    : 0 8px 32px rgba(0, 0, 0, 0.15)
border-radius : 20px
```

Note: backdrop-filter requires the element to have a
background with some transparency — rgba, not #ffffff.
Always include -webkit-backdrop-filter for Safari.

#### Typography
```
Temperature numbers : Poppins Black, weight 900
                      Large, bold, the hero of the UI
Headlines & labels  : Poppins SemiBold, weight 600
Body & descriptions : Inter Regular, weight 400
Google Fonts import : Poppins (900, 600) + Inter (400)

Text primary        : #ffffff
Text muted          : rgba(255, 255, 255, 0.7)
Text very muted     : rgba(255, 255, 255, 0.5)
```

White text works across all background states because
every gradient is medium-to-dark enough for contrast.
On the snowy background (lightest), check contrast carefully.

#### Search Input — Glass Style
```css
background    : rgba(255, 255, 255, 0.2)
border        : 1px solid rgba(255, 255, 255, 0.4)
border-radius : 12px
color         : #ffffff
placeholder   : rgba(255, 255, 255, 0.6)
/* On focus: */
border-color  : rgba(255, 255, 255, 0.8)
outline       : none
```

#### Buttons
```css
/* Search button */
background    : rgba(255, 255, 255, 0.25)
border        : 1px solid rgba(255, 255, 255, 0.4)
border-radius : 12px
color         : #ffffff
transition    : background 0.2s ease

/* Search button hover */
background    : rgba(255, 255, 255, 0.35)

/* Unit toggle — active state */
background    : rgba(255, 255, 255, 0.35)
border        : 1px solid rgba(255, 255, 255, 0.5)
color         : #ffffff

/* Unit toggle — inactive state */
background    : rgba(255, 255, 255, 0.1)
border        : 1px solid rgba(255, 255, 255, 0.2)
color         : rgba(255, 255, 255, 0.5)
```

#### Spacing & Shape
```
Card border-radius : 20px
Button/input radius: 12px
Card padding       : 32px desktop, 24px mobile
Gap between cards  : 20px
Max content width  : 900px centered
```

---

### Layout — Desktop
```
┌────────────────────────────────────────────────────┐
│           DYNAMIC SKY GRADIENT BACKGROUND          │
│                                                    │
│  [🔍 Search city...          ] [Search] [°C][°F]  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ ░░░░░░ FROSTED GLASS — MAIN WEATHER CARD ░░░ │  │
│  │                                              │  │
│  │  Manila, PH                Thursday May 2026 │  │
│  │                                              │  │
│  │      ⛅              32°C                    │  │
│  │   (big icon)        Partly Cloudy            │  │
│  │                     Feels like 36°C          │  │
│  │                                              │  │
│  │  💧 78%      💨 12km/h      👁 10km          │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐ │
│  │░glass│  │░glass│  │░glass│  │░glass│  │░glass│ │
│  │ Mon  │  │ Tue  │  │ Wed  │  │ Thu  │  │ Fri  │ │
│  │  ⛅  │  │  🌧  │  │  ☀️  │  │  ⛅  │  │  ☀️  │ │
│  │31°24°│  │28°21°│  │34°26°│  │30°23°│  │33°25°│ │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Layout — Mobile (375px)
```
┌──────────────────────┐
│   SKY GRADIENT BG    │
│                      │
│ [🔍 Search...][Srch] │
│       [°C]  [°F]     │
│                      │
│ ┌──────────────────┐ │
│ │   MAIN CARD      │ │
│ │   Manila, PH     │ │
│ │                  │ │
│ │       ⛅          │ │
│ │      32°C        │ │
│ │  Partly Cloudy   │ │
│ │  Feels like 36°C │ │
│ │  💧   💨   👁    │ │
│ └──────────────────┘ │
│                      │
│  ← swipe forecast →  │
│ ┌─────┐┌─────┐       │
│ │glass││glass│ ...   │
│ │ Mon ││ Tue │       │
│ └─────┘└─────┘       │
└──────────────────────┘
```

### User Flow
```
Page loads
→ Body gets .weather-default class (sky blue gradient)
→ Check localStorage for last city
→ If found: auto-search that city → show weather
→ If not: show empty state with search prompt on sky bg

User searches city
→ Loading state shows (glass card with spinner)
→ Promise.all fires both API calls
→ API returns condition code + sunrise/sunset timestamps
→ JavaScript determines correct background class
→ Body class updates → background transitions over 1.2s
→ Weather card populates and fades in
→ Forecast cards populate and fade in
→ City saved to localStorage

User toggles °C / °F
→ Temperatures recalculate from stored Kelvin values
→ UI updates instantly
→ No API call — no background change

User types invalid city
→ Error message appears inside glass card
→ Background stays as current weather state
→ Error is human-readable, friendly

User searches different city in different weather
→ New data loads
→ Background transitions to new weather state smoothly
→ The wow moment — the sky visually changes
```

### Loading State Design
While API call is in progress:
- Main weather card shows frosted glass with animated
  pulsing dots or subtle shimmer effect
- Background is already at .weather-default (sky blue)
- No blank screen — user always sees the sky gradient

### Error State Design
When API returns an error:
- Error message appears inside the main glass card
- Icon: ⚠️ or cloud with X
- Message: human-readable (see Feature 6 error table)
- Background stays at current state — no jarring reset

### Accessibility
- Search input has aria-label="Search for a city"
- Search button has aria-label="Get weather"
- Weather icons have alt text: f"{description} weather icon"
- Unit toggle has aria-pressed="true/false"
- Error messages use role="alert" for screen readers
- Background changes do not affect readability (white text)
- Full keyboard navigation — Enter triggers search
- Snowy background: verify white text contrast passes WCAG AA

---

## 11. SECURITY PLANNING

### API Key Exposure — The Main Risk
This is a frontend-only project. The API key lives in config.js
and will be visible to anyone who opens browser DevTools.

This is a known and accepted limitation of client-side only apps.

Mitigation for MVP:
1. Restrict the API key in OpenWeatherMap dashboard to only
   allow calls from your deployed domain (Vercel URL)
   This is done in the OpenWeatherMap API keys settings page.
2. Never commit the API key to GitHub in plain text.
   Use a .env approach or add to .gitignore.
   For Vercel deployment, use Vercel Environment Variables.

Mitigation for Future (post-MVP):
If this becomes a real product, move API calls to a serverless
function (Vercel Edge Function or Netlify Function) that proxies
requests and keeps the key server-side. The frontend never
touches the key directly.

### Input Sanitization
User input (city name) is passed directly to the API as a
query parameter. OpenWeatherMap handles URL encoding.
Never inject user input directly into innerHTML — use
textContent for all user-supplied or API-returned strings
to prevent XSS attacks.

### No Authentication Required
This app has no user accounts, no login, no personal data.
Security surface area is minimal.

---

## 12. PERFORMANCE PLANNING

### API Call Optimization
- Both API calls (current + forecast) must run in PARALLEL
  using Promise.all() — not sequentially
- Sequential calls would double wait time unnecessarily

```javascript
// WRONG — sequential, slow
const current = await fetchCurrentWeather(city);
const forecast = await fetchForecast(city);

// CORRECT — parallel, fast
const [current, forecast] = await Promise.all([
  fetchCurrentWeather(city),
  fetchForecast(city)
]);
```

### Preventing Unnecessary API Calls
- Validate input before firing API calls
- If user searches the same city twice in a row — skip the call
  and re-render from cached data in memory
- Debounce is NOT needed here since search fires on button click
  or Enter key, not on every keystroke

### Rendering Efficiency
- All DOM updates happen after all data is ready
  Never partially update the UI mid-fetch
- Weather icons are loaded from OpenWeatherMap CDN directly
  No local image storage needed for weather icons
- Background class swap is a single classList change —
  CSS handles the 1.2s transition, zero JS animation overhead
- Glass effect uses backdrop-filter — GPU-accelerated by browser

### Asset Optimization
- No heavy libraries
- No large images — weather icons are small PNGs from CDN
- CSS animations use transform and opacity only (GPU-friendly)
- Fonts loaded with display=swap to prevent render blocking

---

## 13. SCALABILITY PLANNING

### Current Scale
Single user, client-side only. No scaling concerns for MVP.
OpenWeatherMap free tier handles up to 60 requests per minute —
far beyond anything a portfolio project will generate.

### If This Becomes A Real Product
Bottleneck 1: API key exposure → solve with serverless proxy
Bottleneck 2: API rate limits → solve with server-side caching
  (cache city weather data for 10 minutes — weather doesn't
   change faster than that)
Bottleneck 3: Single API provider → solve with fallback APIs
  (WeatherAPI.com as backup if OpenWeatherMap is down)

### Feature Scalability
The module architecture (api.js, ui.js, app.js, config.js)
is designed to expand cleanly:
- New API endpoints → add to api.js only
- New UI components → add to ui.js only
- New features → wire in app.js
- No module should need to be rewritten to add a feature

---

## 14. MAINTAINABILITY

### Naming Conventions
CSS     : kebab-case (weather-card__temperature)
JS vars : camelCase (currentTemperature)
JS funcs: camelCase, verb-first (fetchWeather, renderCard)
Files   : lowercase with hyphens (weather-dashboard)
IDs     : kebab-case, unique per page

### Comment Standards
Every function must have a comment explaining:
- what it does
- what it receives (input)
- what it returns (output)

Every complex logic block must have an inline comment.
No magic numbers — use named constants in config.js.

### Code Standards
- No inline styles in HTML
- No JS logic in HTML
- No API calls in ui.js
- No DOM access in api.js
- Functions do ONE thing only
- Max function length: ~20 lines
  If longer, it should be split into smaller functions

---

## 15. GIT WORKFLOW

### Branch Strategy
```
main   → production — only clean, tested code
dev    → active development — all work happens here
feature/search      → search functionality
feature/forecast    → forecast display
feature/unit-toggle → Celsius/Fahrenheit toggle
feature/error-ui    → error handling UI
```

### Commit Convention
Format: type: short description

Examples:
```
feat: add city search input and button
feat: integrate OpenWeatherMap current weather API
feat: render 5-day forecast cards
fix: handle empty city input validation
fix: show error message on API 404 response
style: add loading animation for API fetch state
refactor: separate API calls into api.js module
docs: update README with setup instructions
```

### Merge Strategy
Finish feature on feature branch
→ Test manually
→ Merge to dev
→ Test full flow on dev
→ Merge to main when milestone is complete
→ Deploy from main

---

## 16. DEVELOPMENT PHASES

### Phase 1 — Project Setup (Day 1)
- Create GitHub repo: weather-dashboard
- Set up folder structure
- Create empty HTML, CSS, js/config.js, js/api.js,
  js/ui.js, js/app.js
- Register at openweathermap.org — get free API key
- Confirm API key works via browser test URL
- Initial commit and push

### Phase 2 — HTML Structure (Day 1–2)
- Build semantic HTML skeleton
- Search input and button
- Unit toggle buttons (°C / °F)
- Weather card structure (empty, populated by JS)
- Forecast cards structure
- Loading and error state containers
- Add weather-default class to body as starting state
- Link Google Fonts: Poppins (900, 600) + Inter (400)
- Link all JS modules and CSS

### Phase 3 — API Integration (Day 2–3)
- Write fetchCurrentWeather() in api.js
- Write fetchForecast() in api.js
- Test both in browser console — confirm raw data returns
- Handle HTTP error codes (401, 404, 429, 500)
- Implement Promise.all for parallel calls

### Phase 4 — UI Rendering (Day 3–5)
- Write renderWeather() in ui.js
- Write renderForecast() in ui.js — filter noon data points
- Write renderLoading() and renderError() in ui.js
- Write setBackground(conditionCode, sunrise, sunset) in ui.js
  This function maps condition code + time → background CSS class
- Wire everything in app.js
- Test full search flow with real city names
- Test background transitions across different weather conditions

### Phase 5 — Features & Polish (Day 5–7)
- Add Celsius/Fahrenheit toggle
- Add localStorage persistence
- Add input validation
- Add all error scenarios
- Add keyboard support (Enter key triggers search)

### Phase 6 — Responsive Design (Day 7–9)
- Mobile layout (375px)
- Tablet layout (768px)
- Desktop layout (1024px+)
- Test horizontal scroll on forecast cards mobile

### Phase 7 — Review & QA (Day 9–10)
- Run against skill-review checklist
- Run against skill-ui-consistency checklist
- Run against skill-responsive checklist
- Run against skill-accessibility checklist
- Fix all FAIL and WARN items

### Phase 8 — Deployment (Day 10)
- Set up Vercel account (free)
- Connect GitHub repo to Vercel
- Set API key as Vercel environment variable
- Deploy from main branch
- Confirm live URL works
- Add live URL to portfolio projects section
- Add live URL to GitHub repo description
- Commit final README with setup and live link

---

## 17. RISKS & MITIGATION

| Risk                          | Likelihood | Impact | Mitigation                                      |
|-------------------------------|------------|--------|-------------------------------------------------|
| API key exposed in client JS  | Certain    | Medium | Restrict key to domain in OWM dashboard         |
| City name ambiguity           | High       | Low    | API returns best match — document this behavior |
| OpenWeatherMap API downtime   | Low        | High   | Show clear error, suggest retry                 |
| Free tier rate limit hit      | Very Low   | Medium | 60 req/min — portfolio traffic won't touch this |
| Forecast data misread (3hr)   | High       | High   | Filter to noon data points explicitly in code   |
| CORS errors                   | Low        | High   | OWM supports client-side calls — not an issue   |
| API key accidentally committed | Medium    | High   | Add config.js to .gitignore for local key       |
| Knowledge gap in async/await  | Medium     | Medium | Study javascript.info async chapter first       |
| backdrop-filter Safari support| Medium     | Low    | Always include -webkit-backdrop-filter fallback |
| Snowy bg text contrast (light)| Medium     | Medium | Test white text on #e0eafc — darken if needed   |
| Background not transitioning  | Low        | Medium | Ensure transition is on body, not the class     |

---

## 18. FUTURE IMPROVEMENTS

### Short Term (after MVP)
- Geolocation: auto-detect user city on page load with permission
- Hourly forecast: show next 24 hours in detail
- Search history: dropdown of recently searched cities

### Medium Term
- Multiple cities: save and monitor several cities simultaneously
- Weather alerts: show severe weather warnings if API provides them
- Hourly breakdown: show next 12 hours in a horizontal scroll row
- Sunrise/sunset visual: show sun arc on the weather card

### Long Term
- Serverless backend proxy: hide API key properly
- PWA: install as a mobile app, offline cached last weather data
- Weather maps: integrate OpenWeatherMap tile maps
- Data visualization: temperature trend charts using Chart.js
- Multiple language support: display in Filipino and English

---

## 19. TESTING STRATEGY

### Manual Test Cases

Happy Path:
- Search "Manila" → returns correct current weather and 5-day forecast
- Search "Tokyo" → returns correct data
- Search "New York" → returns correct data
- Toggle °C to °F → temperatures convert correctly without re-fetch
- Refresh page → last city auto-loads from localStorage

Error Cases:
- Search "" (empty) → shows "Please enter a city name"
- Search "   " (spaces only) → treated as empty input
- Search "xyznotacity123" → shows "City not found"
- Disconnect internet → shows "Connection failed"
- Search valid city twice → second search re-renders correctly

Responsive:
- Test on 320px, 375px, 768px, 1024px, 1440px
- Forecast cards scroll horizontally on mobile
- No horizontal overflow at any breakpoint
- Search bar is usable on mobile keyboard

Accessibility:
- Tab through all interactive elements
- Enter key triggers search from input field
- Error messages are announced (role="alert")

---

## 20. DOCUMENTATION PLAN

README.md must include:
- Project name and one-sentence description
- Live URL (Vercel link)
- Screenshot of the app
- Features list
- Tech stack
- How to run locally (clone, add API key, open index.html)
- API used and where to get a free key
- Known limitations (API key exposure, free tier rate limits)
- Future improvements planned

---

## PRE-DEVELOPMENT CHECKLIST

Before writing any code, confirm:

- [ ] OpenWeatherMap account created
- [ ] Free API key generated and tested
- [ ] GitHub repo created: weather-dashboard
- [ ] Folder structure created locally
- [ ] All empty files created and committed
- [ ] Vercel account created and connected to GitHub
- [ ] This plan reviewed and understood by developer
- [ ] AGENTS.md created for this project
- [ ] Skill files prepared for this project

---

## ARCHITECTURE DECISION SUMMARY

Decision 1  : Vanilla JS only — proves fundamentals, no framework needed
Decision 2  : Parallel API calls with Promise.all — performance best practice
Decision 3  : Store Kelvin, convert in UI — one source of truth for temperature
Decision 4  : Filter forecast to noon data points — avoids data misreading
Decision 5  : Modules separated by concern — scalable, maintainable, interview-ready
Decision 6  : Vercel over GitHub Pages — environment variable support, better practice
Decision 7  : Domain-restricted API key — minimal security for client-side MVP
Decision 8  : textContent over innerHTML — XSS prevention on all user/API data
Decision 9  : localStorage for city persistence — no backend needed for this feature
Decision 10 : Error types mapped to human messages — never expose raw API errors to users
Decision 11 : Dynamic sky gradient backgrounds — design reacts to real weather data
Decision 12 : Frosted glass cards — premium aesthetic, works on all background states
Decision 13 : Poppins for numbers + Inter for body — weather-native, not portfolio carry-over
Decision 14 : background transition 1.2s ease — smooth weather state changes, the wow moment
Decision 15 : Condition code + sunrise/sunset for bg mapping — no extra API call needed
Decision 16 : White text on all states — readable across all gradient backgrounds
Decision 17 : Separate design identity from portfolio — each project stands on its own
