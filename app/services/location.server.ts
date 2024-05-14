const LOCATION_API_URL = "https://www.metoffice.gov.uk/plain-rest-services/location-search";

export const getLocations = async (q: string) => {
	const url = new URL(LOCATION_API_URL);
	url.searchParams.set("searchTerm", q);
	url.searchParams.set("max", "5");
	url.searchParams.set("filter", "exclude-marine-offshore");

	const response = await fetch(url);
	const locations: LocationData[] = await response.json();
	if (response.ok) {
		return locations;
	} else {
		const error = new Error("failed to fetch weather api");
		return Promise.reject(error);
	}
};

interface LocationData {
	name: string;
	area: string;
	latLong: [number, number];
	geohash: string;
}
