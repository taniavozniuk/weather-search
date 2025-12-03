import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City } from "@/types/typeCity";
import { Weather } from "@/types/typeWeather";
import { searchCity, getWeather } from "@/lib/weather";
export interface SavedCity {
  city: City;
  weather: Weather;
}
interface WeatherStore {
  query: string;
  results: City[];
  savedCities: SavedCity[];
  loading: boolean;
  handleSearch: (value: string) => Promise<void>;
  addCity: (city: City) => Promise<void>;
  removeCity: (lat: number, lon: number) => void;
  refreshAllWeather: () => Promise<void>;
}
async function loadWeather(city: City): Promise<Weather> {
  const data = await getWeather(city.lat, city.lon);
  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather[0].description,
  };
}
export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      query: "",
      results: [],
      savedCities: [],
      loading: false,
      handleSearch: async (value) => {
        const trimmed = value.trim();
        set({ query: trimmed });
        if (trimmed.length < 3) {
          set({ results: [] });
          return;
        }
        set({ loading: true });
        try {
          const cities = await searchCity(trimmed);
          set({ results: cities });
        } finally {
          set({ loading: false });
        }
      },
      addCity: async (city) => {
        const { savedCities } = get();
        const exists = savedCities.some(
          (item) => item.city.lat === city.lat && item.city.lon === city.lon
        );
        if (exists) return;
        set({ loading: true });
        const weather = await loadWeather(city);
        set((state) => ({
          savedCities: [...state.savedCities, { city, weather }],
          query: "",
          results: [],
          loading: false,
        }));
      },
      removeCity: (lat, lon) => {
        set((state) => ({
          savedCities: state.savedCities.filter(
            (item) => !(item.city.lat === lat && item.city.lon === lon)
          ),
        }));
      },
      refreshAllWeather: async () => {
        const { savedCities } = get();
        if (!savedCities.length) return;
        set({ loading: true });
        const updated = await Promise.all(
          savedCities.map(async ({ city }) => ({
            city,
            weather: await loadWeather(city),
          }))
        );
        set({ savedCities: updated, loading: false });
      },
    }),
    {
      name: "weather-cities-storage",
      partialize: (state) => ({ savedCities: state.savedCities }),
      onRehydrateStorage: () => async (state) => {
        if (!state) return;
        if (state.savedCities.length > 0) {
          const updated = await Promise.all(
            state.savedCities.map(async ({ city }) => ({
              city,
              weather: await loadWeather(city),
            }))
          );
          state.savedCities = updated;
        }
      },
    }
  )
);
