import type * as React from "react";

export interface IPageHeaderProps {
	icon?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	render?: () => React.ReactNode;
}

export const PageHeader = ({
	icon,
	description,
	render,
	title,
}: IPageHeaderProps) => {
	if (render) return render();
	if (!title && !description) return null;

	return (
		<div className="flex flex-col">
			{title && (
				<div className="flex items-center gap-2 border border-b-0 border-dashed border-border bg-secondary px-4 py-2 w-fit">
					{icon && <span className="text-primary">{icon}</span>}
					<h1 className="font-heading font-semibold uppercase tracking-tight text-foreground">
						{title}
					</h1>
				</div>
			)}
			{description && (
				<div className="border border-dashed border-border p-4 bg-background">
					<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				</div>
			)}
		</div>
	);
};
