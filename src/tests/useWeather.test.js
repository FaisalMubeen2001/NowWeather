import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import useWeather from "../hooks/useWeather";

vi.mock("axios");

const mockCurrentWeather = {
  name: "Lucknow",
  sys: { country: "IN", sunrise: 1700000000, sunset: 1700050000 },
  main: { temp: 32, feels_like: 35, temp_min: 28, temp_max: 36, humidity: 60, pressure: 1008 },
  weather: [{ id: 800, description: "clear sky", icon: "01d" }],
  wind: { speed: 4, deg: 90 },
  visibility: 8000,
  timezone: 19800,
};

const mockForecastData = {
  list: Array.from({ length: 16 }, (_, i) => ({
    dt: 1700000000 + i * 10800,
    main: { temp: 30 + i, humidity: 55 },
    weather: [{ id: 800, description: "clear sky", icon: "01d" }],
    wind: { speed: 3 },
    pop: 0.1,
  })),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useWeather", () => {
  it("fetches and sets weather data on mount", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCurrentWeather })
             .mockResolvedValueOnce({ data: mockForecastData });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.currentWeather).not.toBeNull();
    });

    expect(result.current.currentWeather.name).toBe("Lucknow");
    expect(result.current.hourlyForecast).toHaveLength(8);
    expect(result.current.forecast.length).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets loading to true while fetching", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCurrentWeather })
             .mockResolvedValueOnce({ data: mockForecastData });

    const { result } = renderHook(() => useWeather());
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("sets error message on 404 response", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 404 },
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.error).toBe("City not found. Please try another city.");
    });

    expect(result.current.loading).toBe(false);
  });

  it("sets error message on 401 response", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Invalid API key. Please check your API key in constants/api.js"
      );
    });
  });

  it("sets generic error on unknown failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.error).toBe("Something went wrong. Please try again.");
    });
  });

  it("searchCity triggers a new fetch with the new city", async () => {
    axios.get.mockResolvedValue({ data: mockCurrentWeather })
             .mockResolvedValue({ data: mockForecastData });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.loading).toBe(false));

    axios.get.mockResolvedValueOnce({
      data: { ...mockCurrentWeather, name: "Delhi" },
    }).mockResolvedValueOnce({ data: mockForecastData });

    result.current.searchCity("Delhi");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(axios.get).toHaveBeenCalled();
  });
});