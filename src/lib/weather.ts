const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
console.log("API_KEY:", API_KEY, "length:", API_KEY?.length);
export async function searchCity(query: string) {
  if (!API_KEY) throw new Error("API Key is missing");

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=5&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Помилка пошуку міста");
  }

  return res.json();
}

export async function getWeather(lat: number, lon: number) {
  if (!API_KEY) throw new Error("API Key is missing");

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Помилка отримання погоди");
  }

  return res.json();
}

export async function getWeatherById(id: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&lang=ua&appid=${API_KEY}`
  );

  if (!res.ok) throw new Error("Помилка запиту погоди");

  return res.json();
}