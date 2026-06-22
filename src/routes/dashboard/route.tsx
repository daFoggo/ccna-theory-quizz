import { IconLogout } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
	useNavigate,
} from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app/header";
import type { IAppBreadcrumbItem } from "@/components/layout/app/header/breadcrumbs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthMutations } from "@/features/auth";
import { userMeQueryOptions } from "@/features/users";
import { deleteAuthToken } from "@/lib/auth-token";
import { getErrorMessage } from "@/lib/error";

const getBreadcrumbsFromMatches = (
	matches: ReturnType<typeof useMatches>,
): IAppBreadcrumbItem[] => {
	const filtered = matches.filter((match) => {
		const staticData = match.staticData;
		if (!staticData) return false;
		if (match.pathname === "/dashboard") return false;
		return staticData.getTitle || staticData.header?.title;
	});

	const items: IAppBreadcrumbItem[] = filtered.map((match, index) => {
		const staticData = match.staticData;
		let title = "";

		if (staticData?.header?.title) {
			title =
				typeof staticData.header.title === "function"
					? staticData.header.title()
					: staticData.header.title;
		} else if (staticData?.getTitle) {
			title = staticData.getTitle();
		}

		return {
			id: match.id,
			title,
			to: match.pathname,
			isCurrent: index === filtered.length - 1,
		};
	});

	return items;
};

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ location }) => {
		const { getAuthToken, refreshAuthToken } = await import("@/lib/auth-token");
		let token = await getAuthToken();
		if (!token) {
			throw redirect({
				to: "/auth/sign-in",
				search: { redirect: location.href },
			});
		}
		// Preemptively refresh if token might be expired
		try {
			const refreshed = await refreshAuthToken({ clearOnFailure: false });
			if (refreshed) token = refreshed;
		} catch {
			// Refresh failed — let user proceed, loader will handle
		}
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(userMeQueryOptions());
	},
	component: DashboardLayout,
});

function DashboardLayout() {
	const navigate = useNavigate();
	const matches = useMatches();
	const { data: currentUser } = useSuspenseQuery(userMeQueryOptions());
	const { signOut: logoutMutation } = useAuthMutations();
	const breadcrumbs = getBreadcrumbsFromMatches(matches);
	const hideHeader = matches.some((m) => m.staticData.hideHeader);

	const handleLogout = async () => {
		try {
			await logoutMutation.mutateAsync();
			await deleteAuthToken();
			toast.success("Logged out successfully");
			navigate({ to: "/auth/sign-in" });
		} catch (error) {
			toast.error(getErrorMessage(error, "Logout failed. Please try again."));
		}
	};

	return (
		<SidebarProvider
			className="flex flex-col h-svh w-full overflow-hidden bg-background"
			style={{ "--header-height": "3rem" } as React.CSSProperties}
		>
			{!hideHeader && (
				<AppHeader
					to="/dashboard"
					breadcrumbs={breadcrumbs}
					user={{
						name: currentUser.name,
						email: currentUser.email,
						avatarUrl: currentUser.avatar_url,
					}}
					accountActions={[
						{
							label: "Log out",
							icon: IconLogout,
							onSelect: handleLogout,
							isLoading: logoutMutation.isPending,
							disabled: logoutMutation.isPending,
							variant: "destructive",
						},
					]}
				/>
			)}

			<SidebarInset className="h-full min-w-0 bg-background overflow-y-auto">
				<main className="mx-auto w-full px-4 py-6 lg:px-6 xl:px-10">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
