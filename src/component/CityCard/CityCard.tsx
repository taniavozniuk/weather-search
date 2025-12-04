import { City } from '@/types/typeCity';
import { Weather } from '@/types/typeWeather';
import './CityCard.scss';
import Link from 'next/link';
type Props = {
  city: City;
  weather: Weather;
  onRemove?: () => void;
};
export default function CityCard({ city, weather, onRemove }: Props) {
  const cityId = `${city.lat}|${city.lon}`;

  return (
    <div className="card">
      <button className="button" onClick={onRemove}>
        &#10006;
      </button>
      <Link href={`/city/${cityId}`} className="link">
        <h2 className="title">
          {city.local_names?.ky || city.name}, {city.country}
        </h2>
        <div className="">
          <p className="card-text">
            Temperature: {weather.temp}°C, feels like {weather.feels_like}
            °C
          </p>

          <p className="card-text">Humidity: {weather.humidity}%</p>

          <p className="card-description">
            Weather conditions: {weather.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
