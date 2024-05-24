import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.THEME_SECRET, "THEME_SECRET must be set");

export const themeKeys = ["dark", "light"] as const;
export type Theme = (typeof themeKeys)[number];

export const {
	commitSession,
	destroySession,
	getSession: getSessionFromCookie,
} = createCookieSessionStorage<{ theme: Theme }>({
	cookie: {
		name: "remix-weather__session",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: [process.env.THEME_SECRET],
		secure: process.env.NODE_ENV === "production",
	},
});

export function getSession(request: Request) {
	const cookie = request.headers.get("Cookie");
	return getSessionFromCookie(cookie);
}

export async function getTheme(request: Request) {
	const session = await getSession(request);
	return session.get("theme");
}

export function isValidTheme(theme: string): theme is Theme {
	return themeKeys.includes(theme as Theme);
}
