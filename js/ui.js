/* UI layer */

/* Weather condition codes */
const CLEAR_SKY_CODE = 800;
const FEW_CLOUDS_MIN_CODE = 801;
const FEW_CLOUDS_MAX_CODE = 802;
const OVERCAST_CLOUDS_MIN_CODE = 803;
const OVERCAST_CLOUDS_MAX_CODE = 804;
const DRIZZLE_MIN_CODE = 300;
const DRIZZLE_MAX_CODE = 321;
const RAIN_MIN_CODE = 500;
const RAIN_MAX_CODE = 531;
const THUNDERSTORM_MIN_CODE = 200;
const THUNDERSTORM_MAX_CODE = 232;
const SNOW_MIN_CODE = 600;
const SNOW_MAX_CODE = 622;
const ATMOSPHERE_MIN_CODE = 701;
const ATMOSPHERE_MAX_CODE = 781;

/**
 * Checks whether a weather condition code is inside a numeric range.
 * @param {number} conditionCode - OpenWeatherMap condition code
 * @param {number} minCode - Lowest code in the range
 * @param {number} maxCode - Highest code in the range
 * @returns {boolean} Whether the code falls inside the range
 */
const isCodeInRange = (conditionCode, minCode, maxCode) => {
  return conditionCode >= minCode && conditionCode <= maxCode;
};

/**
 * Checks whether the weather timestamp is during local daylight.
 * @param {number} currentTime - Current Unix timestamp from the API
 * @param {number} sunrise - Sunrise Unix timestamp from the API
 * @param {number} sunset - Sunset Unix timestamp from the API
 * @returns {boolean} Whether the current time is daytime
 */
const isDaytime = (currentTime, sunrise, sunset) => {
  return currentTime >= sunrise && currentTime < sunset;
};

/**
 * Maps a weather condition code and daylight state to a body background class.
 * @param {number} conditionCode - OpenWeatherMap condition code
 * @param {boolean} isCurrentlyDaytime - Whether the current weather time is daytime
 * @returns {string} Matching weather background class
 */
const getBackgroundClass = (conditionCode, isCurrentlyDaytime) => {
  if (conditionCode === CLEAR_SKY_CODE) {
    return isCurrentlyDaytime ? "weather-clear-day" : "weather-clear-night";
  }

  if (isCodeInRange(conditionCode, FEW_CLOUDS_MIN_CODE, FEW_CLOUDS_MAX_CODE)) {
    return isCurrentlyDaytime ? "weather-cloudy" : "weather-clear-night";
  }

  if (isCodeInRange(conditionCode, OVERCAST_CLOUDS_MIN_CODE, OVERCAST_CLOUDS_MAX_CODE)) {
    return "weather-cloudy";
  }

  if (
    isCodeInRange(conditionCode, DRIZZLE_MIN_CODE, DRIZZLE_MAX_CODE) ||
    isCodeInRange(conditionCode, RAIN_MIN_CODE, RAIN_MAX_CODE)
  ) {
    return "weather-rainy";
  }

  if (isCodeInRange(conditionCode, THUNDERSTORM_MIN_CODE, THUNDERSTORM_MAX_CODE)) {
    return "weather-stormy";
  }

  if (isCodeInRange(conditionCode, SNOW_MIN_CODE, SNOW_MAX_CODE)) {
    return "weather-snowy";
  }

  if (isCodeInRange(conditionCode, ATMOSPHERE_MIN_CODE, ATMOSPHERE_MAX_CODE)) {
    return "weather-foggy";
  }

  return "weather-default";
};

/**
 * Updates the page background to match a weather condition and local time.
 * @param {number} conditionCode - OpenWeatherMap condition code
 * @param {number} currentTime - Current Unix timestamp from the API
 * @param {number} sunrise - Sunrise Unix timestamp from the API
 * @param {number} sunset - Sunset Unix timestamp from the API
 * @returns {void} This function does not return a value
 */
const setBackground = (conditionCode, currentTime, sunrise, sunset) => {
  const backgroundClass = getBackgroundClass(
    conditionCode,
    isDaytime(currentTime, sunrise, sunset)
  );

  document.body.classList.remove(...WEATHER_BACKGROUND_CLASSES);
  document.body.classList.add(backgroundClass);
};

/* DOM references */
const weatherCard = document.querySelector("#weather-card");
const forecastContainer = document.querySelector("#forecast-container");
const citySuggestions = document.querySelector("#city-suggestions");
const suggestionSearchInput = document.querySelector("#search-input");

/**
 * Creates an HTML element with an optional class name.
 * @param {string} tagName - HTML tag name to create
 * @param {string} className - CSS class name to apply
 * @returns {HTMLElement} Created HTML element
 */
const createElement = (tagName, className = "") => {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
};

/**
 * Formats a city suggestion name from geocoding data.
 * @param {object} suggestion - Geocoding API suggestion item
 * @returns {string} City name label
 */
const formatSuggestionCity = (suggestion) => {
  return suggestion?.name || "Unknown city";
};

/**
 * Formats a city suggestion metadata label from geocoding data.
 * @param {object} suggestion - Geocoding API suggestion item
 * @returns {string} State and country metadata label
 */
const formatSuggestionMeta = (suggestion) => {
  return [suggestion?.state, suggestion?.country].filter(Boolean).join(", ");
};

/**
 * Sets the search input expanded state for the suggestions list.
 * @param {boolean} isExpanded - Whether suggestions are currently visible
 * @returns {void} This function does not return a value
 */
const setSuggestionsExpanded = (isExpanded) => {
  suggestionSearchInput.setAttribute("aria-expanded", String(isExpanded));
};

/**
 * Creates a keyboard-focusable city suggestion button.
 * @param {object} suggestion - Geocoding API suggestion item
 * @returns {HTMLButtonElement} Suggestion button element
 */
const createSuggestionButton = (suggestion) => {
  const button = createElement("button", "suggestions__button");
  const city = createElement("span", "suggestions__city");
  const meta = createElement("span", "suggestions__meta");

  button.type = "button";
  button.setAttribute("role", "option");
  city.textContent = formatSuggestionCity(suggestion);
  meta.textContent = formatSuggestionMeta(suggestion);

  button.append(city, meta);

  return button;
};

/**
 * Clears all rendered city suggestions.
 * @returns {void} This function does not return a value
 */
const clearSuggestions = () => {
  citySuggestions.replaceChildren();
  citySuggestions.hidden = true;
  setSuggestionsExpanded(false);
};

/**
 * Renders city suggestions in the search dropdown.
 * @param {object[]} suggestions - Geocoding API suggestion results
 * @returns {void} This function does not return a value
 */
const renderSuggestions = (suggestions) => {
  citySuggestions.replaceChildren();

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    clearSuggestions();
    return;
  }

  suggestions.forEach((suggestion) => {
    citySuggestions.append(createSuggestionButton(suggestion));
  });

  citySuggestions.hidden = false;
  setSuggestionsExpanded(true);
};

/**
 * Formats missing API values with a readable fallback.
 * @param {*} value - API value to display
 * @returns {*} Original value or fallback text
 */
const formatValue = (value) => {
  return value ?? "N/A";
};

/**
 * Formats a measurement with a suffix only when the value exists.
 * @param {*} value - API value to display
 * @param {string} suffix - Measurement suffix
 * @returns {string} Formatted measurement label
 */
const formatMeasurement = (value, suffix) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${value}${suffix}`;
};

/**
 * Capitalizes each word in a weather description.
 * @param {string} description - Weather description from the API
 * @returns {string} Title-cased weather description
 */
const formatDescription = (description) => {
  if (!description) {
    return "N/A";
  }

  return description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Converts a Kelvin temperature to Celsius.
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} Temperature in Celsius
 */
const kelvinToCelsius = (kelvin) => {
  return kelvin - KELVIN_OFFSET;
};

/**
 * Converts a Kelvin temperature to Fahrenheit.
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} Temperature in Fahrenheit
 */
const kelvinToFahrenheit = (kelvin) => {
  return kelvinToCelsius(kelvin) * FAHRENHEIT_MULTIPLIER + FAHRENHEIT_OFFSET;
};

/**
 * Formats a Kelvin temperature for the active unit.
 * @param {number} kelvin - Temperature in Kelvin
 * @param {string} unit - Active temperature unit, C or F
 * @returns {string} Formatted temperature label
 */
const formatTemperature = (kelvin, unit) => {
  if (typeof kelvin !== "number") {
    return "N/A";
  }

  const convertedTemperature = unit === "F"
    ? kelvinToFahrenheit(kelvin)
    : kelvinToCelsius(kelvin);

  return `${Math.round(convertedTemperature)}°${unit}`;
};

/**
 * Formats a Unix timestamp into a readable weekday.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Short weekday label
 */
const formatWeekday = (timestamp) => {
  if (typeof timestamp !== "number") {
    return "N/A";
  }

  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short"
  });
};

/**
 * Creates a weather icon image from an OpenWeatherMap icon code.
 * @param {string} iconCode - OpenWeatherMap icon code
 * @param {string} description - Weather description for alt text
 * @returns {HTMLImageElement} Weather icon image element
 */
const createWeatherIcon = (iconCode, description) => {
  const icon = createElement("img", "weather-icon");

  icon.src = `https://openweathermap.org/img/wn/${formatValue(iconCode)}@2x.png`;
  icon.alt = `${formatDescription(description)} weather icon`;
  icon.width = 100;
  icon.height = 100;

  return icon;
};

/**
 * Creates a small weather metadata item.
 * @param {string} label - Metadata label
 * @param {string} value - Metadata value
 * @returns {HTMLElement} Weather metadata item
 */
const createWeatherMetaItem = (label, value) => {
  const item = createElement("div", "weather-card__meta-item");
  const labelElement = createElement("span", "weather-card__meta-label");
  const valueElement = createElement("span", "weather-card__meta-value");

  labelElement.textContent = label;
  valueElement.textContent = value;

  item.append(labelElement, valueElement);

  return item;
};

/**
 * Clears all weather and forecast output containers.
 * @returns {void} This function does not return a value
 */
const clearUI = () => {
  weatherCard.replaceChildren();
  forecastContainer.replaceChildren();
};

/**
 * Renders a loading state inside the main weather card area.
 * @returns {void} This function does not return a value
 */
const renderLoading = () => {
  clearUI();

  const title = createElement("h2", "weather-card__title");
  const loader = createElement("div", "loading-state");
  const label = createElement("p", "loading-state__label");
  const dots = createElement("div", "loading-state__dots");

  loader.id = "loading-state";
  title.textContent = "Current Weather";
  label.textContent = "Loading weather";

  for (let index = 0; index < 3; index += 1) {
    dots.append(createElement("span", "loading-state__dot"));
  }

  loader.append(label, dots);
  weatherCard.append(title, loader);
};

/**
 * Renders a user-safe error message in the main weather card area.
 * @param {string} message - Human-readable error message
 * @returns {void} This function does not return a value
 */
const renderError = (message) => {
  clearUI();

  const title = createElement("h2", "weather-card__title");
  const error = createElement("p", "error-message");

  title.textContent = "Current Weather";
  error.id = "error-message";
  error.role = "alert";
  error.textContent = message;

  weatherCard.append(title, error);
};

/**
 * Renders current weather data into the main weather card.
 * @param {object} data - Current weather API response with Kelvin temperatures
 * @param {string} unit - Active temperature unit, C or F
 * @returns {void} This function does not return a value
 */
const renderWeather = (data, unit) => {
  clearUI();

  const weather = data?.weather?.[0] ?? {};
  const title = createElement("h2", "weather-card__title");
  const location = createElement("p", "weather-card__location");
  const main = createElement("div", "weather-card__main");
  const temperature = createElement("p", "weather-card__temperature");
  const description = createElement("p", "weather-card__description");
  const feelsLike = createElement("p", "weather-card__feels-like");
  const meta = createElement("div", "weather-card__meta");

  title.textContent = "Current Weather";
  location.textContent = `${formatValue(data?.name)}, ${formatValue(data?.sys?.country)}`;
  temperature.textContent = formatTemperature(data?.main?.temp, unit);
  description.textContent = formatDescription(weather.description);
  feelsLike.textContent = `Feels like ${formatTemperature(data?.main?.feels_like, unit)}`;

  meta.append(
    createWeatherMetaItem("Humidity", formatMeasurement(data?.main?.humidity, "%")),
    createWeatherMetaItem("Wind", formatMeasurement(data?.wind?.speed, " m/s")),
    createWeatherMetaItem("Visibility", formatMeasurement(data?.visibility, " m"))
  );

  main.append(
    createWeatherIcon(weather.icon, weather.description),
    temperature,
    description,
    feelsLike
  );

  weatherCard.append(title, location, main, meta);
  setBackground(weather.id, data?.dt, data?.sys?.sunrise, data?.sys?.sunset);
};

/**
 * Creates a single daily forecast card.
 * @param {object} item - Forecast API list item with Kelvin temperatures
 * @param {string} unit - Active temperature unit, C or F
 * @returns {HTMLElement} Forecast card element
 */
const createForecastCard = (item, unit) => {
  const weather = item?.weather?.[0] ?? {};
  const card = createElement("article", "forecast-card glass-card");
  const day = createElement("h3", "forecast-card__day");
  const temps = createElement("p", "forecast-card__temps");
  const description = createElement("p", "forecast-card__description");

  day.textContent = formatWeekday(item?.dt);
  temps.textContent = `${formatTemperature(item?.main?.temp_max, unit)} / ${formatTemperature(item?.main?.temp_min, unit)}`;
  description.textContent = formatDescription(weather.description);

  card.append(
    day,
    createWeatherIcon(weather.icon, weather.description),
    temps,
    description
  );

  return card;
};

/**
 * Renders five daily forecast cards from noon forecast entries.
 * @param {object} data - Forecast API response with Kelvin temperatures
 * @param {string} unit - Active temperature unit, C or F
 * @returns {void} This function does not return a value
 */
const renderForecast = (data, unit) => {
  forecastContainer.replaceChildren();

  const dailyForecasts = (data?.list ?? []).filter((item) => {
    return item.dt_txt?.includes(FORECAST_NOON_TIME);
  });

  dailyForecasts.forEach((item) => {
    forecastContainer.append(createForecastCard(item, unit));
  });
};
