import { useMatches } from "@tanstack/react-router";
import type * as React from "react";
import {
	type IPageHeaderProps,
	PageHeader,
} from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export type { IPageHeaderProps as IAppPageHeaderConfig };

type AppPageHeaderConfig = IPageHeaderProps;

interface IAppPageContainerProps extends React.ComponentProps<"div"> {
	fixedHeight?: boolean;
	header?: AppPageHeaderConfig | React.ReactNode;
	hideHeader?: boolean;
	size?: "small" | "default" | "large" | "full";
}

const pageContainerMaxWidth = {
	small: "max-w-192",
	default: "max-w-300",
	large: "max-w-400",
	full: "max-w-none",
};

const isPageHeaderConfig = (
	value: IAppPageContainerProps["header"],
): value is AppPageHeaderConfig => {
	return (
		!!value &&
		typeof value === "object" &&
		("title" in value ||
			"description" in value ||
			"actions" in value ||
			"render" in value)
	);
};

export const AppPageContainer = ({
	children,
	className,
	fixedHeight,
	header,
	hideHeader,
	size = "default",
	...props
}: IAppPageContainerProps) => {
	const matches = useMatches();
	const staticHeader = [...matches]
		.reverse()
		.find((match) => match.staticData.pageHeader)?.staticData.pageHeader;
	const pageHeader = header ?? staticHeader;
	const renderedHeader =
		!hideHeader &&
		(isPageHeaderConfig(pageHeader) ? (
			<AppPageHeader {...pageHeader} />
		) : (
			pageHeader
		));

	return (
		<section
			className={cn(
				"flex min-h-full w-full flex-col items-stretch",
				fixedHeight && "h-full min-h-0",
			)}
			{...props}
		>
			{renderedHeader && (
				<div
					className={cn(
						"mx-auto w-full px-4 pt-6 lg:px-6 xl:px-10",
						pageContainerMaxWidth[size],
					)}
				>
					{renderedHeader}
				</div>
			)}

			<div
				className={cn(
					"mx-auto flex w-full grow px-4 lg:px-6 xl:px-10",
					pageContainerMaxWidth[size],
					className,
				)}
			>
				<div
					className={cn(
						"flex w-full flex-col",
						renderedHeader ? "pt-8 pb-6" : "py-6",
						fixedHeight && "h-full min-h-0",
					)}
				>
					{children}
				</div>
			</div>
		</section>
	);
};

export const AppPageHeader = PageHeader;
