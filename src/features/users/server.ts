import { createClient } from "@supabase/supabase-js";
import "@tanstack/react-start/server-only";
import type { z } from "zod";
import type {
	SearchUsersInputSchema,
	TStatsPeriod,
	TUser,
	TUserProfileUpdate,
	TUserSearchResult,
	TUserStats,
} from "./schemas";

export async function getUserMe(accessToken: string): Promise<TUser> {
	const supabase = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			},
		},
	);

	const { data, error } = await supabase.auth.getUser(accessToken);
	if (error) throw error;

	return {
		id: data.user.id,
		name: data.user.user_metadata?.name ?? data.user.email?.split("@")[0] ?? "",
		email: data.user.email ?? null,
		avatar_url: data.user.user_metadata?.avatar_url ?? "",
		created_at: data.user.created_at,
		profile_completed: true,
	};
}

export async function updateUserProfile(
	_params: TUserProfileUpdate,
): Promise<TUser> {
	throw new Error("Not implemented with Supabase yet");
}

export async function fetchUserStats(
	_period: TStatsPeriod = "weekly",
): Promise<TUserStats> {
	throw new Error("Not implemented with Supabase yet");
}

export async function searchUsers(
	_params: z.infer<typeof SearchUsersInputSchema>,
): Promise<TUserSearchResult[]> {
	throw new Error("Not implemented with Supabase yet");
}
