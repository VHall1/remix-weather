import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getWeather } from "~/services/weather.server";
import { Weather } from "./weather";

export default function Index() {
	const lastAction = useActionData<typeof action>();

	return (
		<main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#6BBCFF] to-[#3F7FFF] dark:from-[#1E2A3A] dark:to-[#0F1B2B]">
			<div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-8 w-full max-w-md">
				<div className="flex flex-col items-center justify-between space-y-6">
					{lastAction ? (
						<Weather
							temp={lastAction.temp.toFixed(0)}
							name={lastAction.name}
							desc={lastAction.desc}
							weatherIconKey={lastAction.icon}
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
		</main>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const q = formData.get("q");
	if (!q) return null;

	const weather = await getWeather(q.toString());
	return json({
		name: weather.name,
		temp: weather.main.temp,
		desc: weather.weather[0].main,
		icon: weather.weather[0].icon,
	});
};
