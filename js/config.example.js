/* For github commit only - ignore this file. */
/* API configuration */
const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const DEFAULT_UNIT = "C";

/* Storage keys */
const LAST_CITY_STORAGE_KEY = "weather_last_city";

/* Weather API constants */
const STANDARD_UNITS = "standard";
const FORECAST_NOON_TIME = "12:00:00";
const CURRENT_WEATHER_ENDPOINT = "weather";
const FORECAST_ENDPOINT = "forecast";

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
