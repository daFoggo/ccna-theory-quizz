import {
	IconAlertTriangle,
	IconBrandTelegram,
	IconLoader2,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppLogo } from "@/components/layout/app-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthMutations } from "@/features/auth";
import type { TSignInResponse } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/error";

const telegramSearchSchema = z.object({
	code: z.string().optional(),
	state: z.string().optional(),
	error: z.string().optional(),
	error_description: z.string().optional(),
	id: z.string().optional(),
	auth_date: z.string().optional(),
	hash: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	photo_url: z.string().optional(),
	phone_number: z.string().optional(),
	redirect: z.string().optional(),
});

const telegramCallbackPromises = new Map<
	string,
	Promise<{ response: TSignInResponse; redirect?: string }>
>();

export const Route = createFileRoute("/auth/telegram")({
	validateSearch: telegramSearchSchema,
	component: TelegramAuthCallbackPage,
});

function TelegramAuthCallbackPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { signInWithTelegram } = useAuthMutations();
	const [callbackError, setCallbackError] = useState<string | null>(null);
	const settledCallbackRef = useRef<string | null>(null);

	useEffect(() => {
		const hasCodePayload = Boolean(search.code && search.state);
		const hasLegacyPayload = Boolean(
			search.id && search.auth_date && search.hash,
		);
		if (search.error || (!hasCodePayload && !hasLegacyPayload)) return;

		const callbackKey = search.code
			? `${search.code}:${search.state}`
			: `${search.id}:${search.auth_date}:${search.hash}`;
		if (settledCallbackRef.current === callbackKey) return;

		let cancelled = false;

		async function exchangeCallback() {
			let redirect = search.redirect;

			if (hasCodePayload) {
				const loginState = readTelegramLoginState();
				redirect = loginState?.redirect || redirect;

				if (
					!loginState ||
					loginState.state !== search.state ||
					isExpiredLoginState(loginState.createdAt)
				) {
					throw new Error("Invalid Telegram login state. Please try again.");
				}

				const response = await signInWithTelegram.mutateAsync({
					code: search.code,
					redirect_uri: `${window.location.origin}/auth/telegram`,
					code_verifier: loginState.codeVerifier,
				});

				clearTelegramLoginState();
				return { response, redirect };
			}

			if (!search.id || !search.auth_date || !search.hash) {
				throw new Error("Missing Telegram login payload. Please try again.");
			}

			const response = await signInWithTelegram.mutateAsync({
				id: search.id,
				auth_date: search.auth_date,
				hash: search.hash,
				first_name: search.first_name,
				last_name: search.last_name,
				username: search.username,
				photo_url: search.photo_url,
				phone_number: search.phone_number,
			});
			return { response, redirect };
		}

		const existingCallback = telegramCallbackPromises.get(callbackKey);
		const callbackPromise = existingCallback || exchangeCallback();
		if (!existingCallback) {
			telegramCallbackPromises.set(callbackKey, callbackPromise);
			callbackPromise.then(
				() => telegramCallbackPromises.delete(callbackKey),
				() => telegramCallbackPromises.delete(callbackKey),
			);
		}

		callbackPromise
			.then(({ response, redirect }) => {
				if (cancelled) return;
				settledCallbackRef.current = callbackKey;
				localStorage.setItem("expiration", response.expiration);
				localStorage.setItem("refresh_expiration", response.refresh_expiration);
				toast.success("Signed in with Telegram");
				navigate({
					to: response.user_info.profile_completed
						? redirect || "/dashboard"
						: "/dashboard",
				});
			})
			.catch((error) => {
				if (cancelled) return;
				settledCallbackRef.current = callbackKey;
				const message = getErrorMessage(
					error,
					"Telegram sign in failed. Please try again.",
				);
				setCallbackError(message);
				toast.error(message);
			});

		return () => {
			cancelled = true;
		};
	}, [navigate, search, signInWithTelegram]);

	const hasPayload = Boolean(
		(search.code && search.state) ||
			(search.id && search.auth_date && search.hash),
	);
	const errorMessage =
		callbackError ||
		search.error_description ||
		search.error ||
		"Telegram sign in was cancelled.";

	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
			<div className="mb-8">
				<AppLogo />
			</div>
			<div className="w-full max-w-sm">
				{search.error || callbackError ? (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconBrandTelegram className="size-5" />
							<span className="text-sm font-medium">Telegram sign in</span>
						</div>
						<Alert variant="destructive">
							<IconAlertTriangle />
							<AlertTitle>Sign in failed</AlertTitle>
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					</div>
				) : hasPayload ? (
					<div className="flex flex-col items-center gap-4 py-8">
						<IconLoader2 className="size-6 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">
							Verifying your Telegram account
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconBrandTelegram className="size-5" />
							<span className="text-sm font-medium">Telegram sign in</span>
						</div>
						<Alert variant="destructive">
							<IconAlertTriangle />
							<AlertTitle>Missing payload</AlertTitle>
							<AlertDescription>
								Open this page from a Telegram login button.
							</AlertDescription>
						</Alert>
					</div>
				)}
			</div>
		</div>
	);
}

interface ITelegramLoginState {
	state: string;
	codeVerifier: string;
	redirect?: string;
	createdAt?: number;
}

function readTelegramLoginState(): ITelegramLoginState | null {
	const raw =
		sessionStorage.getItem("telegram_oidc_login") ||
		localStorage.getItem("telegram_oidc_login");
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as Partial<ITelegramLoginState>;
		if (!parsed.state || !parsed.codeVerifier) return null;
		return {
			state: parsed.state,
			codeVerifier: parsed.codeVerifier,
			redirect:
				parsed.redirect ||
				sessionStorage.getItem("telegram_oidc_redirect") ||
				localStorage.getItem("telegram_oidc_redirect") ||
				undefined,
			createdAt: parsed.createdAt,
		};
	} catch {
		return null;
	}
}

function clearTelegramLoginState() {
	sessionStorage.removeItem("telegram_oidc_login");
	sessionStorage.removeItem("telegram_oidc_redirect");
	localStorage.removeItem("telegram_oidc_login");
	localStorage.removeItem("telegram_oidc_redirect");
}

function isExpiredLoginState(createdAt?: number) {
	if (!createdAt) return true;
	const maxAgeMs = 10 * 60 * 1000;
	return Date.now() - createdAt > maxAgeMs;
}
