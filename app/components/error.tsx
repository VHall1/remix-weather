import { Link } from "@remix-run/react";

export default function Error({ status, statusText }: { status: number; statusText: string }) {
	return (
		<main className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-100 dark:bg-gray-900 p-4">
			<div className="max-w-md text-center space-y-4">
				<h1 className="text-8xl font-bold text-gray-900 dark:text-gray-50">{status}</h1>
				<p className="text-lg text-gray-500 dark:text-gray-400">{statusText}</p>
				<Link
					className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
					to="/"
				>
					Go back home
				</Link>
			</div>
		</main>
	);
}
