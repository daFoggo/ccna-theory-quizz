import {
	IconArrowRight,
	IconBox,
	IconColumns,
	IconInbox,
	IconLayoutGrid,
	IconSchema,
	IconSettings,
	IconTable,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderPanel,
	BorderPanelHeader,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/examples/")({
	staticData: {
		getTitle: () => "Style showcase",
		pageHeader: {
			title: "Style showcase",
			description:
				"Flat, dashed border-grid layout: dashed BorderGrid for section separators and BorderPanel for standalone boxed surfaces.",
		},
	},
	component: ExamplesHubPage,
});

const demos = [
	{
		to: "/dashboard/examples/crud-table",
		icon: IconTable,
		title: "CRUD table",
		description:
			"Filter bar, stat row, data table with selection, row actions and pagination.",
		tags: ["Table", "Dropdown", "Pagination", "Badge"],
	},
	{
		to: "/dashboard/examples/form",
		icon: IconSchema,
		title: "Sectioned form",
		description:
			"Create/edit form split into sectioned panels with a live preview column.",
		tags: ["Form", "Input", "Select", "Switch"],
	},
	{
		to: "/dashboard/examples/detail",
		icon: IconBox,
		title: "Detail view",
		description:
			"Master layout: main content sections plus a metadata sidebar.",
		tags: ["2-column", "Tabs", "Chart", "Avatar"],
	},
	{
		to: "/dashboard/examples/settings",
		icon: IconSettings,
		title: "Settings",
		description:
			"Line tabs switching between sectioned toggles and field groups.",
		tags: ["Tabs", "Switch", "Field"],
	},
	{
		to: "/dashboard/examples/inbox",
		icon: IconInbox,
		title: "Inbox / list-pane",
		description:
			"Two-pane master-detail with a filterable list and reader panel.",
		tags: ["2-pane", "List", "Search"],
	},
	{
		to: "/dashboard/examples/kanban",
		icon: IconColumns,
		title: "Kanban board",
		description: "Column-based board layout with lanes and cards.",
		tags: ["Columns", "Cards", "Badge"],
	},
];

function ExamplesHubPage() {
	return (
		<div className="flex flex-col gap-8">
			<BorderPanel
				header={
					<BorderPanelHeader
						title="How the layout system works"
						description="A flat blueprint-like aesthetic built on dashed borders and grids."
					/>
				}
			>
				<div className="flex flex-col gap-4 text-sm text-muted-foreground">
					<p>
						Borders are dashed at all container boundaries and grid cells to
						create structured sectioning, while sub-cells use subtle background
						fills and hover transitions for interactivity.
					</p>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<BuildingBlock
							label="BorderGrid"
							hint="Layout separators (dashed)"
							render={
								<div className="grid grid-cols-2 border-t border-l border-dashed border-border">
									<div className="border-b border-r border-dashed border-border p-3 text-xs text-muted-foreground">
										Section
									</div>
									<div className="border-b border-r border-dashed border-border p-3 text-xs text-muted-foreground">
										Section
									</div>
									<div className="border-b border-r border-dashed border-border p-3 text-xs text-muted-foreground">
										Section
									</div>
									<div className="border-b border-r border-dashed border-border p-3 text-xs text-muted-foreground">
										Section
									</div>
								</div>
							}
						/>
						<BuildingBlock
							label="BorderPanel"
							hint="Single boxed pane (dashed)"
							render={
								<div className="flex flex-col border border-dashed border-border">
									<div className="border-b border-dashed border-border p-3 text-xs font-medium text-foreground">
										Panel Header
									</div>
									<div className="p-3 text-xs text-muted-foreground">
										Panel body with dashed border
									</div>
								</div>
							}
						/>
						<BuildingBlock
							label="Sub-cells"
							hint="Interactive rows (fill)"
							render={
								<div className="flex flex-col border-t border-l border-dashed border-border text-xs text-muted-foreground">
									<div className="border-b border-r border-dashed border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors">
										Hover Cell
									</div>
									<div className="border-b border-r border-dashed border-border p-3">
										Default Cell
									</div>
								</div>
							}
						/>
					</div>
				</div>
			</BorderPanel>

			<div>
				<BorderSectionHeader
					title="Demos"
					description="Six layouts demonstrating the surface system in practice."
					actions={
						<Badge variant="outline" className="gap-1">
							<IconLayoutGrid className="size-3" data-icon="inline-start" />
							{demos.length} pages
						</Badge>
					}
				/>
				<BorderGrid cols={3}>
					{demos.map((demo) => (
						<DemoCell key={demo.to} {...demo} />
					))}
				</BorderGrid>
			</div>
		</div>
	);
}

function BuildingBlock({
	label,
	hint,
	render,
}: {
	label: string;
	hint: string;
	render: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-foreground">{label}</span>
				<span className="text-xs text-muted-foreground">{hint}</span>
			</div>
			{render}
		</div>
	);
}

type DemoCellProps = (typeof demos)[number];

function DemoCell({ to, icon: Icon, title, description, tags }: DemoCellProps) {
	return (
		<BorderGridCell className="group/cell relative">
			<Link
				to={to}
				className="absolute inset-0"
				aria-label={`Open ${title} demo`}
			/>
			<div className="flex flex-col gap-3">
				<div className="flex size-9 items-center justify-center border border-border">
					<Icon className="size-4 text-muted-foreground" />
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="font-heading text-base font-semibold">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<span key={tag} className="text-xs text-muted-foreground">
							{tag}
						</span>
					))}
				</div>
			</div>
			<IconArrowRight
				className={cn(
					"absolute right-5 top-6 size-4 text-muted-foreground transition-transform group-hover/cell:translate-x-0.5",
				)}
			/>
		</BorderGridCell>
	);
}
