import { IconMoon, IconRouter, IconServer, IconShield, IconSun } from "@tabler/icons-react";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/common/theme-provider";
import { PixelBackground } from "@/components/decorations/pixel-background";
import { AppLogo } from "@/components/layout/app-logo";
import { PageHeader } from "@/components/layout/page-header";
import { SITE_CONFIG } from "@/configs/site";
import { cn } from "@/lib/utils";

interface IAuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
}

export const AuthLayout = ({
	children,
	title,
	description,
}: IAuthLayoutProps) => {
	return (
		<div className="flex min-h-svh w-full">
			<AuthBrandPanel />
			<AuthFormPanel title={title} description={description}>
				{children}
			</AuthFormPanel>
		</div>
	);
};

const AuthBrandPanel = () => {
	return (
		<aside className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex border-r border-dashed">
			<div className="relative flex flex-col gap-12">
				<div className="flex items-center justify-between">
					<AppLogo />
					<ThemeToggleButton />
				</div>

				<div className="flex flex-col gap-4">
					<div className="size-1.5 bg-primary" />
					<h1 className="max-w-sm font-heading text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground">
						{SITE_CONFIG.app.slogan}
					</h1>
					<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
						254 questions across 8 CCNA domains. Practice, track, and master
						every topic for exam success.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 border-t border-l border-dashed">
				<BrandFeature icon={IconRouter} label="254 Questions" />
				<BrandFeature icon={IconServer} label="8 Domains" />
				<BrandFeature icon={IconShield} label="Topic Quizzes" />
				<BrandFeature icon={IconRouter} label="Mixed Exam" />
			</div>
		</aside>
	);
};

const BrandFeature = ({
	icon: Icon,
	label,
}: {
	icon: typeof IconRouter;
	label: string;
}) => {
	return (
		<div className="flex items-center gap-3 border-r border-b border-dashed p-4">
			<Icon className="size-4 shrink-0 text-primary" />
			<span className="text-xs font-medium text-foreground">{label}</span>
		</div>
	);
};

const AuthFormPanel = ({
	children,
	title,
	description,
}: {
	children: React.ReactNode;
	title: string;
	description: string;
}) => {
	return (
		<main className="flex flex-1 flex-col bg-background">
			<PixelBackground
				className="flex flex-1 flex-col"
				gap={8}
				speed={15}
				pattern="cursor"
				darkColors="#1e1e2e,#313244,#45475a"
				lightColors="#e6e9ef,#ccd0da,#bcc0cc"
			>
				<div className="flex h-full w-full flex-col">
					<div className="flex items-center justify-between px-6 py-5 lg:hidden">
						<AppLogo />
					</div>
					<div className="flex flex-1 items-center justify-center px-6 py-12">
						<div className="w-full max-w-sm">
							<PageHeader title={title} description={description} />
							<div className="mt-6">{children}</div>
						</div>
					</div>
				</div>
			</PixelBackground>
		</main>
	);
};

const ThemeToggleButton = () => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted ? resolvedTheme === "dark" : undefined;

	return (
		<div className="flex items-center border border-dashed bg-background">
			<button
				type="button"
				onClick={() => setTheme("light")}
				className={cn(
					"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors",
					mounted && !isDark
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				<IconSun className="size-3.5" />
				Light
			</button>
			<div className="border-l border-dashed self-stretch" />
			<button
				type="button"
				onClick={() => setTheme("dark")}
				className={cn(
					"flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors",
					mounted && isDark
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				<IconMoon className="size-3.5" />
				Dark
			</button>
		</div>
	);
};
