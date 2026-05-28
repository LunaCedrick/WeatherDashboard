/* API layer */

/**
 * Represents a typed weather API error with a user-safe message.
 */
class WeatherApiError extends Error {
  /**
   * Creates a typed weather API error.
   * @param {string} type - Stable error type for app handling
   * @param {string} message - Human-readable user-safe message
   * @returns {WeatherApiError} Typed weather API error instance
   */
  constructor(type, message) {
    super(message);
    this.name = "WeatherApiError";
    this.type = type;
  }
}

/**
 * Builds an OpenWeatherMap endpoint URL for a city query.
 * @param {string} endpoint - OpenWeatherMap endpoint path
 * @param {string} city - City name to request
 * @returns {string} Fully qualified API URL
 */
const buildWeatherUrl = (endpoint, city) => {
  const url = new URL(endpoint, BASE_URL);

  url.searchParams.set("q", city);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", STANDARD_UNITS);

  return url.toString();
};

/**
 * Converts an HTTP response status into a typed API error.
 * @param {number} status - HTTP response status code
 * @returns {WeatherApiError} Typed error for the failed status
 */
const createHttpError = (status) => {
  if (status === 401) {
    return new WeatherApiError(
      API_ERROR_TYPES.INVALID_KEY,
      API_ERROR_MESSAGES.INVALID_KEY
    );
  }

  if (status === 404) {
    return new WeatherApiError(
      API_ERROR_TYPES.CITY_NOT_FOUND,
      API_ERROR_MESSAGES.CITY_NOT_FOUND
    );
  }

  if (status === 429) {
    return new WeatherApiError(
      API_ERROR_TYPES.RATE_LIMIT,
      API_ERROR_MESSAGES.RATE_LIMIT
    );
  }

  if (status >= 500) {
    return new WeatherApiError(
      API_ERROR_TYPES.SERVER_ERROR,
      API_ERROR_MESSAGES.SERVER_ERROR
    );
  }

  return new WeatherApiError(
    API_ERROR_TYPES.UNEXPECTED,
    API_ERROR_MESSAGES.UNEXPECTED
  );
};

/**
 * Parses a weather API response or throws a typed API error.
 * @param {Response} response - Fetch response from OpenWeatherMap
 * @returns {Promise<object>} Parsed JSON response body
 */
const parseWeatherResponse = async (response) => {
  if (!response.ok) {
    throw createHttpError(response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new WeatherApiError(
      API_ERROR_TYPES.UNEXPECTED,
      API_ERROR_MESSAGES.UNEXPECTED
    );
  }
};

/**
 * Requests an OpenWeatherMap endpoint and returns parsed weather data.
 * @param {string} endpoint - OpenWeatherMap endpoint path
 * @param {string} city - City name to request
 * @returns {Promise<object>} Parsed weather API data
 */
const fetchWeatherEndpoint = async (endpoint, city) => {
  try {
    const response = await fetch(buildWeatherUrl(endpoint, city));

    return await parseWeatherResponse(response);
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }

    throw new WeatherApiError(
      API_ERROR_TYPES.CONNECTION_FAILED,
      API_ERROR_MESSAGES.CONNECTION_FAILED
    );
  }
};

/**
 * Fetches current weather data for a city in standard Kelvin units.
 * @param {string} city - City name to request
 * @returns {Promise<object>} Current weather API response
 */
const fetchCurrentWeather = async (city) => {
  return fetchWeatherEndpoint(CURRENT_WEATHER_ENDPOINT, city);
};

/**
 * Fetches 5-day forecast data for a city in standard Kelvin units.
 * @param {string} city - City name to request
 * @returns {Promise<object>} Forecast API response
 */
const fetchForecast = async (city) => {
  return fetchWeatherEndpoint(FORECAST_ENDPOINT, city);
};
