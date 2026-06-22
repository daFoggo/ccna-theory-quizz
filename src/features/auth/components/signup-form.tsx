import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";
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
import { getErrorMessage } from "@/lib/error";
import { useAuthMutations } from "../queries";
import {
	SignUpFormSchema,
	type TSignUpFormInput,
	type TSignUpInput,
} from "../schemas";

export const SignUpForm = () => {
	const navigate = useNavigate();
	const { signUp: signUpMutation } = useAuthMutations();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			avatar_url: "",
		} as TSignUpFormInput,
		validators: {
			onSubmit: SignUpFormSchema,
		},
		onSubmit: async ({ value }) => {
			const { avatar_url, confirmPassword, ...rest } = value;
			const data: TSignUpInput = {
				...rest,
				avatar_url: avatar_url || undefined,
			};
			try {
				await signUpMutation.mutateAsync(data);
				toast.success("Registration successful! Please sign in.");
				navigate({ to: "/auth/sign-in" });
			} catch (error) {
				console.error("Mutation failed:", error);
				toast.error(
					getErrorMessage(error, "Registration failed. Please try again."),
				);
			}
		},
	});

	return (
		<div className="flex flex-col gap-6">
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
						name="name"
						// biome-ignore lint/correctness/noChildrenProp: TanStack Form render-prop pattern
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !!field.state.meta.errors.length;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Full name</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Jane Doe"
										aria-invalid={isInvalid}
										autoComplete="name"
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					/>

					<form.Field
						name="email"
						// biome-ignore lint/correctness/noChildrenProp: TanStack Form render-prop pattern
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
						// biome-ignore lint/correctness/noChildrenProp: TanStack Form render-prop pattern
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
										autoComplete="new-password"
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					/>

					<form.Field
						name="confirmPassword"
						// biome-ignore lint/correctness/noChildrenProp: TanStack Form render-prop pattern
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !!field.state.meta.errors.length;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="password"
										aria-invalid={isInvalid}
										autoComplete="new-password"
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					/>
				</FieldGroup>

				<p className="text-xs text-muted-foreground">
					By signing up, you agree to our{" "}
					<Link
						to="/"
						className="font-medium text-primary transition-colors hover:underline hover:underline-offset-4"
					>
						Terms
					</Link>{" "}
					and{" "}
					<Link
						to="/"
						className="font-medium text-primary transition-colors hover:underline hover:underline-offset-4"
					>
						Privacy Policy
					</Link>
					.
				</p>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					// biome-ignore lint/correctness/noChildrenProp: TanStack Form render-prop pattern
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
									<span>Create account</span>
									<IconArrowRight data-icon="inline-end" />
								</>
							)}
						</Button>
					)}
				/>
			</form>

			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link
					to="/auth/sign-in"
					className="font-medium text-primary transition-colors hover:underline hover:underline-offset-4"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
};
