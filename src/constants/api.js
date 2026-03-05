export const API_KEY = "95eefe20a6b4dbc749eebd074b6a3533";

export const BASE_URL = "https://api.openweathermap.org/data/2.5";
export const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const ENDPOINTS = {
  current: `${BASE_URL}/weather`,
  forecast: `${BASE_URL}/forecast`,
  geocoding: `${GEO_URL}/direct`,
};

export const DEFAULT_CITY = "Lucknow";

export const UNITS = "metric";
export const SUGGESTION_LIMIT = 5;