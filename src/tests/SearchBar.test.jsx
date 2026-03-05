import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders the search input and button", () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    expect(screen.getByPlaceholderText("Search for a city...")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("shows error when search is submitted empty", async () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    await userEvent.click(screen.getByText("Search"));
    expect(screen.getByText("Please enter a city name.")).toBeInTheDocument();
  });

  it("shows error for invalid characters in city name", async () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    await userEvent.type(screen.getByPlaceholderText("Search for a city..."), "123!!");
    await userEvent.click(screen.getByText("Search"));
    expect(
      screen.getByText("City name can only contain letters, spaces, or hyphens.")
    ).toBeInTheDocument();
  });

  it("shows error for city name that is too short", async () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    await userEvent.type(screen.getByPlaceholderText("Search for a city..."), "A");
    await userEvent.click(screen.getByText("Search"));
    expect(
      screen.getByText("City name must be at least 2 characters.")
    ).toBeInTheDocument();
  });

  it("calls onSearch with trimmed city name on valid input", async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} loading={false} />);
    await userEvent.type(screen.getByPlaceholderText("Search for a city..."), "Lucknow");
    await userEvent.click(screen.getByText("Search"));
    expect(mockSearch).toHaveBeenCalledWith("Lucknow");
  });

  it("calls onSearch when Enter key is pressed", async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} loading={false} />);
    await userEvent.type(screen.getByPlaceholderText("Search for a city..."), "Delhi{Enter}");
    expect(mockSearch).toHaveBeenCalledWith("Delhi");
  });

  it("clears error message when user starts typing again", async () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    await userEvent.click(screen.getByText("Search"));
    expect(screen.getByText("Please enter a city name.")).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText("Search for a city..."), "L");
    expect(screen.queryByText("Please enter a city name.")).not.toBeInTheDocument();
  });

  it("disables input and button when loading is true", () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />);
    expect(screen.getByPlaceholderText("Search for a city...")).toBeDisabled();
    expect(screen.getByText("...")).toBeDisabled();
  });

  it("accepts city names with hyphens", async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} loading={false} />);
    await userEvent.type(
      screen.getByPlaceholderText("Search for a city..."),
      "Clermont-Ferrand"
    );
    await userEvent.click(screen.getByText("Search"));
    expect(mockSearch).toHaveBeenCalledWith("Clermont-Ferrand");
  });
});