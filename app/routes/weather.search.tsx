import { parseWithZod } from "@conform-to/zod";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getLocations } from "~/services/location.server";

export default function WeatherSearch() {
	const { locations } = useLoaderData<typeof loader>();

	return (
		<div className="text-center">
			<h1 className="text-lg font-bold mb-4">Search results ({locations.length})</h1>
			{locations.map((location) => (
				<Link
					to={`/weather?intent=latlon&lat=${location.lat}&lon=${location.lon}`}
					key={location.geohash}
					className="block underline"
				>
					{location.name}, {location.country}
				</Link>
			))}
		</div>
	);
}

const schema = z.object({
	q: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
	const params = new URL(request.url).searchParams;
	const submission = parseWithZod(params, { schema });

	let locations: Awaited<ReturnType<typeof getLocations>> = [];
	if (submission.status !== "success") {
		return { locations };
	}

	try {
		locations = await getLocations(submission.value.q);
	} catch (error) {
		console.error(error);
		return { locations };
	}

	return { locations };
}
