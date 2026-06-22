import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/auth/auth-layout";
import { SignInForm } from "@/features/auth";

export const Route = createFileRoute("/auth/sign-in")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	component: SignInPage,
});

function SignInPage() {
	const { redirect } = Route.useSearch();

	return (
		<AuthLayout
			title="Welcome back"
			description="Sign in to continue your CCNA exam preparation."
		>
			<SignInForm redirect={redirect} />
		</AuthLayout>
	);
}
