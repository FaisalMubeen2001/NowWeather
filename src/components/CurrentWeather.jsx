import { formatTemperature, formatTime, getWindDirection } from "../utils/weatherHelpers";

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const {
    name,
    sys,
    main,
    weather,
    wind,
    visibility,
    timezone,
  } = data;

  const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const sunrise = formatTime(sys.sunrise, timezone);
  const sunset = formatTime(sys.sunset, timezone);

  return (
    <div className="current-weather-card">
      <div className="current-weather-header">
        <div className="location">
          <h1 className="city-name">{name}</h1>
          <p className="country">{sys.country}</p>
        </div>
        <div className="weather-icon-wrapper">
          <img
            src={weatherIcon}
            alt={weather[0].description}
            className="weather-icon"
          />
          <p className="weather-description">{weather[0].description}</p>
        </div>
      </div>

      <div className="temperature-display">
        <h2 className="temperature">{formatTemperature(main.temp)}</h2>
        <p className="feels-like">Feels like {formatTemperature(main.feels_like)}</p>
        <div className="temp-range">
          <span className="temp-max">↑ {formatTemperature(main.temp_max)}</span>
          <span className="temp-min">↓ {formatTemperature(main.temp_min)}</span>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌬️</span>
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {Math.round(wind.speed)} m/s {getWindDirection(wind.deg)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌅</span>
          <span className="detail-label">Sunrise</span>
          <span className="detail-value">{sunrise}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌇</span>
          <span className="detail-label">Sunset</span>
          <span className="detail-value">{sunset}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;