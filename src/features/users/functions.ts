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

export const getUserMeFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const { useAppSession } = await import("@/lib/session.server");
		const session = await useAppSession();
		const accessToken = session.data.access_token;
		if (!accessToken) throw new Error("Not authenticated");
		return getUserMe(accessToken);
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
