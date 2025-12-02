import { City } from "@/types/typeCity";
import { Weather } from "@/types/typeWeather";
import './CityCard.scss'
type Props = {
  city: City;
  weather: Weather;
};
export default function CityCard({ city, weather }: Props) {
  return (
    <div className="card">
      <h2 className="text-3xl font-bold mb-2">
        {city.local_names?.ky || city.name}, {city.country}
      </h2>
      <p className="card-text">
        Температура: {weather.temp}°C, відчувається як {weather.feels_like}
        °C
      </p>
      <p className="card-text">Вологість: {weather.humidity}%</p>
      <p className="card-description">Погодні умови: {weather.description}</p>
    </div>
  );
}
