import { IconSlash } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/common/theme-provider/theme-toggle";
import { AppLogo } from "@/components/layout/app-logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AccountMenu, type IAccountMenuAction } from "./account-menu";
import { AppBreadcrumbs, type IAppBreadcrumbItem } from "./breadcrumbs";

interface IAppHeaderUser {
	name: string;
	email?: string | null;
	avatarUrl?: string | null;
}

interface IAppHeaderProps {
	to: string;
	breadcrumbs: IAppBreadcrumbItem[];
	user?: IAppHeaderUser;
	isUserLoading?: boolean;
	isUserError?: boolean;
	userErrorMessage?: string;
	accountActions?: IAccountMenuAction[];
}

export const AppHeader = ({
	to,
	breadcrumbs,
	user,
	isUserLoading = false,
	isUserError = false,
	userErrorMessage,
	accountActions = [],
}: IAppHeaderProps) => {
	const { isMobile, openMobile } = useSidebar();
	const hasBreadcrumbs = breadcrumbs.length > 0;

	return (
		<header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 select-none">
			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-1 md:flex">
					<Link
						// biome-ignore lint/suspicious/noExplicitAny: router type bypass for dynamic brand link
						to={to as any}
						className="transition-opacity hover:opacity-85"
					>
						<AppLogo size="sm" />
					</Link>
					{hasBreadcrumbs && (
						<>
							<IconSlash className="size-4 text-muted-foreground/40 shrink-0" />
							<AppBreadcrumbs items={breadcrumbs} />
						</>
					)}
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<Link
						// biome-ignore lint/suspicious/noExplicitAny: router type bypass for dynamic brand link
						to={to as any}
					>
						<AppLogo size="xs" />
					</Link>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />

				<AccountMenu
					user={user}
					isLoading={isUserLoading}
					isError={isUserError}
					errorMessage={userErrorMessage}
					actions={accountActions}
					triggerVariant="header"
				/>

				<div className={cn("md:hidden", isMobile && openMobile && "hidden")}>
					<SidebarTrigger size="icon-sm" variant="outline" />
				</div>
			</div>
		</header>
	);
};
