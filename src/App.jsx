import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherEffects from "./components/WeatherEffects";
import { getWeatherCondition } from "./utils/weatherHelpers";
import "./index.css";

const App = () => {
  const {
    currentWeather,
    forecast,
    hourlyForecast,
    loading,
    error,
    searchCity,
  } = useWeather();

  const condition = currentWeather
    ? getWeatherCondition(
        currentWeather.weather[0].id,
        currentWeather.weather[0].icon
      )
    : "clear-day";

  return (
    <div className={`app-wrapper ${condition}`}>
      <WeatherEffects condition={condition} />

      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">🌤 WeatherNow</h1>
          <p className="app-subtitle">Real-time weather at your fingertips</p>
        </header>

        <SearchBar onSearch={searchCity} loading={loading} />

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-wrapper">
            <div className="loader" />
            <p className="loading-text">Fetching weather...</p>
          </div>
        )}

        {!loading && currentWeather && (
          <div className="weather-content">
            <CurrentWeather data={currentWeather} />
            <HourlyForecast
              data={hourlyForecast}
              timezone={currentWeather.timezone}
            />
            <DailyForecast data={forecast} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;