import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppLogo } from "@/components/layout/app-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exchangeSessionFn } from "@/features/auth";
import { getErrorMessage } from "@/lib/error";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/auth/callback")({
	component: AuthCallbackPage,
});

function AuthCallbackPage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function handleCallback() {
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (cancelled) return;

			if (sessionError) {
				setError(sessionError.message);
				return;
			}

			if (!session) {
				setError("No session returned. Please try signing in again.");
				return;
			}

			try {
				await exchangeSessionFn({
					data: {
						access_token: session.access_token,
						refresh_token: session.refresh_token,
					},
				});

				localStorage.setItem("expiration", String(session.expires_at ?? ""));
				localStorage.setItem(
					"refresh_expiration",
					String(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
				);

				toast.success("Signed in successfully");
				navigate({ to: "/dashboard" });
			} catch (err) {
				setError(
					getErrorMessage(err, "Failed to create session. Please try again."),
				);
			}
		}

		handleCallback();

		return () => {
			cancelled = true;
		};
	}, [navigate]);

	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
			<div className="mb-8">
				<AppLogo />
			</div>
			<div className="w-full max-w-sm">
				{error ? (
					<div className="flex flex-col gap-4">
						<Alert variant="destructive">
							<IconAlertTriangle />
							<AlertTitle>Sign in failed</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4 py-8">
						<IconLoader2 className="size-6 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">
							Completing your sign in
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
