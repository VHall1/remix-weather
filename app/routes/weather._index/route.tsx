import { parseWithZod } from "@conform-to/zod";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import type { loader as locationSearchLoader } from "~/routes/weather.search";
import { getWeather } from "~/services/weather.server";
import { cn } from "~/utils/cn";
import { Weather } from "./weather";

export default function WeatherPage() {
	const { weather } = useLoaderData<typeof loader>();
	const weatherFetcher = useFetcher<typeof action>();
	const locationFetcher = useFetcher<typeof locationSearchLoader>();
	const locations = locationFetcher.data?.locations || [];
	const [open, setOpen] = useState(false);

	const timeoutRef = useRef<number>();
	// not really updating state here, so should be able to
	// get away with not memoizing this function
	const handleSearch = (q: string) => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = window.setTimeout(() => {
			locationFetcher.submit(
				{ q },
				{
					method: "get",
					action: "/weather/search",
				},
			);
		}, 1000);
	};

	const handleSelect = (lat: number, lon: number) => {
		weatherFetcher.submit({ intent: "latlon", lat, lon }, { method: "post" });
	};

	return (
		<div className="flex flex-col items-center justify-between space-y-6">
			{weather ? (
				<Weather
					temp={weather.temp.toFixed(0)}
					name={`${weather.name}, ${weather.country}`}
					desc={weather.desc}
					weatherIconKey={weather.icon}
				/>
			) : null}
			<div className="w-full">
				<noscript>
					{/* noscript fallback. good old form */}
					<Form method="post" className="flex items-center space-x-2">
						<Input
							name="q"
							className="flex-1 bg-gray-100 dark:bg-gray-800 border-none focus:ring-0"
							placeholder="Search for a location"
							type="text"
						/>
						<Button className="p-2" variant="ghost" type="submit" name="intent" value="location">
							<SearchIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
						</Button>
					</Form>
				</noscript>
				<Command shouldFilter={false} className="noscript-hidden" onChange={() => setOpen(true)}>
					<CommandInput onValueChange={(q) => handleSearch(q)} />
					<CommandList className={cn({ hidden: !open })}>
						{locations.map((location) => (
							<CommandItem
								key={location.geohash}
								onSelect={() => {
									setOpen(false);
									handleSelect(location.lat, location.lon);
								}}
							>
								{location.name}, {location.country}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</div>
		</div>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const intent = formData.get("intent")?.toString();
	const url = new URL(request.url);
	switch (intent) {
		case "latlon": {
			const lat = formData.get("lat")?.toString();
			const lon = formData.get("lon")?.toString();
			if (!lat || !lon) return null;
			url.searchParams.set("lat", lat);
			url.searchParams.set("lon", lon);
			break;
		}
		case "location": {
			const q = formData.get("q")?.toString();
			return redirect(`/weather/search?q=${q}`);
		}
		default:
			return null;
	}

	return redirect(`.?${url.searchParams.toString()}`);
};

const loaderSchema = z.object({
	lat: z.string(),
	lon: z.string(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const submission = parseWithZod(url.searchParams, { schema: loaderSchema });

	if (submission.status !== "success") {
		return { weather: null };
	}

	const rawWeather = await getWeather(submission.value.lat, submission.value.lon);
	const weather = {
		name: rawWeather.name,
		country: rawWeather.sys.country,
		temp: rawWeather.main.temp,
		desc: rawWeather.weather[0].main,
		icon: rawWeather.weather[0].icon,
	};

	return { weather };
};
