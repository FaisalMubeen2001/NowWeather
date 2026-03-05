# 🌤 WeatherNow

A modern, real-time weather application built with React and Vite. Features a stunning glassmorphism UI with dynamic weather effects that react to live conditions.

![WeatherNow](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Tests](https://img.shields.io/badge/Tests-31%20passing-brightgreen)

## 🌐 Live Demo
[View Live on Netlify](https://weatherapp-nowweather.netlify.app/))

## ✨ Features
- 🔍 City search with autocomplete suggestions
- 🌡️ Current weather with temperature, humidity, wind, visibility and pressure
- ⏱️ Live ticking clock showing local time of the searched city
- 🔄 Toggle between °C and °F across all forecasts
- 📅 7-day forecast with min/max temperatures
- 🕐 Hourly forecast (every 3 hours)
- 🌧️ Dynamic weather effects — rain, snow, sun rays, stars & moon
- 📱 Fully responsive for mobile and desktop

## 🛠️ Tech Stack
- **React 18** — component-based UI
- **Vite** — fast development and build tool
- **Axios** — API requests
- **OpenWeatherMap API** — live weather data
- **Vitest** — unit testing
- **Testing Library** — component testing
- **CSS Glassmorphism** — modern UI design

## 🧪 Tests
31 tests across 3 test files covering:
- Weather condition mapping
- Temperature formatting
- Wind direction
- Day/night detection
- Search input validation
- Hook behaviour and error handling

Run tests with:
```bash
npm test
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org))

### Installation
```bash
# Clone the repository
git clone https://github.com/FaisalMubeen2001/NowWeather.git

# Navigate into the project
cd NowWeather

# Install dependencies
npm install

# Create a .env file in the root
echo "VITE_API_KEY=your_api_key_here" > .env

# Start the dev server
npm run dev
```

## 📁 Project Structure
```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── CurrentWeather.jsx
│   ├── HourlyForecast.jsx
│   ├── DailyForecast.jsx
│   └── WeatherEffects.jsx
├── hooks/
│   └── useWeather.js
├── utils/
│   └── weatherHelpers.js
├── constants/
│   └── api.js
└── tests/
    ├── weatherHelpers.test.js
    ├── SearchBar.test.jsx
    └── useWeather.test.js
```

## 📄 License
MIT License — feel free to use this project for your own portfolio.
