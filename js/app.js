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
const suggestionsList = document.querySelector("#city-suggestions");
const unitCelsiusButton = document.querySelector("#unit-celsius");
const unitFahrenheitButton = document.querySelector("#unit-fahrenheit");
let suggestionsDebounceTimer = null;
let latestSuggestionsRequest = 0;

/**
 * Gets the trimmed city name from the search input.
 * @returns {string} Trimmed city name
 */
const getSearchCity = () => {
  return searchInput.value.trim();
};

/**
 * Gets the nearest suggestion button from an event target.
 * @param {EventTarget} target - Event target from a suggestion interaction
 * @returns {HTMLButtonElement|null} Suggestion button or null
 */
const getSuggestionButton = (target) => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest(".suggestions__button");
};

/**
 * Builds a search label from the selected suggestion text.
 * @param {HTMLButtonElement} button - Selected suggestion button
 * @returns {string} Search label for the selected city
 */
const getSuggestionSearchLabel = (button) => {
  const city = button.querySelector(".suggestions__city")?.textContent.trim();
  const meta = button.querySelector(".suggestions__meta")?.textContent.trim();

  return [city, meta].filter(Boolean).join(", ");
};

/**
 * Clears any pending city suggestions debounce timer.
 * @returns {void} This function does not return a value
 */
const clearSuggestionsDebounce = () => {
  if (suggestionsDebounceTimer) {
    clearTimeout(suggestionsDebounceTimer);
    suggestionsDebounceTimer = null;
  }
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
    clearSuggestions();
  } catch (error) {
    state.lastRawData.current = null;
    state.lastRawData.forecast = null;
    renderError(getErrorMessage(error));
  }
};

/**
 * Fetches and renders suggestions for the current input value.
 * @param {string} query - Trimmed city search query
 * @returns {Promise<void>} Resolves when suggestions are handled
 */
const handleSuggestionsSearch = async (query) => {
  const requestId = latestSuggestionsRequest + 1;
  latestSuggestionsRequest = requestId;

  try {
    const suggestions = await fetchCitySuggestions(query);

    if (requestId !== latestSuggestionsRequest) {
      return;
    }

    renderSuggestions(suggestions);
  } catch {
    if (requestId === latestSuggestionsRequest) {
      clearSuggestions();
    }
  }
};

/**
 * Handles search input changes and debounces city suggestions.
 * @returns {void} This function does not return a value
 */
const handleSearchInput = () => {
  const query = getSearchCity();

  clearSuggestionsDebounce();

  if (query.length < MIN_SUGGESTION_QUERY_LENGTH) {
    latestSuggestionsRequest += 1;
    clearSuggestions();
    return;
  }

  suggestionsDebounceTimer = setTimeout(() => {
    handleSuggestionsSearch(query);
  }, SUGGESTION_DEBOUNCE_DELAY);
};

/**
 * Handles selection of a rendered city suggestion.
 * @param {HTMLButtonElement} button - Selected suggestion button
 * @returns {void} This function does not return a value
 */
const handleSuggestionSelection = (button) => {
  const cityLabel = getSuggestionSearchLabel(button);

  if (!cityLabel) {
    return;
  }

  searchInput.value = cityLabel;
  clearSuggestionsDebounce();
  clearSuggestions();
  handleSearch(cityLabel);
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
  clearSuggestionsDebounce();
  clearSuggestions();
  handleSearch(getSearchCity());
});

/* Search input suggestions listener */
searchInput.addEventListener("input", () => {
  handleSearchInput();
});

/* Search input escape listener */
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearSuggestionsDebounce();
    clearSuggestions();
  }
});

/* Suggestions selection listener */
suggestionsList.addEventListener("click", (event) => {
  const button = getSuggestionButton(event.target);

  if (button) {
    handleSuggestionSelection(button);
  }
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
