import {
	IconBolt,
	IconCopy,
	IconDotsVertical,
	IconLamp,
	IconPencil,
	IconPlugConnected,
	IconPlus,
	IconSearch,
	IconThermometer,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BorderGrid, BorderGridCell } from "@/components/common/grid";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
	"/dashboard/$experimentId/examples/crud-table",
)({
	staticData: {
		getTitle: () => "CRUD table",
		pageHeader: {
			title: "Devices — CRUD table",
			description:
				"Filter, select, edit and paginate a data table using the border-grid style.",
		},
	},
	component: CrudTablePage,
});

type DeviceStatus = "online" | "warning" | "offline";

interface IDevice {
	id: number;
	name: string;
	icon: typeof IconBolt;
	room: string;
	status: DeviceStatus;
	power: string;
	lastSeen: string;
}

const ALL_DEVICES: IDevice[] = [
	{
		id: 1,
		name: "Living Room AC",
		icon: IconThermometer,
		room: "Living Room",
		status: "online",
		power: "1.2 kW",
		lastSeen: "now",
	},
	{
		id: 2,
		name: "Kitchen Lights",
		icon: IconLamp,
		room: "Kitchen",
		status: "online",
		power: "0.1 kW",
		lastSeen: "now",
	},
	{
		id: 3,
		name: "Water Heater",
		icon: IconBolt,
		room: "Bathroom",
		status: "warning",
		power: "2.4 kW",
		lastSeen: "2m ago",
	},
	{
		id: 4,
		name: "Air Purifier",
		icon: IconPlugConnected,
		room: "Bedroom",
		status: "online",
		power: "0.04 kW",
		lastSeen: "now",
	},
	{
		id: 5,
		name: "Smart Plug 01",
		icon: IconPlugConnected,
		room: "Office",
		status: "offline",
		power: "—",
		lastSeen: "1h ago",
	},
	{
		id: 6,
		name: "Thermostat",
		icon: IconThermometer,
		room: "Hallway",
		status: "online",
		power: "0.02 kW",
		lastSeen: "now",
	},
	{
		id: 7,
		name: "Garage Door",
		icon: IconPlugConnected,
		room: "Garage",
		status: "warning",
		power: "0.3 kW",
		lastSeen: "5m ago",
	},
	{
		id: 8,
		name: "Garden Lights",
		icon: IconLamp,
		room: "Garden",
		status: "online",
		power: "0.08 kW",
		lastSeen: "now",
	},
	{
		id: 9,
		name: "Smart Plug 02",
		icon: IconPlugConnected,
		room: "Office",
		status: "offline",
		power: "—",
		lastSeen: "3h ago",
	},
	{
		id: 10,
		name: "Bedroom Heater",
		icon: IconBolt,
		room: "Bedroom",
		status: "online",
		power: "1.8 kW",
		lastSeen: "now",
	},
	{
		id: 11,
		name: "Kitchen Outlet",
		icon: IconPlugConnected,
		room: "Kitchen",
		status: "online",
		power: "0.5 kW",
		lastSeen: "now",
	},
	{
		id: 12,
		name: "Roof Solar Inverter",
		icon: IconBolt,
		room: "Roof",
		status: "warning",
		power: "3.1 kW",
		lastSeen: "12m ago",
	},
];

const STATUS_BADGE: Record<
	DeviceStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	online: { label: "Online", variant: "secondary" },
	warning: { label: "Warning", variant: "outline" },
	offline: { label: "Offline", variant: "destructive" },
};

const PAGE_SIZE = 6;

function CrudTablePage() {
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");
	const [roomFilter, setRoomFilter] = useState<string>("all");
	const [selected, setSelected] = useState<Record<number, boolean>>({});
	const [page, setPage] = useState(0);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [addOpen, setAddOpen] = useState(false);

	const rooms = useMemo(
		() => ["all", ...Array.from(new Set(ALL_DEVICES.map((d) => d.room)))],
		[],
	);

	const filtered = useMemo(() => {
		return ALL_DEVICES.filter((d) => {
			if (query && !d.name.toLowerCase().includes(query.toLowerCase()))
				return false;
			if (statusFilter !== "all" && d.status !== statusFilter) return false;
			if (roomFilter !== "all" && d.room !== roomFilter) return false;
			return true;
		});
	}, [query, statusFilter, roomFilter]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount - 1);
	const pageRows = filtered.slice(
		safePage * PAGE_SIZE,
		safePage * PAGE_SIZE + PAGE_SIZE,
	);

	const pageIds = pageRows.map((d) => d.id);
	const allOnPageSelected =
		pageIds.length > 0 && pageIds.every((id) => selected[id]);
	const someOnPageSelected = pageIds.some((id) => selected[id]);
	const selectedCount = Object.values(selected).filter(Boolean).length;

	const toggleAll = (checked: boolean) => {
		setSelected((prev) => {
			const next = { ...prev };
			for (const id of pageIds) next[id] = checked;
			return next;
		});
	};

	const toggleOne = (id: number, checked: boolean) => {
		setSelected((prev) => ({ ...prev, [id]: checked }));
	};

	const clearSelection = () => setSelected({});

	const confirmDelete = () => {
		if (deleteId === null) return;
		toast.success(`Device #${deleteId} deleted (demo).`);
		setDeleteId(null);
	};

	const stats = [
		{
			label: "Total devices",
			value: String(ALL_DEVICES.length),
			icon: IconPlugConnected,
			colorClass: "text-foreground",
		},
		{
			label: "Online",
			value: String(ALL_DEVICES.filter((d) => d.status === "online").length),
			icon: IconBolt,
			colorClass: "text-chart-1",
		},
		{
			label: "Warnings",
			value: String(ALL_DEVICES.filter((d) => d.status === "warning").length),
			icon: IconThermometer,
			colorClass: "text-chart-3",
		},
		{
			label: "Offline",
			value: String(ALL_DEVICES.filter((d) => d.status === "offline").length),
			icon: IconLamp,
			colorClass: "text-chart-6",
		},
	];

	return (
		<div className="flex flex-col gap-8">
			<BorderGrid cols={4}>
				{stats.map((s) => (
					<StatCell key={s.label} {...s} />
				))}
			</BorderGrid>

			<div className="flex flex-col border border-dashed border-border">
				<div className="flex flex-col gap-3 border-b border-dashed border-border p-4 lg:flex-row lg:items-center">
					<div className="flex flex-1 flex-col gap-3 sm:flex-row">
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setPage(0);
								}}
								placeholder="Search devices..."
								className="pl-8"
								aria-label="Search devices"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={(v) => {
								if (v !== null) setStatusFilter(v as DeviceStatus | "all");
								setPage(0);
							}}
						>
							<SelectTrigger
								className="w-full sm:w-40"
								aria-label="Filter by status"
							>
								<SelectValue placeholder="Status">
									{(value) => {
										if (value === "all") return "All status";
										if (value === "online") return "Online";
										if (value === "warning") return "Warning";
										if (value === "offline") return "Offline";
										return value;
									}}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All status</SelectItem>
								<SelectItem value="online">Online</SelectItem>
								<SelectItem value="warning">Warning</SelectItem>
								<SelectItem value="offline">Offline</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={roomFilter}
							onValueChange={(v) => {
								if (v !== null) setRoomFilter(v);
								setPage(0);
							}}
						>
							<SelectTrigger
								className="w-full sm:w-44"
								aria-label="Filter by room"
							>
								<SelectValue placeholder="Room">
									{(value) => (value === "all" ? "All rooms" : value)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{rooms.map((r) => (
									<SelectItem key={r} value={r}>
										{r === "all" ? "All rooms" : r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						{(query || statusFilter !== "all" || roomFilter !== "all") && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setQuery("");
									setStatusFilter("all");
									setRoomFilter("all");
									setPage(0);
								}}
							>
								Reset
							</Button>
						)}
						<Button size="sm" onClick={() => setAddOpen(true)}>
							<IconPlus className="size-3.5" data-icon="inline-start" />
							Add device
						</Button>
					</div>
				</div>

				<div className="relative overflow-x-auto">
					<table className="w-full caption-bottom text-sm">
						<thead>
							<tr className="border-b border-dashed border-border">
								<th className="h-11 w-10 px-3 align-middle">
									<Checkbox
										checked={allOnPageSelected}
										indeterminate={someOnPageSelected && !allOnPageSelected}
										onCheckedChange={(v) => toggleAll(!!v)}
										aria-label="Select all on page"
									/>
								</th>
								<th className="h-11 px-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Device
								</th>
								<th className="hidden h-11 px-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
									Room
								</th>
								<th className="h-11 px-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Status
								</th>
								<th className="hidden h-11 px-3 text-right align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
									Power
								</th>
								<th className="hidden h-11 px-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
									Last seen
								</th>
								<th className="h-11 w-10 px-3 align-middle" />
							</tr>
						</thead>
						<tbody>
							{pageRows.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="h-24 text-center text-sm text-muted-foreground"
									>
										No devices match your filters.
									</td>
								</tr>
							) : (
								pageRows.map((device) => (
									<tr
										key={device.id}
										className={cn(
											"border-b border-dashed border-border transition-colors last:border-b-0 hover:bg-muted/40",
											selected[device.id] && "bg-muted/60",
										)}
									>
										<td className="px-3 align-middle">
											<Checkbox
												checked={!!selected[device.id]}
												onCheckedChange={(v) => toggleOne(device.id, !!v)}
												aria-label={`Select ${device.name}`}
											/>
										</td>
										<td className="px-3 align-middle">
											<div className="flex items-center gap-3">
												<div className="flex size-8 shrink-0 items-center justify-center border border-dashed border-border">
													<device.icon className="size-4 text-muted-foreground" />
												</div>
												<span className="font-medium">{device.name}</span>
											</div>
										</td>
										<td className="hidden px-3 align-middle text-muted-foreground sm:table-cell">
											{device.room}
										</td>
										<td className="px-3 align-middle">
											<Badge variant={STATUS_BADGE[device.status].variant}>
												<span
													className={cn(
														"size-1.5 rounded-full",
														device.status === "online" && "bg-chart-1",
														device.status === "warning" && "bg-chart-3",
														device.status === "offline" &&
															"bg-muted-foreground",
													)}
												/>
												{STATUS_BADGE[device.status].label}
											</Badge>
										</td>
										<td className="hidden px-3 text-right align-middle font-mono text-muted-foreground sm:table-cell">
											{device.power}
										</td>
										<td className="hidden px-3 align-middle text-muted-foreground md:table-cell">
											{device.lastSeen}
										</td>
										<td className="px-3 align-middle">
											<RowActions
												onEdit={() => toast.info(`Edit ${device.name} (demo).`)}
												onDuplicate={() =>
													toast.success(`Duplicated ${device.name} (demo).`)
												}
												onDelete={() => setDeleteId(device.id)}
											/>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{selectedCount > 0 ? (
					<div className="flex flex-wrap items-center gap-3 border-t border-dashed border-border bg-secondary px-4 py-2.5 text-sm">
						<span className="font-medium">{selectedCount} selected</span>
						<span className="text-muted-foreground">·</span>
						<Button variant="ghost" size="xs" onClick={clearSelection}>
							Clear
						</Button>
						<Button
							variant="ghost"
							size="xs"
							onClick={() => toast.success("Exported selection (demo).")}
						>
							Export
						</Button>
						<Button
							variant="destructive"
							size="xs"
							onClick={() => {
								toast.success(`Deleted ${selectedCount} devices (demo).`);
								clearSelection();
							}}
						>
							<IconTrash className="size-3" data-icon="inline-start" />
							Delete
						</Button>
					</div>
				) : (
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border px-4 py-2.5">
						<span className="text-sm text-muted-foreground">
							Showing {pageRows.length} of {filtered.length} devices
						</span>
						<Pagination className="mx-0 w-auto justify-end">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										size="sm"
										text=""
										aria-disabled={safePage === 0}
										className={cn(
											safePage === 0 && "pointer-events-none opacity-50",
										)}
										onClick={(e) => {
											e.preventDefault();
											setPage((p) => Math.max(0, p - 1));
										}}
									/>
								</PaginationItem>
								{buildPageRange(safePage, pageCount).map((p, i) =>
									p === "..." ? (
										// biome-ignore lint/suspicious/noArrayIndexKey: ellipsis items have no unique identifier
										<PaginationItem key={`ellipsis-${i}`}>
											<PaginationEllipsis />
										</PaginationItem>
									) : (
										<PaginationItem key={p}>
											<PaginationLink
												href="#"
												size="sm"
												isActive={p === safePage}
												onClick={(e) => {
													e.preventDefault();
													setPage(p);
												}}
											>
												{p + 1}
											</PaginationLink>
										</PaginationItem>
									),
								)}
								<PaginationItem>
									<PaginationNext
										href="#"
										size="sm"
										text=""
										aria-disabled={safePage >= pageCount - 1}
										className={cn(
											safePage >= pageCount - 1 &&
												"pointer-events-none opacity-50",
										)}
										onClick={(e) => {
											e.preventDefault();
											setPage((p) => Math.min(pageCount - 1, p + 1));
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>

			<DeleteDeviceDialog
				open={deleteId !== null}
				onOpenChange={(o) => !o && setDeleteId(null)}
				onConfirm={confirmDelete}
			/>
			<AddDeviceDialog open={addOpen} onOpenChange={setAddOpen} />
		</div>
	);
}

function StatCell({
	label,
	value,
	icon: Icon,
	colorClass,
}: {
	label: string;
	value: string;
	icon: typeof IconBolt;
	colorClass: string;
}) {
	return (
		<BorderGridCell pad="default">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{label}
				</span>
				<Icon className={cn("size-4", colorClass)} />
			</div>
			<span className="mt-3 block font-heading text-3xl font-semibold tracking-tight">
				{value}
			</span>
		</BorderGridCell>
	);
}

function RowActions({
	onEdit,
	onDuplicate,
	onDelete,
}: {
	onEdit: () => void;
	onDuplicate: () => void;
	onDelete: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Open row actions"
					/>
				}
			>
				<IconDotsVertical />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={onEdit}>
						<IconPencil className="size-4" data-icon="inline-start" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onDuplicate}>
						<IconCopy className="size-4" data-icon="inline-start" />
						Duplicate
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={onDelete}>
					<IconTrash className="size-4" data-icon="inline-start" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DeleteDeviceDialog({
	open,
	onOpenChange,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete device?</AlertDialogTitle>
					<AlertDialogDescription>
						This removes the device from your dashboard. This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onConfirm}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function AddDeviceDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [name, setName] = useState("");
	const [room, setRoom] = useState("Living Room");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success(`Added "${name || "Unnamed"}" to ${room} (demo).`);
		setName("");
		setRoom("Living Room");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add device</DialogTitle>
					<DialogDescription>
						Register a new device to monitor in this dashboard.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="dev-name">Device name</FieldLabel>
							<Input
								id="dev-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Bedroom AC"
								autoFocus
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="dev-room">Room</FieldLabel>
							<Select
								value={room}
								onValueChange={(v) => v !== null && setRoom(v)}
							>
								<SelectTrigger id="dev-room" className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[
										"Living Room",
										"Kitchen",
										"Bedroom",
										"Office",
										"Garage",
										"Garden",
									].map((r) => (
										<SelectItem key={r} value={r}>
											{r}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					</FieldGroup>
					<DialogFooter>
						<Button type="submit">
							<IconPlus className="size-3.5" data-icon="inline-start" />
							Add device
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function buildPageRange(current: number, total: number): (number | "...")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i);
	const pages = new Set([0, total - 1, current, current - 1, current + 1]);
	const sorted = [...pages]
		.filter((p) => p >= 0 && p < total)
		.sort((a, b) => a - b);
	const result: (number | "...")[] = [];
	for (let i = 0; i < sorted.length; i++) {
		if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
		result.push(sorted[i]);
	}
	return result;
}
