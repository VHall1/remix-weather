import { weatherIconList } from "~/services/weather";

export function Weather({ temp, name, desc, weatherIconKey }: WeatherProps) {
	console.log(weatherIconKey);
	const WeatherIcon = weatherIconList[weatherIconKey];
	return (
		<div className="flex items-center space-x-4">
			<WeatherIcon className="w-12 h-12 text-[#3F7FFF] dark:text-[#6BBCFF]" />
			<div>
				<h1 className="text-4xl font-bold">{temp}°C</h1>
				<p className="text-gray-500 dark:text-gray-400">{name}</p>
				<p className="text-gray-500 dark:text-gray-400">{desc}</p>
			</div>
		</div>
	);
}

interface WeatherProps {
	temp: string;
	name: string;
	desc: string;
	weatherIconKey: keyof typeof weatherIconList;
}
