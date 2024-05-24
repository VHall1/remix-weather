import { type LoaderFunctionArgs } from "@remix-run/node";
import { getLocations } from "~/services/location.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get("q")?.toString();
	if (!q) return { locations: [] };
	const locations = await getLocations(q);
	return { locations };
};
