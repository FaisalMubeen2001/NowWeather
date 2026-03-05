import { describe, it, expect } from "vitest";
import {
  getWeatherCondition,
  formatTemperature,
  formatDay,
  formatShortDay,
  getWindDirection,
  groupForecastByDay,
  isDay,
} from "../utils/weatherHelpers";

describe("getWeatherCondition", () => {
  it("returns thunderstorm for codes 200-299", () => {
    expect(getWeatherCondition(200, "11d")).toBe("thunderstorm");
    expect(getWeatherCondition(299, "11d")).toBe("thunderstorm");
  });

  it("returns drizzle for codes 300-399", () => {
    expect(getWeatherCondition(300, "09d")).toBe("drizzle");
  });

  it("returns rain for codes 500-599", () => {
    expect(getWeatherCondition(500, "10d")).toBe("rain");
    expect(getWeatherCondition(531, "10d")).toBe("rain");
  });

  it("returns snow for codes 600-699", () => {
    expect(getWeatherCondition(600, "13d")).toBe("snow");
  });

  it("returns mist for codes 700-799", () => {
    expect(getWeatherCondition(701, "50d")).toBe("mist");
  });

  it("returns clear-day for code 800 with day icon", () => {
    expect(getWeatherCondition(800, "01d")).toBe("clear-day");
  });

  it("returns clear-night for code 800 with night icon", () => {
    expect(getWeatherCondition(800, "01n")).toBe("clear-night");
  });

  it("returns cloudy for codes above 800", () => {
    expect(getWeatherCondition(801, "02d")).toBe("cloudy");
    expect(getWeatherCondition(804, "04d")).toBe("cloudy");
  });
});

describe("formatTemperature", () => {
  it("rounds and formats temperature correctly", () => {
    expect(formatTemperature(36.7)).toBe("37°C");
    expect(formatTemperature(22.1)).toBe("22°C");
    expect(formatTemperature(0)).toBe("0°C");
    expect(formatTemperature(-5.9)).toBe("-6°C");
  });
});

describe("formatDay", () => {
  it("returns a valid day name", () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const result = formatDay(1700000000);
    expect(days).toContain(result);
  });
});

describe("formatShortDay", () => {
  it("returns a valid short day name", () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = formatShortDay(1700000000);
    expect(days).toContain(result);
  });
});

describe("getWindDirection", () => {
  it("returns correct direction for degrees", () => {
    expect(getWindDirection(0)).toBe("N");
    expect(getWindDirection(90)).toBe("E");
    expect(getWindDirection(180)).toBe("S");
    expect(getWindDirection(270)).toBe("W");
    expect(getWindDirection(45)).toBe("NE");
    expect(getWindDirection(135)).toBe("SE");
  });
});

describe("groupForecastByDay", () => {
  it("groups forecast items by day correctly", () => {
    const mockList = Array.from({ length: 6 }, (_, i) => ({
      dt: 1700000000 + i * 10800,
      main: { temp: 30 + i, humidity: 60 },
      weather: [{ description: "clear sky", icon: "01d" }],
      wind: { speed: 3 },
    }));

    const result = groupForecastByDay(mockList);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty("maxTemp");
    expect(result[0]).toHaveProperty("minTemp");
    expect(result[0]).toHaveProperty("humidity");
  });
});

describe("isDay", () => {
  it("returns true when current time is between sunrise and sunset", () => {
    expect(isDay(1700000000, 1700050000, 1700025000)).toBe(true);
  });

  it("returns false when current time is before sunrise", () => {
    expect(isDay(1700000000, 1700050000, 1699990000)).toBe(false);
  });

  it("returns false when current time is after sunset", () => {
    expect(isDay(1700000000, 1700050000, 1700060000)).toBe(false);
  });
});