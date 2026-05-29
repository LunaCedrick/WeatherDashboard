# Weather Dashboard

A weather-reactive dashboard that turns live OpenWeatherMap data into an immersive sky interface. Search for a city, see current conditions and a 5-day forecast, and watch the page background shift to match the weather.

## Features

- Live current weather by city
- 5-day forecast using noon forecast entries
- City autocomplete with OpenWeatherMap Geocoding
- Dynamic weather backgrounds for clear, cloudy, rainy, stormy, snowy, foggy, night, and default states
- CSS-only atmospheric effects such as sun glow, moon glow, stars, rain streaks, fog, and snow shimmer
- Celsius/Fahrenheit toggle without another API request
- Last searched city saved with `localStorage`
- Human-readable error states
- Responsive frosted-glass UI

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- OpenWeatherMap API
- Google Fonts: Poppins and Inter
- Vercel

## Local Setup

1. Create `js/config.js` from `js/config.example.js`.
2. Add your OpenWeatherMap API key to `API_KEY`.
3. Open `index.html` in a browser.

`js/config.js`, `.env`, and `.env.local` are ignored by Git so local secrets are not committed.

## Vercel Deployment

This project generates `js/config.js` at build time on Vercel.

Set this environment variable in Vercel:

```text
OPENWEATHER_API_KEY=your_openweathermap_api_key
```

Then deploy normally from GitHub. Vercel runs:

```bash
npm run build
```

The build script creates `js/config.js` from `OPENWEATHER_API_KEY`, allowing the deployed static site to load the same script order used locally.

## Security Note

The API key is not committed to GitHub, but this static deployment still exposes the generated key to browser users because the client calls OpenWeatherMap directly. For a fully private key, use a server-side proxy such as Vercel Functions.
