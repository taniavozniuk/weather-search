"use client";
import "./WeatherApp.scss";
import { useState, useEffect } from "react";
import { searchCity, getWeather } from "@/lib/weather";
import { City } from "@/types/typeCity";
import { Weather } from "@/types/typeWeather";
import CityCard from "@/component/CityCard/CityCard";

export default function WeatherApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      const city: City[] = JSON.parse(savedCity);
      if (city.length > 0) {
        setSelectedCity(city[city.length]);
        fetchWeather(city[city.length]);
      }
    }
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchCity(value);
      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city: City) => {
    try {
      const data = await getWeather(city.lat, city.lon);

      const weatherData: Weather = {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
      };

      setWeather(weatherData);
      localStorage.setItem("selectedCity", JSON.stringify(city));
    } catch (err) {
      console.error("Помилка отримання погоди:", err);
    }
  };

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setQuery("");
    fetchWeather(city);
  };

  return (
    <div className="weather-app">
      <input
        type="text"
        placeholder="Kyiv, Lviv, London..."
        value={query}
        onChange={handleSearch}
        className="search-input"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "20px center",
          backgroundSize: "24px",
        }}
      />

      {loading && <p className="loading-text">Шукаємо...</p>}

      {results.length > 0 && (
        <div className="results-list">
          {results.map((city, i) => (
            <div
              key={i}
              onClick={() => handleCityClick(city)}
              className="city-item"
            >
              <div className="city-info">
                <div>
                  <div className="city-name">
                    {city.local_names?.ky || city.name}
                  </div>
                  <div className="city-location">
                    {city.state ? `${city.state}, ` : ""}
                    {city.country}
                  </div>
                </div>
                <div className="city-coords">
                  <div>{city.lat.toFixed(2)}°</div>
                  <div>{city.lon.toFixed(2)}°</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCity && weather && (
        <CityCard city={selectedCity} weather={weather} />
      )}
    </div>
  );
}
