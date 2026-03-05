import { formatTemperature, formatShortDay, formatDay } from "../utils/weatherHelpers";

const DailyForecast = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="daily-forecast-card">
      <h3 className="section-title">📅 7-Day Forecast</h3>
      <div className="daily-list">
        {data.map((item, index) => {
          const icon = `https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`;
          const fullDay = formatDay(item.dt);
          const shortDay = formatShortDay(item.dt);
          const description = item.weather.description;

          return (
            <div key={index} className="daily-item">
              <p className="daily-day">
                <span className="day-full">{index === 0 ? "Today" : fullDay}</span>
                <span className="day-short">{index === 0 ? "Today" : shortDay}</span>
              </p>

              <div className="daily-icon-wrapper">
                <img
                  src={icon}
                  alt={description}
                  className="daily-icon"
                  title={description}
                />
                <span className="daily-description">{description}</span>
              </div>

              <div className="daily-extras">
                <span className="daily-humidity">💧 {item.humidity}%</span>
                <span className="daily-wind">🌬️ {Math.round(item.wind)} m/s</span>
              </div>

              <div className="daily-temps">
                <span className="daily-max">{formatTemperature(item.maxTemp)}</span>
                <div className="temp-bar-wrapper">
                  <div
                    className="temp-bar"
                    style={{
                      width: `${Math.min(100, Math.round(((item.maxTemp - item.minTemp) / 40) * 100))}%`,
                    }}
                  />
                </div>
                <span className="daily-min">{formatTemperature(item.minTemp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;