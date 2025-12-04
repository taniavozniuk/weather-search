import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!API_KEY || !q) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    q,
  )}&limit=5&appid=${API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  return NextResponse.json(json);
}
