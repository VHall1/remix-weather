import invariant from "tiny-invariant";
import type { weatherIconList } from "./weather";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

invariant(WEATHER_API_KEY, "WEATHER_API_KEY is required");

export const getWeather = async ({ q, lat, lon }: { q?: string; lat?: string; lon?: string }) => {
	const url = new URL(WEATHER_API_URL);
	if (q) url.searchParams.set("q", q);
	if (lat) url.searchParams.set("lat", lat);
	if (lon) url.searchParams.set("lon", lon);
	url.searchParams.set("units", "metric");
	url.searchParams.set("appid", WEATHER_API_KEY);

	const response = await fetch(url);
	const weather: WeatherData = await response.json();
	if (response.ok) {
		return weather;
	} else {
		let error;
		if (response.status === 404) {
			error = new Error("location not found");
		}

		error ||= new Error("failed to fetch weather api");
		return Promise.reject(error);
	}
};

interface WeatherData {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: keyof typeof weatherIconList;
	}[];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	rain: {
		"1h": number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}
