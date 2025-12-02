"use client";
import WeatherApp from "@/component/WeatherApp/WeatherApp";
import "../component/WeatherApp/WeatherApp.scss";
export default function Home() {
  return (
    <main className="container">
      <h1 className="pageTitle">Пошук міста</h1>
      <WeatherApp />
    </main>
  );
}
