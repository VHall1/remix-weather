import type { ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSession, isValidTheme } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const theme = formData.get("theme")?.toString();
	if (!theme || !isValidTheme(theme)) return null;
	const session = await getSession(request);
	session.set("theme", theme);
	return new Response(null, {
		headers: { "Set-Cookie": await commitSession(session) },
	});
};
