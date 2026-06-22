import "@tanstack/react-start/server-only";
import { supabase } from "@/utils/supabase";
import type {
	TRefreshTokenInput,
	TSignInInput,
	TSignInResponse,
	TSignUpInput,
	TSignUpResponse,
	TTokenResponse,
} from "./schemas";

export async function signIn(params: TSignInInput): Promise<TSignInResponse> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: params.email,
		password: params.password,
	});
	if (error) throw error;
	if (!data.session) throw new Error("No session returned");

	const expiresAt =
		data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600;

	return {
		access_token: data.session.access_token,
		expiration: new Date(expiresAt * 1000).toISOString(),
		refresh_token: data.session.refresh_token,
		refresh_expiration: new Date(
			(expiresAt + 7 * 24 * 60 * 60) * 1000,
		).toISOString(),
		user_info: {
			id: data.user!.id,
			name:
				data.user!.user_metadata?.name ?? data.user!.email?.split("@")[0] ?? "",
			email: data.user!.email ?? null,
			avatar_url: data.user!.user_metadata?.avatar_url ?? "",
			created_at: data.user!.created_at,
			profile_completed: true,
		},
	};
}

export async function signUp(params: TSignUpInput): Promise<TSignUpResponse> {
	const { data, error } = await supabase.auth.signUp({
		email: params.email,
		password: params.password,
		options: {
			data: {
				name: params.name,
				...(params.avatar_url ? { avatar_url: params.avatar_url } : {}),
			},
		},
	});
	if (error) throw error;
	if (!data.user) throw new Error("Registration failed");

	return {
		id: data.user.id,
		name: data.user.user_metadata?.name ?? params.name,
		email: data.user.email ?? null,
		avatar_url: data.user.user_metadata?.avatar_url ?? "",
		created_at: data.user.created_at,
		profile_completed: true,
	};
}

export async function refreshToken(
	params: TRefreshTokenInput,
): Promise<TTokenResponse> {
	const { data, error } = await supabase.auth.refreshSession({
		refresh_token: params.refresh_token,
	});
	if (error) throw error;
	if (!data.session) throw new Error("Session refresh failed");

	const expiresAt =
		data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600;

	return {
		access_token: data.session.access_token,
		expiration: new Date(expiresAt * 1000).toISOString(),
		refresh_token: data.session.refresh_token,
		refresh_expiration: new Date(
			(expiresAt + 7 * 24 * 60 * 60) * 1000,
		).toISOString(),
	};
}
