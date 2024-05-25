import { Outlet } from "@remix-run/react";

export default function WeatherPage() {
	return (
		<main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#6BBCFF] to-[#3F7FFF] dark:from-[#1E2A3A] dark:to-[#0F1B2B]">
			<div className="container w-full max-w-md">
				<div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-8">
					<Outlet />
				</div>
			</div>
		</main>
	);
}
