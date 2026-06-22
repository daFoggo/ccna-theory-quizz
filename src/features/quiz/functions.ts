import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { SaveAttemptSchema } from "./schemas";
import {
	getAttemptResults,
	getAttempts,
	getStudiedCount,
	saveAttempt,
} from "./server";

async function getAuth() {
	const { useAppSession } = await import("@/lib/session.server");
	const session = await useAppSession();
	let accessToken = session.data.access_token;
	const refreshToken = session.data.refresh_token;
	if (!accessToken) throw new Error("Not authenticated");

	const supabase = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			},
			global: { headers: { Authorization: `Bearer ${accessToken}` } },
		},
	);

	const { data: userData, error } = await supabase.auth.getUser(accessToken);

	// Token expired — try refresh
	if (error?.status === 401 && refreshToken) {
		const { data: refreshData, error: refreshError } =
			await supabase.auth.refreshSession({ refresh_token: refreshToken });
		if (!refreshError && refreshData.session) {
			accessToken = refreshData.session.access_token;
			await session.update({
				access_token: accessToken,
				refresh_token: refreshData.session.refresh_token,
			});
			// Retry with new token
			const retryData = await supabase.auth.getUser(accessToken);
			if (retryData.error || !retryData.data.user)
				throw new Error("Session expired");
			return { accessToken, userId: retryData.data.user.id };
		}
	}

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

export const getStudiedCountFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const { accessToken, userId } = await getAuth();
		return getStudiedCount(accessToken, userId);
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
