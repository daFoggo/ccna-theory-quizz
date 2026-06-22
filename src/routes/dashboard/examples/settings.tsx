import {
	IconBell,
	IconDeviceDesktop,
	IconMoon,
	IconPalette,
	IconShield,
	IconSun,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BorderPanel, BorderPanelHeader } from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/examples/settings")({
	staticData: {
		getTitle: () => "Settings",
		pageHeader: {
			title: "Settings",
			description:
				"Line tabs switching between sectioned toggles and field groups.",
		},
	},
	component: SettingsDemoPage,
});

function SettingsDemoPage() {
	const [tab, setTab] = useState("general");

	return (
		<div className="flex flex-col border border-dashed border-border">
			<div className="border-b border-dashed border-border px-6 pt-4">
				<Tabs value={tab} onValueChange={setTab}>
					<TabsList variant="line">
						<TabsTrigger value="general">
							<IconDeviceDesktop className="size-4" data-icon="inline-start" />
							General
						</TabsTrigger>
						<TabsTrigger value="appearance">
							<IconPalette className="size-4" data-icon="inline-start" />
							Appearance
						</TabsTrigger>
						<TabsTrigger value="notifications">
							<IconBell className="size-4" data-icon="inline-start" />
							Notifications
						</TabsTrigger>
						<TabsTrigger value="security">
							<IconShield className="size-4" data-icon="inline-start" />
							Security
						</TabsTrigger>
					</TabsList>

					<TabsContent value="general" className="p-6">
						<div className="flex flex-col gap-6">
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Profile"
										description="Your display name and contact email."
									/>
								}
							>
								<FieldGroup>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<Field>
											<FieldLabel htmlFor="s-name">Display name</FieldLabel>
											<Input id="s-name" defaultValue="Sarah K." />
										</Field>
										<Field>
											<FieldLabel htmlFor="s-email">Email</FieldLabel>
											<Input
												id="s-email"
												type="email"
												defaultValue="sarah@home.io"
											/>
										</Field>
									</div>
								</FieldGroup>
							</BorderPanel>

							<BorderPanel
								header={
									<BorderPanelHeader
										title="Preferences"
										description="Default landing page and data refresh interval."
									/>
								}
							>
								<div className="flex flex-col">
									<ToggleRow
										label="Auto-refresh dashboard"
										description="Poll device status every 30 seconds."
										defaultChecked
									/>
									<ToggleRow
										label="Compact sidebar"
										description="Collapse sidebar groups by default."
									/>
									<ToggleRow
										label="Beta features"
										description="Enable experimental features before general release."
										last
									/>
								</div>
							</BorderPanel>
							<SaveBar onSave={() => toast.success("Settings saved (demo).")} />
						</div>
					</TabsContent>

					<TabsContent value="appearance" className="p-6">
						<div className="flex flex-col gap-6">
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Theme"
										description="Light, dark or follow system preference."
									/>
								}
							>
								<ThemeSelector />
							</BorderPanel>
							<SaveBar
								onSave={() => toast.success("Appearance saved (demo).")}
							/>
						</div>
					</TabsContent>

					<TabsContent value="notifications" className="p-6">
						<div className="flex flex-col gap-6">
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Channels"
										description="Where you receive alerts."
									/>
								}
							>
								<div className="flex flex-col">
									<ToggleRow
										label="Email alerts"
										description="Receive power and status alerts via email."
										defaultChecked
									/>
									<ToggleRow
										label="Push notifications"
										description="Browser push for critical events."
										defaultChecked
									/>
									<ToggleRow
										label="Telegram"
										description="Send alerts to your linked Telegram bot."
										last
									/>
								</div>
							</BorderPanel>
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Alert types"
										description="Choose which events trigger notifications."
									/>
								}
							>
								<div className="flex flex-col">
									<ToggleRow
										label="Device offline"
										description="A device goes offline for 5+ minutes."
										defaultChecked
									/>
									<ToggleRow
										label="Power threshold exceeded"
										description="Consumption crosses your set limit."
										defaultChecked
									/>
									<ToggleRow
										label="Schedule started"
										description="A device schedule kicks in."
									/>
									<ToggleRow
										label="Firmware update available"
										description="New firmware detected for a device."
										last
									/>
								</div>
							</BorderPanel>
							<SaveBar
								onSave={() => toast.success("Notifications saved (demo).")}
							/>
						</div>
					</TabsContent>

					<TabsContent value="security" className="p-6">
						<div className="flex flex-col gap-6">
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Password"
										description="Change your account password."
									/>
								}
							>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="s-current">
											Current password
										</FieldLabel>
										<Input
											id="s-current"
											type="password"
											placeholder="Enter current password"
										/>
									</Field>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<Field>
											<FieldLabel htmlFor="s-new">New password</FieldLabel>
											<Input
												id="s-new"
												type="password"
												placeholder="Enter new password"
											/>
											<FieldDescription>
												Minimum 8 characters with a number.
											</FieldDescription>
										</Field>
										<Field>
											<FieldLabel htmlFor="s-confirm">
												Confirm password
											</FieldLabel>
											<Input
												id="s-confirm"
												type="password"
												placeholder="Repeat new password"
											/>
										</Field>
									</div>
								</FieldGroup>
							</BorderPanel>
							<BorderPanel
								header={
									<BorderPanelHeader
										title="Sessions"
										description="Active login sessions on your account."
									/>
								}
							>
								<div className="flex flex-col">
									<SessionRow
										label="Current session"
										detail="Chrome on Linux · This device"
										active
									/>
									<SessionRow
										label="Telegram bot"
										detail="Linked 3 months ago"
										last
									/>
								</div>
							</BorderPanel>
							<SaveBar
								onSave={() => toast.success("Security settings saved (demo).")}
								label="Update password"
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

function ToggleRow({
	label,
	description,
	defaultChecked,
	last,
}: {
	label: string;
	description: string;
	defaultChecked?: boolean;
	last?: boolean;
}) {
	const [checked, setChecked] = useState(!!defaultChecked);
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
			<Switch checked={checked} onCheckedChange={setChecked} />
		</div>
	);
}

function ThemeSelector() {
	const [theme, setTheme] = useState("system");
	const options = [
		{ value: "light", label: "Light", icon: IconSun },
		{ value: "dark", label: "Dark", icon: IconMoon },
		{ value: "system", label: "System", icon: IconDeviceDesktop },
	];
	return (
		<div className="grid grid-cols-3 gap-3">
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					onClick={() => setTheme(opt.value)}
					className={cn(
						"flex flex-col items-center gap-2 border p-4 transition-colors",
						theme === opt.value
							? "border-foreground bg-secondary"
							: "border-dashed border-border hover:bg-muted",
					)}
					aria-pressed={theme === opt.value}
				>
					<opt.icon
						className={cn(
							"size-5",
							theme === opt.value ? "text-foreground" : "text-muted-foreground",
						)}
					/>
					<span className="text-sm font-medium">{opt.label}</span>
				</button>
			))}
		</div>
	);
}

function SessionRow({
	label,
	detail,
	active,
	last,
}: {
	label: string;
	detail: string;
	active?: boolean;
	last?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4 border-b border-dashed border-border py-3",
				last && "border-b-0",
			)}
		>
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-medium">{label}</span>
				<span className="text-sm text-muted-foreground">{detail}</span>
			</div>
			{active ? (
				<Button variant="outline" size="sm" disabled>
					Current
				</Button>
			) : (
				<Button variant="ghost" size="sm">
					Revoke
				</Button>
			)}
		</div>
	);
}

function SaveBar({
	onSave,
	label = "Save changes",
}: {
	onSave: () => void;
	label?: string;
}) {
	return (
		<div className="flex items-center justify-end gap-3">
			<Button type="button" variant="outline">
				Reset
			</Button>
			<Button type="button" onClick={onSave}>
				{label}
			</Button>
		</div>
	);
}
