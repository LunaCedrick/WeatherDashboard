---
name: vercel-deploy
description: Configure and verify Weather Dashboard deployment to Vercel using build-time generation of js/config.js from OPENWEATHER_API_KEY. Use when publishing the static app to Vercel while keeping the local config.js file ignored by Git.
---

## Purpose

Deploy the static Weather Dashboard to Vercel without committing
`js/config.js` or the OpenWeatherMap API key to GitHub.

This skill uses build-time config generation:

- Vercel stores `OPENWEATHER_API_KEY` as an environment variable.
- A build script generates `js/config.js` during deployment.
- The browser still calls OpenWeatherMap directly.

## Scope

This deployment setup may modify only:

- `package.json`
- `vercel.json`
- `scripts/generate-config.js`
- `.gitignore`
- `README.md`
- `AGENTS.md`

Do not modify app feature files unless deployment verification proves
they cannot work with generated config:

- `index.html`
- `style.css`
- `js/api.js`
- `js/ui.js`
- `js/app.js`

## Required Files

Create `scripts/generate-config.js`.

The script must:

- Read `process.env.OPENWEATHER_API_KEY`.
- Exit with a clear error if the variable is missing.
- Generate `js/config.js`.
- Include every constant required by the current app.
- Include autocomplete constants if autocomplete exists.
- Use `JSON.stringify()` when writing the API key value.
- Never print the API key.
- Use CommonJS so it runs with plain Node.

Create or update `package.json`.

Required minimum:

```json
{
  "scripts": {
    "build": "node scripts/generate-config.js"
  }
}
```

Create or update `vercel.json`.

Required minimum:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "."
}
```

## Git Rules

- Keep `js/config.js` in `.gitignore`.
- Keep `.env` and `.env.local` in `.gitignore`.
- Commit `scripts/generate-config.js`, `package.json`, and `vercel.json`.
- Do not commit real API keys.

## Vercel Setup

In Vercel Project Settings:

- Add environment variable `OPENWEATHER_API_KEY`.
- Apply it to Production, Preview, and Development unless there is a reason not to.
- Redeploy after adding or changing environment variables.

## Local Verification

Before reporting completion:

- Temporarily run the build with a dummy key:
  `OPENWEATHER_API_KEY=test-key npm run build` on Unix-like shells, or
  `$env:OPENWEATHER_API_KEY="test-key"; npm run build` in PowerShell.
- Confirm `js/config.js` is generated.
- Confirm `js/config.js` remains ignored by Git.
- Run `node --check scripts/generate-config.js`.
- Run `node --check js/api.js`, `node --check js/ui.js`, and `node --check js/app.js`.

Do not leave a committed `js/config.js`.

## Deployment Verification

After Vercel deploys:

- Confirm the deployed page no longer 404s on `/js/config.js`.
- Search a real city and confirm current weather loads.
- Type at least two characters and confirm city suggestions load.
- Confirm weather + forecast calls still use `Promise.all` in `app.js`.
- Confirm no user-facing raw API errors appear.

## Security Note

This option keeps the API key out of GitHub, but it does not make the key
private from browser users because the generated `js/config.js` is served
to the client. Use a Vercel Function proxy later if the API key must remain
server-side.

## Review

After setup, read `.agents/skills/review/SKILL.md` and report PASS, WARN,
or FAIL.
