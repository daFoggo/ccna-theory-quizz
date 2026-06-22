import { SITE_CONFIG } from "@/configs/site";
import { cn } from "@/lib/utils";
import { IconRouter } from "@tabler/icons-react";

interface IAppLogoProps {
	className?: string;
	hideIcon?: boolean;
	hideTitle?: boolean;
	size?: "xs" | "sm" | "default";
}
export const AppLogo = ({
	className,
	hideIcon,
	hideTitle,
	size = "default",
}: IAppLogoProps) => {
	const iconSize =
		size === "xs" ? "size-4.5!" : size === "sm" ? "size-5!" : "size-6!";
	const titleSize =
		size === "xs"
			? "text-sm font-semibold"
			: size === "sm"
				? "text-base"
				: "text-2xl";

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{!hideIcon && <IconRouter className={iconSize} />}
			{!hideTitle && (
				<span className={cn("font-logo font-semibold", titleSize)}>
					{SITE_CONFIG.app.title}
				</span>
			)}
		</div>
	);
};
