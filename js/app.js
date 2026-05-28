/* Application layer */

/* Application state */
const state = {
  currentCity: "",
  currentUnit: DEFAULT_UNIT,
  lastRawData: {
    current: null,
    forecast: null
  }
};

/* DOM references for application controls */
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const unitCelsiusButton = document.querySelector("#unit-celsius");
const unitFahrenheitButton = document.querySelector("#unit-fahrenheit");

/**
 * Gets the trimmed city name from the search input.
 * @returns {string} Trimmed city name
 */
const getSearchCity = () => {
  return searchInput.value.trim();
};

/**
 * Updates the unit toggle buttons to match the active state unit.
 * @returns {void} This function does not return a value
 */
const updateUnitToggle = () => {
  const isCelsius = state.currentUnit === "C";

  unitCelsiusButton.classList.toggle("unit-toggle__btn--active", isCelsius);
  unitFahrenheitButton.classList.toggle("unit-toggle__btn--active", !isCelsius);
  unitCelsiusButton.setAttribute("aria-pressed", String(isCelsius));
  unitFahrenheitButton.setAttribute("aria-pressed", String(!isCelsius));
};

/**
 * Renders the last successful weather data from raw Kelvin API responses.
 * @returns {void} This function does not return a value
 */
const renderStoredWeather = () => {
  if (!state.lastRawData.current || !state.lastRawData.forecast) {
    return;
  }

  renderWeather(state.lastRawData.current, state.currentUnit);
  renderForecast(state.lastRawData.forecast, state.currentUnit);
};

/**
 * Sets the active temperature unit and re-renders stored weather data.
 * @param {string} unit - Temperature unit to activate, C or F
 * @returns {void} This function does not return a value
 */
const setCurrentUnit = (unit) => {
  if (state.currentUnit === unit) {
    return;
  }

  state.currentUnit = unit;
  updateUnitToggle();
  renderStoredWeather();
};

/**
 * Converts unknown caught errors into user-safe messages.
 * @param {*} error - Caught error value
 * @returns {string} Human-readable error message
 */
const getErrorMessage = (error) => {
  return error?.message || API_ERROR_MESSAGES.UNEXPECTED;
};

/**
 * Searches for weather data and renders the dashboard.
 * @param {string} city - City name to search
 * @returns {Promise<void>} Resolves when the search flow completes
 */
const handleSearch = async (city) => {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    renderError("Please enter a city name.");
    return;
  }

  if (
    state.currentCity.toLowerCase() === trimmedCity.toLowerCase() &&
    state.lastRawData.current &&
    state.lastRawData.forecast
  ) {
    renderStoredWeather();
    return;
  }

  try {
    renderLoading();

    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(trimmedCity),
      fetchForecast(trimmedCity)
    ]);

    state.currentCity = currentData.name || trimmedCity;
    state.lastRawData.current = currentData;
    state.lastRawData.forecast = forecastData;

    localStorage.setItem(LAST_CITY_STORAGE_KEY, state.currentCity);
    renderStoredWeather();
  } catch (error) {
    state.lastRawData.current = null;
    state.lastRawData.forecast = null;
    renderError(getErrorMessage(error));
  }
};

/**
 * Loads the last successful city from localStorage on page load.
 * @returns {void} This function does not return a value
 */
const initializeStoredCity = () => {
  const storedCity = localStorage.getItem(LAST_CITY_STORAGE_KEY);

  if (!storedCity) {
    return;
  }

  searchInput.value = storedCity;
  handleSearch(storedCity);
};

/* Search form submit listener */
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch(getSearchCity());
});

/* Celsius toggle listener */
unitCelsiusButton.addEventListener("click", () => {
  setCurrentUnit("C");
});

/* Fahrenheit toggle listener */
unitFahrenheitButton.addEventListener("click", () => {
  setCurrentUnit("F");
});

/* Initial application load */
updateUnitToggle();
initializeStoredCity();
