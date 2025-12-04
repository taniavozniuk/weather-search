'use client';
import './WeatherApp.scss';
import CityCard from '@/component/CityCard/CityCard';
import { useWeatherStore } from './useWeatherCities';

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

  return (
    <div className="weather-app">
      <input
        type="text"
        placeholder="Kyiv, Lviv, London..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
        style={{}}
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
                    {city.state ? `${city.state}, ` : ''}
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
