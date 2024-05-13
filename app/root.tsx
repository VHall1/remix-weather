import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetcher,
	useLoaderData,
	useLocation,
} from "@remix-run/react";
import { MoonIcon, SunIcon } from "lucide-react";
import stylesheet from "~/tailwind.css?url";
import { Button } from "./components/ui/button";
import { getTheme } from "./services/theme.server";
import { cn } from "./utils/cn";

export function Layout({ children }: { children: React.ReactNode }) {
	const { theme } = useLoaderData<typeof loader>();

	return (
		<html lang="en" className={cn({ dark: theme !== "light" })}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const theme = await getTheme(request);
	return json({ theme });
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];
