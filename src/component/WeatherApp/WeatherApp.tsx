"use client";
import "./WeatherApp.scss";
import CityCard from "@/component/CityCard/CityCard";
import { useWeatherStore } from "./useWeatherCities";

export default function WeatherApp() {
  const {
    query,
    results,
    savedCities,
    loading,
    handleSearch,
    addCity,
    removeCity,
  } = useWeatherStore();

  // if (savedCities.length === 0) {
  //   return <p className="no-cities">Add a city to see the weather</p>;
  // }

  return (
    <div className="weather-app">
      <input
        type="text"
        placeholder="Kyiv, Lviv, London..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "20px center",
          backgroundSize: "24px",
          paddingLeft: "56px",
        }}
      />

      {loading && <p className="loading-text">Updating the weather...</p>}

      {results.length > 0 && (
        <div className="results-list">
          {results.map((city) => (
            <div
              key={`${city.lat}-${city.lon}`}
              onClick={() => addCity(city)}
              className="city-item"
            >
              <div className="city-info">
                <div>
                  <div className="city-name">
                    {city.local_names?.uk || city.local_names?.ky || city.name}
                  </div>
                  <div className="city-location">
                    {city.state ? `${city.state}, ` : ""}
                    {city.country}
                  </div>
                </div>
                <div className="city-coords">
                  {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cities-grid">
        {savedCities.map(({ city, weather }) => (
          <CityCard
            key={`${city.lat}-${city.lon}`}
            city={city}
            weather={weather}
            onRemove={() => removeCity(city.lat, city.lon)}
          />
        ))}
      </div>
    </div>
  );
}
