import { getWeather } from "@/lib/weather";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import "./styles.scss";
import { enAU } from "date-fns/locale";

export default async function CityPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const decoded = decodeURIComponent(id);

  const [latStr, lonStr] = decoded.split("|");

  const lat = Number(latStr);
  const lon = Number(lonStr);

  if (isNaN(lat) || isNaN(lon)) {
    return <div>Помилка: некоректний ID міста</div>;
  }

  const weather = await getWeather(lat, lon);
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);

  return (
    <div className="weather-detail-page">
      <div className="card-container">
        <Link href="/" className="back-btn">
          &larr; Back to home page
        </Link>

        <header className="header">
          <div className="city-info">
            <h1 className="city-name">{weather.name}</h1>
            <p className="country">{weather.sys.country}</p>
          </div>
          <div className="current-time">
            {format(new Date(), "d MMMM yyyy, EEEE", { locale: enAU })}
          </div>
        </header>

        <div className="current-weather">
          <div className="temperature">
            {temp}°
            <span className="feels-like">Feels like {feelsLike}°</span>
          </div>
          <p className="description">
            {weather.weather[0].description.charAt(0).toUpperCase() +
              weather.weather[0].description.slice(1)}
          </p>
        </div>

        <div className="details-grid">
          <div className="detail-card">
            <div className="icon">Humidity</div>
            <div className="value">{weather.main.humidity}%</div>
          </div>

          <div className="detail-card">
            <div className="icon">Pressure</div>
            <div className="value">{weather.main.pressure} hPa</div>
          </div>

          <div className="detail-card">
            <div className="icon">Wind</div>
            <div className="value">{weather.wind.speed} m/s</div>
          </div>

          <div className="detail-card">
            <div className="icon">Visibility</div>
            <div className="value">
              {(weather.visibility / 1000).toFixed(1)} km
            </div>
          </div>

          <div className="detail-card sunrise">
            <div className="icon">Sunrise</div>
            <div className="value">{format(sunrise, "HH:mm")}</div>
          </div>

          <div className="detail-card sunset">
            <div className="icon">Sunset</div>
            <div className="value">{format(sunset, "HH:mm")}</div>
          </div>
        </div>

        <div className="extra-info">
          <div className="info-item">
            <span>Cloudiness</span>
            <span>{weather.clouds.all}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
