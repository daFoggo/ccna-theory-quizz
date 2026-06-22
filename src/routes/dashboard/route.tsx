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
import { AppPageContainer } from "@/components/layout/app/page-container";
import { AppSidebar } from "@/components/layout/app/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getSidebarGroups } from "@/constants/sidebar-navigation";
import { useAuthMutations } from "@/features/auth";
import { userMeQueryOptions } from "@/features/users";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteAuthToken } from "@/lib/auth-token";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";

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
		const { getAuthToken } = await import("@/lib/auth-token");
		const token = await getAuthToken();
		if (!token) {
			throw redirect({
				to: "/auth/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(userMeQueryOptions());
	},
	component: DashboardLayout,
	staticData: {
		getTitle: () => "Dashboard",
	},
});

function DashboardLayout() {
	const navigate = useNavigate();
	const matches = useMatches();
	const isMobile = useIsMobile();
	const isFixedHeight = matches.some((m) => m.staticData.fixedHeight);
	const pageContainerSize =
		[...matches].reverse().find((m) => m.staticData.pageContainerSize)
			?.staticData.pageContainerSize ?? "default";

	const hideSidebar = matches.some((m) => m.staticData.hideSidebar);
	const sidebarGroups = getSidebarGroups();
	const { data: currentUser } = useSuspenseQuery(userMeQueryOptions());
	const { signOut: logoutMutation } = useAuthMutations();
	const breadcrumbs = getBreadcrumbsFromMatches(matches);

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

			<div className="flex flex-1 min-h-0 w-full overflow-hidden bg-background">
				{!hideSidebar && (
					<AppSidebar
						groups={sidebarGroups}
						side={isMobile ? "right" : "left"}
						showDesktopToggle={!isMobile}
					/>
				)}

				<SidebarInset
					className={cn(
						"h-full min-w-0 bg-background",
						!isFixedHeight && "overflow-y-auto",
					)}
				>
					<main
						className={cn(
							"min-w-0 bg-background",
							isFixedHeight && "h-full overflow-hidden",
						)}
					>
						<AppPageContainer
							fixedHeight={isFixedHeight}
							size={pageContainerSize}
						>
							<Outlet />
						</AppPageContainer>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
