import { useState, useEffect } from "react";
import { formatTemperature, formatTime, getWindDirection, getCityTime } from "../utils/weatherHelpers";

const CurrentWeather = ({ data, unit, toggleUnit, forecast }) => {
    const [cityTime, setCityTime] = useState({ time: "", date: "" });

    useEffect(() => {
        if (!data) return;

        const update = () => setCityTime(getCityTime(data.timezone));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [data]);

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
                <div className="temperature-row">
                    <h2 className="temperature">{formatTemperature(main.temp, unit)}</h2>
                    <button className="unit-toggle" onClick={toggleUnit}>
                        {unit === "metric" ? "°F" : "°C"}
                    </button>
                </div>

                <div className="city-clock">
                    <p className="city-time">{cityTime.time}</p>
                    <p className="city-date">{cityTime.date}</p>
                </div>

                <p className="feels-like">Feels like {formatTemperature(main.feels_like, unit)}</p>
                <div className="temp-range">
                    <span className="temp-max">
                        ↑ {forecast && forecast[0] ? formatTemperature(forecast[0].maxTemp, unit) : formatTemperature(main.temp_max, unit)}
                    </span>
                    <span className="temp-min">
                        ↓ {forecast && forecast[0] ? formatTemperature(forecast[0].minTemp, unit) : formatTemperature(main.temp_min, unit)}
                    </span>
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