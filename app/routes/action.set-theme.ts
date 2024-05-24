import type { ActionFunctionArgs } from "@remix-run/node";
import { getThemeSession, isValidTheme, themeStorage } from "~/services/theme.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const theme = formData.get("theme")?.toString();
	if (!theme || !isValidTheme(theme)) return null;
	const session = await getThemeSession(request);
	session.set("theme", theme);
	return new Response(null, {
		headers: { "Set-Cookie": await themeStorage.commitSession(session) },
	});
};
