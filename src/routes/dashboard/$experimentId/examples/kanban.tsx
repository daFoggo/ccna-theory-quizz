import {
	IconBolt,
	IconChevronLeft,
	IconChevronRight,
	IconLamp,
	IconPlugConnected,
	IconPlus,
	IconThermometer,
	IconWind,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
	"/dashboard/$experimentId/examples/kanban",
)({
	staticData: {
		getTitle: () => "Kanban board",
		pageHeader: {
			title: "Task board",
			description:
				"Dashed lanes and flat cards in a column-based board layout.",
		},
	},
	component: KanbanDemoPage,
});

type CardStatus = "backlog" | "progress" | "review" | "done";

interface ICard {
	id: number;
	title: string;
	icon: typeof IconBolt;
	priority: "low" | "medium" | "high";
	assignee: string;
	initials: string;
	tags: string[];
	status: CardStatus;
}

const COLUMNS: { key: CardStatus; label: string; dot: string }[] = [
	{ key: "backlog", label: "Backlog", dot: "bg-muted-foreground" },
	{ key: "progress", label: "In progress", dot: "bg-chart-1" },
	{ key: "review", label: "In review", dot: "bg-chart-3" },
	{ key: "done", label: "Done", dot: "bg-chart-2" },
];

const PRIORITY_BADGE: Record<
	ICard["priority"],
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	low: { label: "Low", variant: "outline" },
	medium: { label: "Medium", variant: "secondary" },
	high: { label: "High", variant: "destructive" },
};

const INITIAL_CARDS: ICard[] = [
	{
		id: 1,
		title: "Replace AC filter",
		icon: IconThermometer,
		priority: "high",
		assignee: "Sarah K.",
		initials: "SK",
		tags: ["Maintenance"],
		status: "progress",
	},
	{
		id: 2,
		title: "Install smart plug firmware",
		icon: IconPlugConnected,
		priority: "medium",
		assignee: "Tom L.",
		initials: "TL",
		tags: ["Firmware", "Office"],
		status: "progress",
	},
	{
		id: 3,
		title: "Calibrate thermostat sensor",
		icon: IconBolt,
		priority: "medium",
		assignee: "Mira J.",
		initials: "MJ",
		tags: ["Calibration"],
		status: "review",
	},
	{
		id: 4,
		title: "Set up garden light schedule",
		icon: IconLamp,
		priority: "low",
		assignee: "Tom L.",
		initials: "TL",
		tags: ["Schedule", "Garden"],
		status: "review",
	},
	{
		id: 5,
		title: "Air purifier filter check",
		icon: IconWind,
		priority: "medium",
		assignee: "Sarah K.",
		initials: "SK",
		tags: ["Maintenance"],
		status: "done",
	},
	{
		id: 6,
		title: "Connect water heater to app",
		icon: IconBolt,
		priority: "high",
		assignee: "Mira J.",
		initials: "MJ",
		tags: ["Setup", "Bathroom"],
		status: "done",
	},
	{
		id: 7,
		title: "Audit energy consumption by room",
		icon: IconBolt,
		priority: "low",
		assignee: "Sarah K.",
		initials: "SK",
		tags: ["Energy"],
		status: "backlog",
	},
	{
		id: 8,
		title: "Fix garage door sensor lag",
		icon: IconPlugConnected,
		priority: "high",
		assignee: "Tom L.",
		initials: "TL",
		tags: ["Bug", "Garage"],
		status: "backlog",
	},
	{
		id: 9,
		title: "Program bedtime AC auto-off",
		icon: IconThermometer,
		priority: "low",
		assignee: "Mira J.",
		initials: "MJ",
		tags: ["Schedule", "Bedroom"],
		status: "backlog",
	},
];

function KanbanDemoPage() {
	const [cards, setCards] = useState<Record<number, CardStatus>>(() =>
		Object.fromEntries(INITIAL_CARDS.map((c) => [c.id, c.status])),
	);

	const moveCard = (id: number, dir: -1 | 1) => {
		const currentStatus = cards[id];
		const colIdx = COLUMNS.findIndex((c) => c.key === currentStatus);
		const nextIdx = colIdx + dir;
		if (nextIdx < 0 || nextIdx >= COLUMNS.length) return;
		setCards((prev) => ({ ...prev, [id]: COLUMNS[nextIdx].key }));
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-0 border-t border-l border-dashed border-border sm:grid-cols-2 lg:grid-cols-4">
				{COLUMNS.map((col) => {
					const colCards = INITIAL_CARDS.filter((c) => cards[c.id] === col.key);
					return (
						<div
							key={col.key}
							className="flex flex-col border-b border-r border-dashed border-border"
						>
							<div className="flex items-center justify-between border-b border-dashed border-border p-4">
								<div className="flex items-center gap-2">
									<span className={cn("size-2 rounded-full", col.dot)} />
									<span className="font-medium">{col.label}</span>
								</div>
								<span className="font-mono text-sm text-muted-foreground">
									{colCards.length}
								</span>
							</div>

							<div className="flex flex-1 flex-col gap-3 p-4">
								{colCards.length === 0 ? (
									<div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
										Empty
									</div>
								) : (
									colCards.map((card) => (
										<KanbanCard
											key={card.id}
											card={card}
											canMoveLeft={
												COLUMNS.findIndex((c) => c.key === cards[card.id]) > 0
											}
											canMoveRight={
												COLUMNS.findIndex((c) => c.key === cards[card.id]) <
												COLUMNS.length - 1
											}
											onMoveLeft={() => moveCard(card.id, -1)}
											onMoveRight={() => moveCard(card.id, 1)}
										/>
									))
								)}
								<Button
									variant="ghost"
									size="sm"
									className="justify-start text-muted-foreground"
									onClick={() => toast.info("Add card (demo).")}
								>
									<IconPlus className="size-3.5" data-icon="inline-start" />
									Add card
								</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function KanbanCard({
	card,
	canMoveLeft,
	canMoveRight,
	onMoveLeft,
	onMoveRight,
}: {
	card: ICard;
	canMoveLeft: boolean;
	canMoveRight: boolean;
	onMoveLeft: () => void;
	onMoveRight: () => void;
}) {
	return (
		<div className="group/card flex flex-col gap-3 border border-dashed border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary hover:border-primary/40">
			<div className="flex items-start gap-3">
				<div className="flex size-8 shrink-0 items-center justify-center border border-dashed border-border">
					<card.icon className="size-4 text-muted-foreground" />
				</div>
				<span className="flex-1 font-medium leading-snug">{card.title}</span>
			</div>

			<div className="flex flex-wrap gap-1.5">
				{card.tags.map((tag) => (
					<span
						key={tag}
						className="border border-dashed border-border px-2 py-0.5 text-xs"
					>
						{tag}
					</span>
				))}
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar size="sm">
						<AvatarFallback>{card.initials}</AvatarFallback>
					</Avatar>
					<Badge variant={PRIORITY_BADGE[card.priority].variant}>
						{PRIORITY_BADGE[card.priority].label}
					</Badge>
				</div>
				<div className="flex items-center gap-0.5">
					<Button
						variant="ghost"
						size="icon-xs"
						aria-label="Move left"
						disabled={!canMoveLeft}
						onClick={onMoveLeft}
					>
						<IconChevronLeft className="size-3" />
					</Button>
					<Button
						variant="ghost"
						size="icon-xs"
						aria-label="Move right"
						disabled={!canMoveRight}
						onClick={onMoveRight}
					>
						<IconChevronRight className="size-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
