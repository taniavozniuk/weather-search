"use client";

import { useState, useEffect } from "react";

type City = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

type Weather = {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  console.log("API_KEY:", API_KEY, "length:", API_KEY?.length);
  useEffect(() => {
    // Якщо зберігати останній вибір у localStorage
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      const city: City = JSON.parse(savedCity);
      setSelectedCity(city);
      fetchWeather(city);
    }
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    if (!API_KEY) {
      alert("API ключ не завантажено! Перевірте .env.local");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          value
        )}&limit=5&appid=${API_KEY}`
      );

      if (!res.ok) {
        throw new Error("Помилка пошуку міста");
      }

      const data: City[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city: City) => {
    if (!API_KEY) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

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
    fetchWeather(city);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold text-white text-center mb-10">
        Пошук міста
      </h1>

      <input
        type="text"
        placeholder="Kyiv, Lviv, London..."
        value={query}
        onChange={handleSearch}
        className="w-full max-w-2xl h-16 px-16 text-xl text-white bg-white/10 border-2 border-white/20 rounded-2xl focus:border-blue-500 focus:outline-none backdrop-blur-md placeholder-gray-500 transition-all mb-6"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "20px center",
          backgroundSize: "24px",
        }}
      />

      {loading && <p className="text-gray-400 text-lg">Шукаємо...</p>}

      {results.length > 0 && (
        <div className="w-full max-w-2xl mt-4 space-y-4">
          {results.map((city, i) => (
            <div
              key={i}
              onClick={() => handleCityClick(city)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {city.local_names?.ky || city.name}
                  </div>
                  <div className="text-gray-400">
                    {city.state ? `${city.state}, ` : ""}
                    {city.country}
                  </div>
                </div>
                <div className="text-gray-300 text-right">
                  <div>{city.lat.toFixed(2)}°</div>
                  <div>{city.lon.toFixed(2)}°</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCity && weather && (
        <div className="w-full max-w-2xl mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {selectedCity.local_names?.ky || selectedCity.name},{" "}
            {selectedCity.country}
          </h2>
          <p className="text-lg">
            Температура: {weather.temp}°C, відчувається як {weather.feels_like}
            °C
          </p>
          <p className="text-lg">Вологість: {weather.humidity}%</p>
          <p className="text-lg capitalize">
            Погодні умови: {weather.description}
          </p>
        </div>
      )}
    </main>
  );
}
