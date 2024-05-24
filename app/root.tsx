import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useFetcher,
	useLoaderData,
	useLocation,
	useRouteError,
	useRouteLoaderData,
} from "@remix-run/react";
import { MoonIcon, SunIcon } from "lucide-react";
import noscriptStyles from "~/noscript.css?url";
import tailwindStyles from "~/tailwind.css?url";
import Error from "./components/error";
import { Button } from "./components/ui/button";
import { getTheme } from "./services/session.server";
import { cn } from "./utils/cn";

export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData = useRouteLoaderData<typeof loader>("root");

	return (
		<html lang="en" className={cn({ dark: loaderData?.theme !== "light" })}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Remix Weather</title>
				<Meta />
				<Links />
				<noscript>
					<link rel="stylesheet" href={noscriptStyles} />
				</noscript>
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const { theme } = useLoaderData<typeof loader>();
	const themeFetcher = useFetcher();
	const location = useLocation();

	return (
		<>
			<themeFetcher.Form method="post" action="/action/set-theme" preventScrollReset>
				<input type="hidden" name="returnTo" value={location.pathname + location.search} />
				<input type="hidden" name="theme" value={theme === "light" ? "dark" : "light"} />
				<Button className="fixed right-2 bottom-2" size="icon" variant="outline">
					{theme === "light" ? <SunIcon /> : <MoonIcon />}
				</Button>
			</themeFetcher.Form>
			<Outlet />
		</>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		console.error("CatchBoundary", error);
		switch (error.status) {
			case 404: {
				return <Error status={error.status} statusText={"Oops, the page you are looking for could not be found."} />;
			}
			default: {
				return <Error status={error.status} statusText={error.statusText} />;
			}
		}
	}

	console.error(error);
	return <Error status={500} statusText="Oops, something did not go well." />;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const theme = await getTheme(request);
	return json({ theme });
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];
