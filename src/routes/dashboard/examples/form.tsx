import {
	IconBolt,
	IconCheck,
	IconDeviceTv,
	IconLamp,
	IconPlugConnected,
	IconTemperature,
	IconThermometer,
	IconWind,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
	BorderGrid,
	BorderGridCell,
	BorderPanel,
	BorderPanelHeader,
} from "@/components/common/grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/examples/form")({
	staticData: {
		getTitle: () => "Sectioned form",
		pageHeader: {
			title: "Register device",
			description:
				"A create/edit form split into dashed panels with a live preview column.",
		},
	},
	component: FormDemoPage,
});

const DEVICE_ICONS = [
	{ icon: IconThermometer, label: "Thermostat" },
	{ icon: IconLamp, label: "Light" },
	{ icon: IconBolt, label: "Power" },
	{ icon: IconWind, label: "Purifier" },
	{ icon: IconPlugConnected, label: "Plug" },
	{ icon: IconTemperature, label: "Sensor" },
	{ icon: IconDeviceTv, label: "Screen" },
];

function FormDemoPage() {
	const [name, setName] = useState("Bedroom AC");
	const [room, setRoom] = useState("Bedroom");
	const [iconIdx, setIconIdx] = useState(0);
	const [powerThreshold, setPowerThreshold] = useState("2.0");
	const [mode, setMode] = useState("eco");
	const [schedule, setSchedule] = useState(true);
	const [alerts, setAlerts] = useState(true);
	const [autoOff, setAutoOff] = useState(false);
	const [notes, setNotes] = useState("");
	const [weekdays, setWeekdays] = useState<Record<string, boolean>>({
		mon: true,
		tue: true,
		wed: true,
		thu: true,
		fri: true,
		sat: false,
		sun: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success(`Saved "${name}" to ${room} (demo).`);
	};

	const SelectedIcon = DEVICE_ICONS[iconIdx].icon;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-8">
			<BorderGrid cols={4}>
				<BorderGridCell colSpan={3} pad="none" tone="default">
					<div className="flex flex-col">
						<SectionPanel
							title="Device info"
							description="Basic identity and placement."
						>
							<FieldGroup>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="f-name">Device name</FieldLabel>
										<Input
											id="f-name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="e.g. Bedroom AC"
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="f-room">Room</FieldLabel>
										<Select
											value={room}
											onValueChange={(v) => v !== null && setRoom(v)}
										>
											<SelectTrigger id="f-room" className="w-full">
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
								</div>
								<Field>
									<FieldLabel>Device icon</FieldLabel>
									<div className="flex flex-wrap gap-2">
										{DEVICE_ICONS.map((item, i) => (
											<button
												key={item.label}
												type="button"
												onClick={() => setIconIdx(i)}
												className={cn(
													"flex size-9 items-center justify-center border border-dashed transition-colors",
													i === iconIdx
														? "border-foreground bg-secondary"
														: "border-border hover:bg-muted",
												)}
												aria-label={item.label}
												aria-pressed={i === iconIdx}
											>
												<item.icon
													className={cn(
														"size-4",
														i === iconIdx
															? "text-foreground"
															: "text-muted-foreground",
													)}
												/>
											</button>
										))}
									</div>
								</Field>
							</FieldGroup>
						</SectionPanel>

						<SectionPanel
							title="Configuration"
							description="Thresholds, mode and schedule."
						>
							<FieldGroup>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="f-threshold">
											Power threshold (kW)
										</FieldLabel>
										<Input
											id="f-threshold"
											type="number"
											step="0.1"
											value={powerThreshold}
											onChange={(e) => setPowerThreshold(e.target.value)}
										/>
										<FieldDescription>
											Alert when consumption exceeds this value.
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel>Operating mode</FieldLabel>
										<RadioGroup
											value={mode}
											onValueChange={(v) => setMode(v as string)}
											className="flex flex-row gap-4"
										>
											{[
												{ value: "eco", label: "Eco" },
												{ value: "comfort", label: "Comfort" },
												{ value: "boost", label: "Boost" },
											].map((opt) => (
												// biome-ignore lint/a11y/noLabelWithoutControl: base-ui RadioGroupItem is nested inside label
												<label
													key={opt.value}
													className="flex cursor-pointer items-center gap-2 text-sm"
												>
													<RadioGroupItem value={opt.value} />
													{opt.label}
												</label>
											))}
										</RadioGroup>
									</Field>
								</div>
								<Field>
									<FieldLabel>Active days</FieldLabel>
									<div className="flex flex-wrap gap-2">
										{[
											{ key: "mon", label: "Mon" },
											{ key: "tue", label: "Tue" },
											{ key: "wed", label: "Wed" },
											{ key: "thu", label: "Thu" },
											{ key: "fri", label: "Fri" },
											{ key: "sat", label: "Sat" },
											{ key: "sun", label: "Sun" },
										].map((day) => (
											// biome-ignore lint/a11y/noLabelWithoutControl: base-ui Checkbox is nested inside label
											<label
												key={day.key}
												className={cn(
													"flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-sm transition-colors",
													weekdays[day.key]
														? "border-foreground bg-secondary"
														: "border-dashed border-border hover:bg-muted",
												)}
											>
												<Checkbox
													checked={!!weekdays[day.key]}
													onCheckedChange={(v) =>
														setWeekdays((prev) => ({ ...prev, [day.key]: !!v }))
													}
												/>
												{day.label}
											</label>
										))}
									</div>
								</Field>
							</FieldGroup>
						</SectionPanel>

						<SectionPanel
							title="Notifications"
							description="Alerts and automations."
						>
							<div className="flex flex-col">
								<ToggleRow
									label="Schedule enabled"
									description="Run the device on the active-day calendar."
									checked={schedule}
									onCheckedChange={setSchedule}
								/>
								<ToggleRow
									label="Power alerts"
									description="Notify when consumption crosses the threshold."
									checked={alerts}
									onCheckedChange={setAlerts}
								/>
								<ToggleRow
									label="Auto power-off"
									description="Turn off automatically after 2h of inactivity."
									checked={autoOff}
									onCheckedChange={setAutoOff}
									last
								/>
							</div>
						</SectionPanel>

						<SectionPanel
							title="Notes"
							description="Optional internal context."
						>
							<Field>
								<FieldLabel htmlFor="f-notes">Notes</FieldLabel>
								<Textarea
									id="f-notes"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Installation date, warranty, maintenance notes..."
								/>
							</Field>
						</SectionPanel>
					</div>
				</BorderGridCell>

				<BorderGridCell colSpan={1} pad="none" tone="muted">
					<div className="sticky top-0 flex flex-col gap-6 p-6">
						<div className="flex flex-col gap-1">
							<span className="text-sm font-medium text-muted-foreground">
								Live preview
							</span>
							<h3 className="font-heading text-base font-semibold">
								How it appears on the dashboard
							</h3>
						</div>

						<div className="flex flex-col border border-dashed border-border">
							<div className="flex items-center gap-3 border-b border-dashed border-border bg-background p-4">
								<div className="flex size-9 shrink-0 items-center justify-center border border-dashed border-border">
									<SelectedIcon className="size-4 text-muted-foreground" />
								</div>
								<div className="flex flex-1 flex-col gap-0.5 min-w-0">
									<span className="truncate font-medium">
										{name || "Unnamed"}
									</span>
									<span className="truncate text-sm text-muted-foreground">
										{room}
									</span>
								</div>
								<Badge variant="secondary">
									<span className="size-1.5 rounded-full bg-chart-1" />
									Online
								</Badge>
							</div>
							<div className="grid grid-cols-2 border-b border-dashed border-border bg-background">
								<div className="border-r border-dashed border-border p-4">
									<span className="text-xs uppercase tracking-wider text-muted-foreground">
										Mode
									</span>
									<span className="mt-1 block font-medium capitalize">
										{mode}
									</span>
								</div>
								<div className="p-4">
									<span className="text-xs uppercase tracking-wider text-muted-foreground">
										Threshold
									</span>
									<span className="mt-1 block font-mono font-medium">
										{powerThreshold} kW
									</span>
								</div>
							</div>
							<div className="bg-background p-4">
								<span className="text-xs uppercase tracking-wider text-muted-foreground">
									Active days
								</span>
								<div className="mt-2 flex flex-wrap gap-1">
									{Object.entries(weekdays)
										.filter(([, v]) => v)
										.map(([k]) => (
											<span
												key={k}
												className="border border-dashed border-border px-2 py-0.5 text-xs uppercase"
											>
												{k}
											</span>
										))}
								</div>
							</div>
							<div className="flex flex-col gap-2 bg-background p-4">
								{[
									{ label: "Schedule", on: schedule },
									{ label: "Alerts", on: alerts },
									{ label: "Auto-off", on: autoOff },
								].map((item) => (
									<div
										key={item.label}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-muted-foreground">{item.label}</span>
										<span
											className={cn(
												"font-medium",
												item.on ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{item.on ? "On" : "Off"}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</BorderGridCell>
			</BorderGrid>

			<div className="flex items-center justify-end gap-3">
				<Button type="button" variant="outline">
					Cancel
				</Button>
				<Button type="submit">
					<IconCheck className="size-4" data-icon="inline-start" />
					Save device
				</Button>
			</div>
		</form>
	);
}

function SectionPanel({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="border-b border-dashed border-border last:border-b-0">
			<BorderPanel
				header={<BorderPanelHeader title={title} description={description} />}
				bodyPad="default"
				className="border-0"
			>
				{children}
			</BorderPanel>
		</div>
	);
}

function ToggleRow({
	label,
	description,
	checked,
	onCheckedChange,
	last,
}: {
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (v: boolean) => void;
	last?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4 py-3",
				!last && "border-b border-dashed border-border",
			)}
		>
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-medium">{label}</span>
				<span className="text-sm text-muted-foreground">{description}</span>
			</div>
			<Switch checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}
