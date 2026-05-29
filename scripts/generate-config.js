const fs = require("fs");
const path = require("path");

const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  process.stderr.write("Missing OPENWEATHER_API_KEY environment variable.\n");
  process.exit(1);
}

const configPath = path.join(__dirname, "..", "js", "config.js");
const configContent = `/* API configuration */
const API_KEY = ${JSON.stringify(apiKey)};
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const GEOCODING_BASE_URL = "https://api.openweathermap.org/geo/1.0/";
const DEFAULT_UNIT = "C";

/* Storage keys */
const LAST_CITY_STORAGE_KEY = "weather_last_city";

/* Weather API constants */
const STANDARD_UNITS = "standard";
const FORECAST_NOON_TIME = "12:00:00";
const CURRENT_WEATHER_ENDPOINT = "weather";
const FORECAST_ENDPOINT = "forecast";
const DIRECT_GEOCODING_ENDPOINT = "direct";
const SUGGESTION_LIMIT = 5;
const SUGGESTION_DEBOUNCE_DELAY = 300;
const MIN_SUGGESTION_QUERY_LENGTH = 2;

/* API error constants */
const API_ERROR_TYPES = {
  INVALID_KEY: "INVALID_KEY",
  CITY_NOT_FOUND: "CITY_NOT_FOUND",
  RATE_LIMIT: "RATE_LIMIT",
  SERVER_ERROR: "SERVER_ERROR",
  CONNECTION_FAILED: "CONNECTION_FAILED",
  UNEXPECTED: "UNEXPECTED"
};

const API_ERROR_MESSAGES = {
  INVALID_KEY: "Service unavailable. Please try again later.",
  CITY_NOT_FOUND: "City not found. Please check the spelling.",
  RATE_LIMIT: "Too many requests. Please wait a moment.",
  SERVER_ERROR: "Something went wrong. Please try again.",
  CONNECTION_FAILED: "Connection failed. Check your internet.",
  UNEXPECTED: "An unexpected error occurred. Try again."
};

/* Temperature constants */
const KELVIN_OFFSET = 273.15;
const FAHRENHEIT_MULTIPLIER = 9 / 5;
const FAHRENHEIT_OFFSET = 32;

/* Background class constants */
const WEATHER_BACKGROUND_CLASSES = [
  "weather-clear-day",
  "weather-clear-night",
  "weather-cloudy",
  "weather-rainy",
  "weather-stormy",
  "weather-snowy",
  "weather-foggy",
  "weather-default"
];
`;

fs.mkdirSync(path.dirname(configPath), { recursive: true });
fs.writeFileSync(configPath, configContent);
process.stdout.write("Generated js/config.js from OPENWEATHER_API_KEY.\n");
