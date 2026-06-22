import {
	IconArchive,
	IconInbox,
	IconMail,
	IconPaperclip,
	IconSearch,
	IconStar,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BorderGrid, BorderGridCell } from "@/components/common/grid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/examples/inbox")({
	staticData: {
		getTitle: () => "Inbox",
		pageHeader: {
			title: "Inbox",
			description:
				"Two-pane master-detail with a filterable list and reader panel.",
		},
	},
	component: InboxDemoPage,
});

interface IInboxItem {
	id: number;
	from: string;
	initials: string;
	subject: string;
	preview: string;
	body: string;
	time: string;
	unread: boolean;
	starred: boolean;
	tag: string;
	hasAttachment: boolean;
}

const INBOX: IInboxItem[] = [
	{
		id: 1,
		from: "Daikin Support",
		initials: "DS",
		subject: "Firmware update available for FTX50",
		preview:
			"A new firmware version (v3.3.0) is available for your Living Room AC. This update includes...",
		body: "A new firmware version (v3.3.0) is available for your Living Room AC.\n\nThis update includes:\n- Improved energy efficiency in Eco mode (up to 8%)\n- Bug fix for intermittent Wi-Fi disconnection\n- New quiet mode for nighttime operation\n\nThe update will take approximately 5 minutes. Your device will be temporarily unavailable during installation.",
		time: "10:24",
		unread: true,
		starred: true,
		tag: "Update",
		hasAttachment: false,
	},
	{
		id: 2,
		from: "Energy Report",
		initials: "ER",
		subject: "Weekly energy summary ready",
		preview:
			"Your home consumed 124 kWh this week, down 12% from last week. Solar covered 45%...",
		body: "Your home consumed 124 kWh this week, down 12% from last week.\n\nSolar covered 45% of your total consumption. The largest contributor was the Living Room AC at 32 kWh.\n\nView the full breakdown in your dashboard.",
		time: "09:15",
		unread: true,
		starred: false,
		tag: "Report",
		hasAttachment: true,
	},
	{
		id: 3,
		from: "Smart Plug 01",
		initials: "SP",
		subject: "Device went offline",
		preview:
			"Smart Plug 01 in the Office has been offline for 12 minutes. Last reading was 0W...",
		body: "Smart Plug 01 in the Office has been offline for 12 minutes.\n\nLast reading was 0W at 08:52. Possible causes:\n- Wi-Fi router restarted\n- Physical disconnection\n- Power outage in the area\n\nTap to check device status or send a wake command.",
		time: "08:52",
		unread: true,
		starred: false,
		tag: "Alert",
		hasAttachment: false,
	},
	{
		id: 4,
		from: "Sarah K.",
		initials: "SK",
		subject: "Re: Schedule for Bedroom AC",
		preview:
			"I adjusted the weekend schedule to start at 10 AM instead of 8. Let me know if that works...",
		body: "I adjusted the weekend schedule to start at 10 AM instead of 8.\n\nLet me know if that works for you. I also enabled auto power-off after 2 hours of inactivity, so it won't run all afternoon if nobody's home.",
		time: "Yesterday",
		unread: false,
		starred: true,
		tag: "Message",
		hasAttachment: false,
	},
	{
		id: 5,
		from: "System",
		initials: "SY",
		subject: "Monthly maintenance reminder",
		preview:
			"It is time to check the filter on your Air Purifier. Last maintenance was 3 months ago...",
		body: "It is time to check the filter on your Air Purifier.\n\nLast maintenance was 3 months ago. Regular filter replacement keeps efficiency high and prevents dust buildup.\n\nRecommended action: Replace HEPA filter (model H13-2024). Estimated cost: $24.",
		time: "Yesterday",
		unread: false,
		starred: false,
		tag: "Reminder",
		hasAttachment: false,
	},
	{
		id: 6,
		from: "Tom L.",
		initials: "TL",
		subject: "New device added: Garden Lights",
		preview:
			"I set up the Garden Lights controller. It is connected to the Garden room and scheduled...",
		body: "I set up the Garden Lights controller.\n\nIt is connected to the Garden room and scheduled to turn on at sunset and off at midnight. The brightness is set to 60% by default with a motion-activated boost to 100%.\n\nLet me know if you want to tweak any of the settings.",
		time: "2 days ago",
		unread: false,
		starred: false,
		tag: "Message",
		hasAttachment: true,
	},
];

const TAG_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	Update: "secondary",
	Report: "outline",
	Alert: "destructive",
	Message: "default",
	Reminder: "outline",
};

function InboxDemoPage() {
	const [selectedId, setSelectedId] = useState(1);
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
	const [readIds, setReadIds] = useState<Set<number>>(new Set());

	const filtered = useMemo(() => {
		return INBOX.filter((item) => {
			if (query) {
				const q = query.toLowerCase();
				if (
					!item.from.toLowerCase().includes(q) &&
					!item.subject.toLowerCase().includes(q) &&
					!item.preview.toLowerCase().includes(q)
				)
					return false;
			}
			if (filter === "unread" && !item.unread) return false;
			if (filter === "starred" && !item.starred) return false;
			return true;
		});
	}, [query, filter]);

	const selected = INBOX.find((i) => i.id === selectedId);
	const unreadCount = INBOX.filter(
		(i) => i.unread && !readIds.has(i.id),
	).length;

	const handleSelect = (id: number) => {
		setSelectedId(id);
		setReadIds((prev) => new Set([...prev, id]));
	};

	return (
		<div className="flex flex-col gap-6">
			<BorderGrid cols={4}>
				<BorderGridCell pad="default">
					<div className="flex items-center justify-between">
						<span className="text-xs uppercase tracking-wider text-muted-foreground">
							Total
						</span>
						<IconInbox className="size-4 text-muted-foreground" />
					</div>
					<span className="mt-3 block font-heading text-3xl font-semibold tracking-tight">
						{INBOX.length}
					</span>
				</BorderGridCell>
				<BorderGridCell pad="default">
					<div className="flex items-center justify-between">
						<span className="text-xs uppercase tracking-wider text-muted-foreground">
							Unread
						</span>
						<IconMail className="size-4 text-chart-1" />
					</div>
					<span className="mt-3 block font-heading text-3xl font-semibold tracking-tight">
						{unreadCount}
					</span>
				</BorderGridCell>
				<BorderGridCell pad="default">
					<div className="flex items-center justify-between">
						<span className="text-xs uppercase tracking-wider text-muted-foreground">
							Starred
						</span>
						<IconStar className="size-4 text-chart-3" />
					</div>
					<span className="mt-3 block font-heading text-3xl font-semibold tracking-tight">
						{INBOX.filter((i) => i.starred).length}
					</span>
				</BorderGridCell>
				<BorderGridCell pad="default">
					<div className="flex items-center justify-between">
						<span className="text-xs uppercase tracking-wider text-muted-foreground">
							With files
						</span>
						<IconPaperclip className="size-4 text-muted-foreground" />
					</div>
					<span className="mt-3 block font-heading text-3xl font-semibold tracking-tight">
						{INBOX.filter((i) => i.hasAttachment).length}
					</span>
				</BorderGridCell>
			</BorderGrid>

			<div className="grid grid-cols-1 border border-dashed border-border lg:grid-cols-[380px_1fr]">
				<div className="flex flex-col border-b border-dashed border-border lg:border-b-0 lg:border-r">
					<div className="flex flex-col gap-3 border-b border-dashed border-border p-4">
						<div className="relative">
							<IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search inbox..."
								className="pl-8"
								aria-label="Search inbox"
							/>
						</div>
						<div className="flex items-center gap-2">
							{(
								[
									{ value: "all", label: "All" },
									{ value: "unread", label: "Unread" },
									{ value: "starred", label: "Starred" },
								] as const
							).map((f) => (
								<button
									key={f.value}
									type="button"
									onClick={() => setFilter(f.value)}
									className={cn(
										"border px-3 py-1.5 text-sm transition-colors",
										filter === f.value
											? "border-foreground bg-secondary font-medium"
											: "border-dashed border-border text-muted-foreground hover:bg-muted",
									)}
									aria-pressed={filter === f.value}
								>
									{f.label}
								</button>
							))}
						</div>
					</div>

					<div className="flex flex-col overflow-y-auto">
						{filtered.length === 0 ? (
							<div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
								No messages found.
							</div>
						) : (
							filtered.map((item) => {
								const isUnread = item.unread && !readIds.has(item.id);
								const isSelected = item.id === selectedId;
								return (
									<button
										key={item.id}
										type="button"
										onClick={() => handleSelect(item.id)}
										className={cn(
											"flex flex-col gap-2 border-b border-dashed border-border p-4 text-left transition-colors last:border-b-0",
											isSelected ? "bg-secondary" : "hover:bg-muted/40",
										)}
									>
										<div className="flex items-center gap-3">
											<Avatar size="sm">
												<AvatarFallback>{item.initials}</AvatarFallback>
											</Avatar>
											<div className="flex flex-1 flex-col gap-0.5 min-w-0">
												<div className="flex items-center gap-2">
													<span
														className={cn(
															"truncate text-sm",
															isUnread ? "font-semibold" : "font-medium",
														)}
													>
														{item.from}
													</span>
													{isUnread && (
														<span className="size-2 shrink-0 rounded-full bg-primary" />
													)}
												</div>
												<span className="truncate text-sm text-muted-foreground">
													{item.subject}
												</span>
											</div>
											<div className="flex shrink-0 flex-col items-end gap-1">
												<span className="font-mono text-xs text-muted-foreground">
													{item.time}
												</span>
												<Badge variant={TAG_VARIANT[item.tag] ?? "outline"}>
													{item.tag}
												</Badge>
											</div>
										</div>
										<p className="line-clamp-2 text-sm text-muted-foreground">
											{item.preview}
										</p>
									</button>
								);
							})
						)}
					</div>
				</div>

				{selected && (
					<div className="flex flex-col">
						<div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border p-6">
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarFallback>{selected.initials}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col gap-0.5">
									<span className="font-semibold">{selected.from}</span>
									<span className="text-sm text-muted-foreground">
										{selected.time}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Star"
									onClick={() => toast.info("Starred (demo).")}
								>
									<IconStar
										className={cn(
											"size-4",
											selected.starred && "fill-foreground text-foreground",
										)}
									/>
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Archive"
									onClick={() => toast.success("Archived (demo).")}
								>
									<IconArchive />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Delete"
									onClick={() => toast.success("Deleted (demo).")}
								>
									<IconTrash />
								</Button>
							</div>
						</div>

						<div className="flex flex-1 flex-col gap-4 p-6">
							<div className="flex items-center gap-2">
								<Badge variant={TAG_VARIANT[selected.tag] ?? "outline"}>
									{selected.tag}
								</Badge>
								{selected.hasAttachment && (
									<span className="flex items-center gap-1 text-sm text-muted-foreground">
										<IconPaperclip className="size-3.5" />1 attachment
									</span>
								)}
							</div>
							<h2 className="font-heading text-lg font-semibold tracking-tight">
								{selected.subject}
							</h2>
							<div className="flex flex-col gap-4 text-sm leading-relaxed">
								{selected.body.split("\n\n").map((para) => (
									<p key={para.slice(0, 20)} className="text-foreground">
										{para.split("\n").map((line) => (
											<span key={line} className="block">
												{line}
											</span>
										))}
									</p>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
