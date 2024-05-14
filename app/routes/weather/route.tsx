import { HeadersFunction, LoaderFunctionArgs, json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getWeather } from "~/services/weather.server";
import { Weather } from "./weather";

export default function WeatherPage() {
	const { weather } = useLoaderData<typeof loader>();

	return (
		<main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#6BBCFF] to-[#3F7FFF] dark:from-[#1E2A3A] dark:to-[#0F1B2B]">
			<div className="container w-full max-w-md">
				<div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-8">
					<div className="flex flex-col items-center justify-between space-y-6">
						{weather ? (
							<Weather
								temp={weather.temp.toFixed(0)}
								name={weather.name}
								desc={weather.desc}
								weatherIconKey={weather.icon}
							/>
						) : null}
						<div className="w-full">
							<Form method="post" className="flex items-center space-x-2">
								<Input
									name="q"
									className="flex-1 bg-gray-100 dark:bg-gray-800 border-none focus:ring-0"
									placeholder="Search for a location"
									type="text"
								/>
								<Button className="p-2" variant="ghost" type="submit">
									<SearchIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
								</Button>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const q = formData.get("q");
	if (!q) return null;

	const url = new URL(request.url);
	url.searchParams.set("q", q.toString());

	return redirect(url.toString());
};

export const headers: HeadersFunction = () => ({
	"Cache-Control": "max-age=300, private",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");

	let weather = null;
	if (q) {
		const rawWeather = await getWeather(q);
		weather = {
			name: rawWeather.name,
			temp: rawWeather.main.temp,
			desc: rawWeather.weather[0].main,
			icon: rawWeather.weather[0].icon,
		};
	}

	return json(
		{ weather },
		// {
		// 	headers: {
		// 		"Cache-Control": "max-age=300, private",
		// 		// Vary: "q",
		// 	},
		// },
	);
};
