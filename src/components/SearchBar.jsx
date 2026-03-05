import { useState, useEffect, useRef } from "react";
import { fetchCitySuggestions } from "../utils/weatherHelpers";

const SearchBar = ({ onSearch, loading }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (input.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(input);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveSuggestion(-1);
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const validate = (value) => {
    if (!value.trim()) return "Please enter a city name.";
    if (!/^[a-zA-Z\s\-]+$/.test(value.trim()))
      return "City name can only contain letters, spaces, or hyphens.";
    if (value.trim().length < 2) return "City name must be at least 2 characters.";
    return "";
  };

  const handleSearch = (cityName = input) => {
    const validationError = validate(cityName);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    onSearch(cityName.trim());
    setInput("");
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion.name);
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for a city..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="search-input"
          autoComplete="off"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="search-button"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {showSuggestions && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.lat}-${suggestion.lon}`}
              className={`suggestion-item ${activeSuggestion === index ? "active" : ""}`}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">📍</span>
              <span className="suggestion-text">{suggestion.displayName}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default SearchBar;