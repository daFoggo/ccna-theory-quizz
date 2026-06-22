import {
	IconBolt,
	IconCalendar,
	IconClock,
	IconDroplet,
	IconRefresh,
	IconThermometer,
	IconWind,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Progress,
	ProgressIndicator,
	ProgressTrack,
} from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/examples/detail")({
	staticData: {
		getTitle: () => "Detail view",
		pageHeader: {
			title: "Living Room AC",
			description: "Device detail with tabbed content and a metadata sidebar.",
		},
	},
	component: DetailDemoPage,
});

const powerData = [
	{ time: "00:00", power: 0.4 },
	{ time: "03:00", power: 0.2 },
	{ time: "06:00", power: 0.8 },
	{ time: "09:00", power: 1.5 },
	{ time: "12:00", power: 2.1 },
	{ time: "15:00", power: 1.8 },
	{ time: "18:00", power: 2.4 },
	{ time: "21:00", power: 1.2 },
];

const activityLog = [
	{
		id: 1,
		action: "Turned on",
		user: "Auto schedule",
		time: "08:00",
		icon: IconBolt,
	},
	{
		id: 2,
		action: "Mode changed to Eco",
		user: "Sarah K.",
		time: "10:32",
		icon: IconThermometer,
	},
	{
		id: 3,
		action: "Temperature set to 22C",
		user: "Sarah K.",
		time: "10:33",
		icon: IconDroplet,
	},
	{
		id: 4,
		action: "Power alert: 2.1 kW peak",
		user: "System",
		time: "12:15",
		icon: IconBolt,
	},
	{
		id: 5,
		action: "Turned off",
		user: "Auto schedule",
		time: "22:00",
		icon: IconBolt,
	},
];

function DetailDemoPage() {
	const [tab, setTab] = useState("overview");

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="flex size-12 items-center justify-center border border-dashed border-border">
						<IconThermometer className="size-5 text-muted-foreground" />
					</div>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<h1 className="font-heading text-xl font-semibold tracking-tight">
								Living Room AC
							</h1>
							<Badge variant="secondary">
								<span className="size-1.5 rounded-full bg-chart-1" />
								Online
							</Badge>
						</div>
						<span className="text-sm text-muted-foreground">
							Model: Daikin FTX50 · Serial: DK-2024-8841
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<IconRefresh className="size-3.5" data-icon="inline-start" />
						Refresh
					</Button>
					<Button size="sm">
						<IconBolt className="size-3.5" data-icon="inline-start" />
						Power off
					</Button>
				</div>
			</div>

			<BorderGrid cols={4}>
				<BorderGridCell colSpan={3} pad="none">
					<Tabs
						value={tab}
						onValueChange={setTab}
						className="flex flex-col gap-0"
					>
						<div className="border-b border-dashed border-border px-6 pt-4">
							<TabsList variant="line">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="activity">Activity</TabsTrigger>
								<TabsTrigger value="power">Power usage</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="overview" className="p-6">
							<div className="flex flex-col gap-6">
								<BorderSectionHeader title="Current readings" />
								<div className="grid grid-cols-2 gap-0 border-t border-l border-dashed border-border sm:grid-cols-4">
									<ReadingCell
										icon={IconThermometer}
										label="Temperature"
										value="22"
										unit="C"
									/>
									<ReadingCell
										icon={IconDroplet}
										label="Humidity"
										value="48"
										unit="%"
									/>
									<ReadingCell
										icon={IconWind}
										label="Fan speed"
										value="Auto"
										unit=""
									/>
									<ReadingCell
										icon={IconBolt}
										label="Power draw"
										value="1.2"
										unit="kW"
									/>
								</div>

								<BorderSectionHeader title="Schedules" />
								<div className="flex flex-col border-t border-l border-dashed border-border">
									<ScheduleRow
										days="Mon - Fri"
										start="08:00"
										end="22:00"
										mode="Eco"
										active
									/>
									<ScheduleRow
										days="Sat - Sun"
										start="10:00"
										end="18:00"
										mode="Comfort"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="activity" className="p-6">
							<BorderSectionHeader
								title="Recent activity"
								description="Last 24 hours of events and user actions."
							/>
							<div className="flex flex-col border-t border-l border-dashed border-border">
								{activityLog.map((entry, i) => (
									<div
										key={entry.id}
										className={cn(
											"group/activity flex items-center gap-4 border-b border-r border-dashed border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary",
											i === activityLog.length - 1 && "border-b-0",
										)}
									>
										<div className="flex size-8 shrink-0 items-center justify-center border border-dashed border-border">
											<entry.icon className="size-4 text-muted-foreground" />
										</div>
										<div className="flex flex-1 flex-col gap-0.5 min-w-0">
											<span className="font-medium">{entry.action}</span>
											<span className="text-sm text-muted-foreground">
												by {entry.user}
											</span>
										</div>
										<div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
											<IconClock className="size-3.5" />
											<span className="font-mono">{entry.time}</span>
										</div>
									</div>
								))}
							</div>
						</TabsContent>

						<TabsContent value="power" className="p-6">
							<BorderSectionHeader
								title="Power consumption today"
								description="Hourly readings in kilowatts."
							/>
							<div className="h-72 w-full border border-dashed border-border bg-secondary p-4">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={powerData}
										margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
									>
										<defs>
											<linearGradient
												id="powerGrad"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="0%"
													stopColor="var(--chart-1)"
													stopOpacity={0.3}
												/>
												<stop
													offset="100%"
													stopColor="var(--chart-1)"
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="var(--border)"
											vertical={false}
										/>
										<XAxis
											dataKey="time"
											tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip
											contentStyle={{
												background: "var(--card)",
												border: "1px solid var(--border)",
												borderRadius: "0",
												fontSize: "12px",
											}}
										/>
										<Area
											type="monotone"
											dataKey="power"
											stroke="var(--chart-1)"
											strokeWidth={2}
											fill="url(#powerGrad)"
											name="Power (kW)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</TabsContent>
					</Tabs>
				</BorderGridCell>

				<BorderGridCell colSpan={1} pad="none" tone="muted">
					<div className="flex flex-col">
						<div className="border-b border-dashed border-border p-6">
							<span className="text-sm font-medium text-muted-foreground">
								Metadata
							</span>
						</div>
						<div className="flex flex-col">
							<MetaRow label="Device ID" value="#DK-2024-8841" />
							<MetaRow label="Room" value="Living Room" />
							<MetaRow label="Type" value="Air conditioner" />
							<MetaRow label="Manufacturer" value="Daikin" />
							<MetaRow label="Model" value="FTX50" />
							<MetaRow label="Firmware" value="v3.2.1" />
							<MetaRow label="Connected since" value="Jan 12, 2025" last />
						</div>

						<div className="border-b border-dashed border-border p-6">
							<span className="text-sm font-medium text-muted-foreground">
								Assigned to
							</span>
						</div>
						<div className="flex flex-col">
							{[
								{ name: "Sarah K.", role: "Owner", initials: "SK" },
								{ name: "Tom L.", role: "Editor", initials: "TL" },
								{ name: "Mira J.", role: "Viewer", initials: "MJ" },
							].map((person, i) => (
								<div
									key={person.name}
									className={cn(
										"flex items-center gap-3 border-b border-r border-dashed border-border p-4",
										i === 2 && "border-b-0",
									)}
								>
									<Avatar size="sm">
										<AvatarFallback>{person.initials}</AvatarFallback>
									</Avatar>
									<div className="flex flex-1 flex-col gap-0.5 min-w-0">
										<span className="truncate font-medium">{person.name}</span>
										<span className="text-sm text-muted-foreground">
											{person.role}
										</span>
									</div>
								</div>
							))}
						</div>

						<div className="p-6">
							<span className="text-sm font-medium text-muted-foreground">
								Health
							</span>
							<div className="mt-4 flex flex-col gap-3">
								<div>
									<div className="flex items-center justify-between text-sm">
										<span>Filter life</span>
										<span className="font-mono text-muted-foreground">78%</span>
									</div>
									<Progress value={78} className="mt-2">
										<ProgressTrack className="h-1.5">
											<ProgressIndicator style={{ width: "78%" }} />
										</ProgressTrack>
									</Progress>
								</div>
								<div>
									<div className="flex items-center justify-between text-sm">
										<span>Efficiency</span>
										<span className="font-mono text-muted-foreground">92%</span>
									</div>
									<Progress value={92} className="mt-2">
										<ProgressTrack className="h-1.5">
											<ProgressIndicator style={{ width: "92%" }} />
										</ProgressTrack>
									</Progress>
								</div>
							</div>
						</div>
					</div>
				</BorderGridCell>
			</BorderGrid>
		</div>
	);
}

function ReadingCell({
	icon: Icon,
	label,
	value,
	unit,
}: {
	icon: typeof IconBolt;
	label: string;
	value: string;
	unit: string;
}) {
	return (
		<div className="border-b border-r border-dashed border-border p-4">
			<div className="flex items-center gap-2">
				<Icon className="size-4 text-muted-foreground" />
				<span className="text-xs uppercase tracking-wider text-muted-foreground">
					{label}
				</span>
			</div>
			<div className="mt-2 flex items-baseline gap-1">
				<span className="font-heading text-2xl font-semibold tracking-tight">
					{value}
				</span>
				{unit && <span className="text-sm text-muted-foreground">{unit}</span>}
			</div>
		</div>
	);
}

function ScheduleRow({
	days,
	start,
	end,
	mode,
	active,
}: {
	days: string;
	start: string;
	end: string;
	mode: string;
	active?: boolean;
}) {
	return (
		<div className="group/schedule flex flex-wrap items-center gap-3 border-b border-r border-dashed border-border bg-secondary/50 p-4 transition-colors last:border-b-0 hover:bg-secondary">
			<div className="flex flex-1 items-center gap-2">
				<IconCalendar className="size-4 text-muted-foreground" />
				<span className="font-medium">{days}</span>
			</div>
			<span className="font-mono text-sm text-muted-foreground">
				{start} - {end}
			</span>
			<Badge variant={active ? "secondary" : "outline"}>
				{active ? "Active" : "Paused"}
			</Badge>
			<span className="text-sm text-muted-foreground">{mode}</span>
		</div>
	);
}

function MetaRow({
	label,
	value,
	last,
}: {
	label: string;
	value: string;
	last?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-3 border-b border-r border-dashed border-border px-6 py-3",
				last && "border-b-0",
			)}
		>
			<span className="text-sm text-muted-foreground">{label}</span>
			<span className="font-mono text-sm font-medium">{value}</span>
		</div>
	);
}
