import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { getUserGreeting } from "./helpers";
import {
	SearchUsersInputSchema,
	StatsPeriodSchema,
	UserProfileUpdateSchema,
} from "./schemas";
import {
	fetchUserStats,
	getUserMe,
	searchUsers,
	updateUserProfile,
} from "./server";

async function getValidToken() {
	const { useAppSession } = await import("@/lib/session.server");
	const session = await useAppSession();
	let accessToken = session.data.access_token;
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

	const { error } = await supabase.auth.getUser(accessToken);
	if (error?.status === 401 && session.data.refresh_token) {
		const { data } = await supabase.auth.refreshSession({
			refresh_token: session.data.refresh_token,
		});
		if (data?.session) {
			accessToken = data.session.access_token;
			await session.update({
				access_token: accessToken,
				refresh_token: data.session.refresh_token,
			});
		}
	}
	return accessToken;
}

export const getUserMeFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const token = await getValidToken();
		return getUserMe(token);
	});

export const getUserGreetingFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const me = await getUserMeFn();
		return getUserGreeting(me.name);
	});

export const fetchUserStatsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ period: StatsPeriodSchema.optional() }))
	.handler(({ data }) => fetchUserStats(data.period ?? "weekly"));

export const searchUsersFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(SearchUsersInputSchema)
	.handler(({ data }) => searchUsers(data));

export const updateUserProfileFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(UserProfileUpdateSchema)
	.handler(({ data }) => updateUserProfile(data));
