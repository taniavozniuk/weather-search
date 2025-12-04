export async function searchCity(query: string) {
  const res = await fetch(`/api/search?q=${query}`);
  return res.json();
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function getWeather(lat: number, lon: number) {
  if (!API_KEY) throw new Error('API Key is missing');

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error('Помилка отримання погоди');
  }

  return res.json();
}
