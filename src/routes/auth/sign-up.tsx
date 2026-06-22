import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth/auth-layout";
import { SignUpForm } from "@/features/auth";

export const Route = createFileRoute("/auth/sign-up")({
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<AuthLayout
			title="Create your account"
			description="Start your CCNA exam preparation journey."
		>
			<SignUpForm />
		</AuthLayout>
	);
}
