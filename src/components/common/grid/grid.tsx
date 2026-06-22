import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Border-grid primitives (Layer 0).
 *
 * Dashed border-grid for macro section separators. The container owns the
 * top + left edges and every cell owns its bottom + right edge, so any column
 * count renders a clean, non-overlapping dashed grid without per-column
 * `nth-child` overrides. For cohesive component containers use shadcn Card
 * (Layer 1); for inline row dividers use divide-y or BorderList (Layer 2).
 */

const gridCols = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export interface IBorderGridProps extends React.ComponentProps<"div"> {
	cols?: keyof typeof gridCols;
}

export function BorderGrid({
	cols = 2,
	className,
	...props
}: IBorderGridProps) {
	return (
		<div
			data-slot="border-grid"
			className={cn(
				"grid grid-cols-1 border-t border-l border-dashed border-border",
				gridCols[cols],
				className,
			)}
			{...props}
		/>
	);
}

const cellPad = {
	none: "",
	default: "p-6",
	compact: "p-4",
	tight: "px-4 py-3",
} as const;

const cellTone = {
	default: "",
	muted: "bg-secondary",
} as const;

const cellColSpan = {
	1: "",
	2: "lg:col-span-2",
	3: "lg:col-span-3",
	4: "lg:col-span-4",
} as const;

export interface IBorderGridCellProps extends React.ComponentProps<"div"> {
	colSpan?: 1 | 2 | 3 | 4;
	pad?: keyof typeof cellPad;
	tone?: keyof typeof cellTone;
}

export function BorderGridCell({
	colSpan = 1,
	pad = "default",
	tone = "default",
	className,
	...props
}: IBorderGridCellProps) {
	return (
		<div
			data-slot="border-grid-cell"
			className={cn(
				"border-b border-r border-dashed border-border",
				cellColSpan[colSpan],
				cellPad[pad],
				cellTone[tone],
				className,
			)}
			{...props}
		/>
	);
}

export interface IBorderSectionHeaderProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
}

export function BorderSectionHeader({
	title,
	description,
	actions,
	className,
	...props
}: IBorderSectionHeaderProps) {
	return (
		<div
			data-slot="border-section-header"
			className={cn("mb-4 flex items-start justify-between gap-4", className)}
			{...props}
		>
			<div className="flex flex-col gap-1">
				<h2 className="font-heading text-base font-semibold tracking-tight">
					{title}
				</h2>
				{description && (
					<span className="text-sm text-muted-foreground">{description}</span>
				)}
			</div>
			{actions && (
				<div className="flex shrink-0 items-center gap-2">{actions}</div>
			)}
		</div>
	);
}

export function BorderList({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="border-list"
			className={cn(
				"flex flex-col border-t border-l border-dashed border-border",
				className,
			)}
			{...props}
		/>
	);
}

export interface IBorderListItemProps extends React.ComponentProps<"div"> {
	pad?: keyof typeof cellPad;
	tone?: keyof typeof cellTone;
}

export function BorderListItem({
	pad = "compact",
	tone = "default",
	className,
	...props
}: IBorderListItemProps) {
	return (
		<div
			data-slot="border-list-item"
			className={cn(
				"border-b border-r border-dashed border-border",
				cellPad[pad],
				cellTone[tone],
				className,
			)}
			{...props}
		/>
	);
}

export interface IBorderPanelProps extends React.ComponentProps<"div"> {
	header?: React.ReactNode;
	bodyPad?: keyof typeof cellPad;
}

/**
 * Single boxed dashed section — use sparingly for standalone callouts.
 * Prefer BorderGrid for multi-section pages or Card for component containers.
 * Optional header row is divided from the body by a dashed border.
 */
export function BorderPanel({
	header,
	bodyPad = "default",
	className,
	children,
	...props
}: IBorderPanelProps) {
	return (
		<div
			data-slot="border-panel"
			className={cn(
				"flex flex-col border border-dashed border-border",
				className,
			)}
			{...props}
		>
			{header && (
				<div className="border-b border-dashed border-border p-6">{header}</div>
			)}
			<div className={cellPad[bodyPad]}>{children}</div>
		</div>
	);
}

export function BorderPanelHeader({
	title,
	description,
	actions,
	className,
}: Pick<IBorderSectionHeaderProps, "title" | "description" | "actions"> & {
	className?: string;
}) {
	return (
		<div
			data-slot="border-panel-header"
			className={cn("flex items-start justify-between gap-4", className)}
		>
			<div className="flex flex-col gap-1">
				<h2 className="font-heading text-base font-semibold tracking-tight">
					{title}
				</h2>
				{description && (
					<span className="text-sm text-muted-foreground">{description}</span>
				)}
			</div>
			{actions && (
				<div className="flex shrink-0 items-center gap-2">{actions}</div>
			)}
		</div>
	);
}
