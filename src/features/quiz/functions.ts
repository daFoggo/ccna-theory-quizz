import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { getAttemptResults, getAttempts, saveAttempt } from "./server";
import { SaveAttemptSchema } from "./schemas";

async function getAuth() {
	const { useAppSession } = await import("@/lib/session.server");
	const session = await useAppSession();
	const accessToken = session.data.access_token;
	if (!accessToken) throw new Error("Not authenticated");

	const supabase = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
			global: { headers: { Authorization: `Bearer ${accessToken}` } },
		},
	);

	const { data: userData, error } = await supabase.auth.getUser(accessToken);
	if (error || !userData.user) throw new Error("Not authenticated");

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
