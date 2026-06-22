import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { SaveAttemptSchema } from "./schemas";
import { getAttemptResults, getAttempts, saveAttempt } from "./server";

async function getAuth() {
	const { useAppSession } = await import("@/lib/session.server");
	const session = await useAppSession();
	let accessToken = session.data.access_token;
	const refreshToken = session.data.refresh_token;
	if (!accessToken) throw new Error("Not authenticated");

	const sb = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
		},
	);

	const { data: userData, error } = await sb.auth.getUser(accessToken);

	if ((error || !userData?.user) && refreshToken) {
		const { data: rd, error: re } = await sb.auth.refreshSession({ refresh_token: refreshToken });
		if (!re && rd?.session) {
			accessToken = rd.session.access_token;
			await session.update({ access_token: accessToken, refresh_token: rd.session.refresh_token });
			const retry = await sb.auth.getUser(accessToken);
			if (retry.error || !retry.data?.user) throw new Error("Session expired");
			return { accessToken, userId: retry.data.user.id };
		}
	}

	if (error || !userData?.user) throw error ?? new Error("Not authenticated");
	return { accessToken, userId: userData.user.id };
}

export const saveAttemptFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(SaveAttemptSchema)
	.handler(async ({ data }) => {
		const { accessToken, userId } = await getAuth();
		return saveAttempt(accessToken, userId, data);
	});

export const getAttemptsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const { accessToken, userId } = await getAuth();
		return getAttempts(accessToken, userId);
	});

export const getAttemptResultsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ attemptId: z.string() }))
	.handler(async ({ data }) => {
		const { accessToken } = await getAuth();
		return getAttemptResults(accessToken, data.attemptId);
	});
