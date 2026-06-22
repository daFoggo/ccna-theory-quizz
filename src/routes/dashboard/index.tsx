import {
	IconArrowRight,
	IconBrain,
	IconChecks,
	IconNetwork,
	IconRouter,
	IconScoreboard,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
	staticData: {
		hideSidebar: true,
		hideHeader: true,
		getTitle: () => "Dashboard",
	},
	component: DashboardHome,
});

const stats = [
	{ label: "Topics", value: "5", icon: IconNetwork, sub: "Total categories" },
	{ label: "Quizzes Taken", value: "12", icon: IconBrain, sub: "All time" },
	{
		label: "Avg. Score",
		value: "82%",
		icon: IconScoreboard,
		sub: "Last 10 quizzes",
	},
	{ label: "Flashcards", value: "48", icon: IconChecks, sub: "Mastered" },
];

const topics = [
	{
		id: "network-fundamentals",
		title: "Network Fundamentals",
		description: "OSI model, TCP/IP, Ethernet, cabling, and topologies",
		icon: IconNetwork,
		progress: 60,
	},
	{
		id: "ip-connectivity",
		title: "IP Connectivity",
		description: "Routing concepts, static routing, OSPF, inter-VLAN routing",
		icon: IconRouter,
		progress: 30,
	},
];

function DashboardHome() {
	const navigate = useNavigate();

	return (
		<div className="mx-auto w-full max-w-300 px-4 py-6 lg:px-6 xl:px-10">
			<div className="mb-8">
				<h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
					CCNA Theory
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Study and prepare for the Cisco CCNA certification
				</p>
			</div>

			<div className="mb-8">
				<BorderGrid cols={4}>
					{stats.map((stat) => (
						<BorderGridCell key={stat.label} pad="compact">
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground uppercase tracking-wider">
										{stat.label}
									</span>
									<stat.icon className="size-4 text-muted-foreground" />
								</div>
								<div className="flex items-end justify-between">
									<span className="font-heading text-2xl font-semibold tracking-tight">
										{stat.value}
									</span>
									<span className="text-xs text-muted-foreground">
										{stat.sub}
									</span>
								</div>
							</div>
						</BorderGridCell>
					))}
				</BorderGrid>
			</div>

			<div className="mb-6">
				<BorderSectionHeader
					title="Continue Studying"
					description="Pick up where you left off"
				/>
			</div>

			<BorderGrid cols={2}>
				{topics.map((topic) => (
					<BorderGridCell key={topic.id} pad="compact" tone="default">
						<button
							type="button"
							className="flex w-full items-center gap-4 text-left"
							onClick={() =>
								navigate({
									to: "/dashboard/$experimentId",
									params: { experimentId: topic.id },
								})
							}
						>
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<topic.icon className="size-5" />
							</div>
							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<span className="text-sm font-medium text-foreground">
									{topic.title}
								</span>
								<span className="text-xs text-muted-foreground line-clamp-1">
									{topic.description}
								</span>
								<div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
									<div
										className={cn(
											"h-full rounded-full transition-all",
											topic.progress >= 50 ? "bg-chart-1" : "bg-chart-3",
										)}
										style={{ width: `${topic.progress}%` }}
									/>
								</div>
							</div>
							<IconArrowRight className="size-4 shrink-0 text-muted-foreground" />
						</button>
					</BorderGridCell>
				))}
			</BorderGrid>

			<div className="mt-8 flex justify-center">
				<Button
					size="lg"
					onClick={() =>
						navigate({
							to: "/dashboard/$experimentId",
							params: { experimentId: "network-fundamentals" },
						})
					}
				>
					<IconBrain />
					Start Studying
				</Button>
			</div>
		</div>
	);
}
