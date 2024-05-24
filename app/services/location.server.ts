import invariant from "tiny-invariant";

const LOCATION_API_KEY = process.env.WEATHER_API_KEY;
const LOCATION_API_URL = "https://api.openweathermap.org/geo/1.0/direct";

invariant(LOCATION_API_KEY, "WEATHER_API_KEY is required");

export const getLocations = async (q: string) => {
	const url = new URL(LOCATION_API_URL);
	if (q) url.searchParams.set("q", q);
	url.searchParams.set("limit", "5");
	url.searchParams.set("appid", LOCATION_API_KEY);

	const response = await fetch(url);
	const weather: LocationData[] = await response.json();
	if (response.ok) {
		return weather.map((w) => Object.assign(w, { geohash: Buffer.from(`${w.lat},${w.lon}`).toString("base64") }));
	} else {
		let error;
		if (response.status === 404) {
			error = new Error("location not found");
		}

		error ||= new Error("failed to fetch weather api");
		return Promise.reject(error);
	}
};

interface LocationData {
	name: string;
	country: string;
	lat: number;
	lon: number;
}
