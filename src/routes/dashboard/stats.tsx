import {
	IconCalendar,
	IconChartBar,
	IconScoreboard,
	IconTrendingUp,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";

export const Route = createFileRoute("/dashboard/stats")({
	staticData: {
		getTitle: () => "Statistics",
		hideSidebar: false,
	},
	component: StatsPage,
});

const stats = [
	{
		label: "Quizzes Completed",
		value: "12",
		icon: IconScoreboard,
		sub: "All time",
	},
	{
		label: "Average Score",
		value: "82%",
		icon: IconTrendingUp,
		sub: "Last 10 quizzes",
	},
	{
		label: "Study Streak",
		value: "5 days",
		icon: IconCalendar,
		sub: "Current",
	},
	{
		label: "Flashcards Mastered",
		value: "48",
		icon: IconChartBar,
		sub: "Of 120 total",
	},
];

function StatsPage() {
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
					Your Progress
				</h1>
				<p className="mt-1 text-sm text-muted-foreground max-w-2xl">
					Track your study progress and quiz performance over time.
				</p>
			</div>

			<div>
				<BorderSectionHeader
					title="Overview"
					description="Your study statistics at a glance"
				/>
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

			<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
				<IconChartBar className="size-10 text-muted-foreground" />
				<h3 className="font-heading text-base font-semibold text-foreground">
					Detailed charts coming soon
				</h3>
				<p className="text-sm text-muted-foreground max-w-md">
					Quiz score trends, topic-wise breakdown, and study time analytics will
					appear here once you start taking quizzes.
				</p>
			</div>
		</div>
	);
}
