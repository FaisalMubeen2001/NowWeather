import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_KEY, ENDPOINTS, DEFAULT_CITY, UNITS } from "../constants/api";
import { groupForecastByDay } from "../utils/weatherHelpers";

const useWeather = () => {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (searchCity) => {
    setLoading(true);
    setError(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(ENDPOINTS.current, {
          params: {
            q: searchCity,
            appid: API_KEY,
            units: UNITS,
          },
        }),
        axios.get(ENDPOINTS.forecast, {
          params: {
            q: searchCity,
            appid: API_KEY,
            units: UNITS,
          },
        }),
      ]);

      setCurrentWeather(currentRes.data);
      setHourlyForecast(forecastRes.data.list.slice(0, 8));
      setForecast(groupForecastByDay(forecastRes.data.list).slice(0, 7));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("City not found. Please try another city.");
      } else if (err.response && err.response.status === 401) {
        setError("Invalid API key. Please check your API key in constants/api.js");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const searchCity = (newCity) => {
    setCity(newCity);
    fetchWeather(newCity);
  };

  return {
    currentWeather,
    forecast,
    hourlyForecast,
    loading,
    error,
    searchCity,
  };
};

export default useWeather;