import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coords' }, { status: 400 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  return NextResponse.json(json);
}
