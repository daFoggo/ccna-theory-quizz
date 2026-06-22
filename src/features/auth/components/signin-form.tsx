import {
	IconArrowRight,
	IconBrandGoogle,
	IconLoader2,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage } from "@/lib/error";
import { supabase } from "@/utils/supabase";
import { useAuthMutations } from "../queries";
import { SignInSchema, type TSignInResponse } from "../schemas";

interface ISignInFormProps {
	redirect?: string;
}

export const SignInForm = ({ redirect }: ISignInFormProps) => {
	const navigate = useNavigate();
	const { signIn: signInMutation } = useAuthMutations();

	const navigateAfterAuth = (response: TSignInResponse) => {
		if (!response.user_info.profile_completed) {
			navigate({ to: "/dashboard" });
			return;
		}
		if (redirect) {
			try {
				const url = new URL(redirect, window.location.origin);
				if (url.origin === window.location.origin) {
					navigate({ to: url.pathname + url.search });
				} else {
					window.location.href = redirect;
				}
			} catch {
				navigate({ to: redirect });
			}
		} else {
			navigate({ to: "/dashboard" });
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
			if (error) {
				toast.error(getErrorMessage(error, "Google sign in failed."));
			}
		} catch (error) {
			toast.error(getErrorMessage(error, "Google sign in failed."));
		}
	};

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: SignInSchema },
		onSubmit: async ({ value }) => {
			try {
				const response = await signInMutation.mutateAsync(value);
				localStorage.setItem("expiration", response.expiration);
				localStorage.setItem("refresh_expiration", response.refresh_expiration);
				toast.success("Signed in successfully");
				navigateAfterAuth(response);
			} catch (error) {
				toast.error(
					getErrorMessage(error, "Sign in failed. Please try again."),
				);
				console.error(error);
			}
		},
	});

	return (
		<div className="flex flex-col gap-6">
			<Button type="button" className="w-full" onClick={handleGoogleLogin}>
				<IconBrandGoogle data-icon="inline-start" />
				<span>Continue with Google</span>
			</Button>
			<div className="flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-xs text-muted-foreground">or with email</span>
				<Separator className="flex-1" />
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-5"
			>
				<FieldGroup className="gap-4">
					<form.Field
						name="email"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !!field.state.meta.errors.length;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="name@example.com"
										type="email"
										aria-invalid={isInvalid}
										autoComplete="username"
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					/>
					<form.Field
						name="password"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !!field.state.meta.errors.length;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="password"
										aria-invalid={isInvalid}
										autoComplete="current-password"
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					/>
				</FieldGroup>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							className="w-full font-semibold"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? (
								<>
									<span>Processing</span>
									<IconLoader2
										className="animate-spin"
										data-icon="inline-end"
									/>
								</>
							) : (
								<>
									<span>Sign in</span>
									<IconArrowRight data-icon="inline-end" />
								</>
							)}
						</Button>
					)}
				/>
			</form>
			<p className="text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Link
					to="/auth/sign-up"
					className="font-medium text-primary transition-colors hover:underline hover:underline-offset-4"
				>
					Create one
				</Link>
			</p>
		</div>
	);
};
