export async function searchCity(query: string) {
  const res = await fetch(`/api/search?q=${query}`);
  return res.json();
}

export async function getWeather(lat: number, lon: number) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  const res = await fetch(`${baseUrl}/api/weather?lat=${lat}&lon=${lon}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.statusText}`);
  }

  return res.json();
}
