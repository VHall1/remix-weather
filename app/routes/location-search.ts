import { parseWithZod } from "@conform-to/zod";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { getLocations } from "~/services/location.server";

const schema = z.object({
	q: z.string(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const params = new URL(request.url).searchParams;
	const submission = parseWithZod(params, { schema });

	let locations: Awaited<ReturnType<typeof getLocations>> = [];
	if (submission.status !== "success") {
		return { locations };
	}

	try {
		locations = await getLocations(submission.value.q);
	} catch (error) {
		console.error(error);
		return { locations };
	}

	return { locations };
};
