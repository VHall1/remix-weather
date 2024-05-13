import { createCookieSessionStorage } from "@remix-run/node";

export const themeKeys = ["dark", "light"] as const;
export type Theme = (typeof themeKeys)[number];

export const themeStorage = createCookieSessionStorage<{ theme: Theme }>({
	cookie: {
		name: "remix-weather__theme",
		sameSite: "lax",
		path: "/",
		secure: process.env.NODE_ENV === "production",
	},
});

export function getThemeSession(request: Request) {
	const cookie = request.headers.get("Cookie");
	return themeStorage.getSession(cookie);
}

export async function getTheme(request: Request) {
	const session = await getThemeSession(request);
	return session.get("theme");
}
