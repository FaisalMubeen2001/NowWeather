import axios from "axios";
import { API_KEY, ENDPOINTS, SUGGESTION_LIMIT } from "../constants/api";

export const getWeatherCondition = (weatherCode, icon) => {
  const isNight = icon && icon.endsWith("n");

  if (weatherCode >= 200 && weatherCode < 300) return "thunderstorm";
  if (weatherCode >= 300 && weatherCode < 400) return "drizzle";
  if (weatherCode >= 500 && weatherCode < 600) return "rain";
  if (weatherCode >= 600 && weatherCode < 700) return "snow";
  if (weatherCode >= 700 && weatherCode < 800) return "mist";
  if (weatherCode === 800) return isNight ? "clear-night" : "clear-day";
  if (weatherCode > 800) return "cloudy";

  return "clear-day";
};

export const formatTemperature = (temp, unit = "metric") => {
  if (unit === "imperial") {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

export const formatTime = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22);
};

export const formatDay = (timestamp) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(timestamp * 1000);
  return days[date.getDay()];
};

export const formatShortDay = (timestamp) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(timestamp * 1000);
  return days[date.getDay()];
};

export const getWindDirection = (degrees) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
};

export const groupForecastByDay = (forecastList) => {
  const grouped = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  return Object.entries(grouped).map(([date, items]) => {
    const temps = items.map((i) => i.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const midItem = items[Math.floor(items.length / 2)];

    return {
      dt: midItem.dt,
      maxTemp,
      minTemp,
      weather: midItem.weather[0],
      humidity: midItem.main.humidity,
      wind: midItem.wind.speed,
    };
  });
};

export const isDay = (sunrise, sunset, current) => {
  return current >= sunrise && current <= sunset;
};

export const getCityTime = (timezoneOffset) => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + timezoneOffset * 1000);

  const hours = cityTime.getHours();
  const minutes = cityTime.getMinutes().toString().padStart(2, "0");
  const seconds = cityTime.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = days[cityTime.getDay()];
  const date = cityTime.getDate();
  const month = months[cityTime.getMonth()];
  const year = cityTime.getFullYear();

  return {
    time: `${displayHours}:${minutes}:${seconds} ${ampm}`,
    date: `${dayName}, ${date} ${month} ${year}`,
  };
};

export const fetchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 3) return [];

  try {
    const response = await axios.get(ENDPOINTS.geocoding, {
      params: {
        q: query.trim(),
        limit: SUGGESTION_LIMIT,
        appid: API_KEY,
      },
    });

    return response.data.map((item) => ({
      name: item.name,
      state: item.state || "",
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      displayName: [item.name, item.state, item.country].filter(Boolean).join(", "),
    }));
  } catch {
    return [];
  }
};