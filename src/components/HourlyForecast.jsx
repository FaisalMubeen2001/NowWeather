import { formatTemperature, formatTime } from "../utils/weatherHelpers";

const HourlyForecast = ({ data, timezone }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="hourly-forecast-card">
      <h3 className="section-title">⏱ 3-Hourly Forecast</h3>
      <div className="hourly-scroll">
        {data.map((item, index) => {
          const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
          const time = formatTime(item.dt, timezone);
          const temp = formatTemperature(item.main.temp);
          const description = item.weather[0].description;
          const pop = Math.round((item.pop || 0) * 100);

          return (
            <div key={index} className="hourly-item">
              <p className="hourly-time">{time}</p>
              <img
                src={icon}
                alt={description}
                className="hourly-icon"
                title={description}
              />
              <p className="hourly-temp">{temp}</p>
              {pop > 0 && (
                <p className="hourly-pop">💧 {pop}%</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;