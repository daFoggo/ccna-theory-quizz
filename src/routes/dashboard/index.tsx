import {
	IconArrowRight,
	IconArrowsShuffle,
	IconCards,
	IconChecks,
	IconHistory,
	IconScoreboard,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BorderGrid, BorderGridCell } from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { attemptsQueryOptions } from "@/features/quiz";
import { TOPIC_GROUPS } from "@/lib/questions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
	staticData: {
		hideSidebar: true,
		getTitle: () => "Dashboard",
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(attemptsQueryOptions());
	},
	component: DashboardHome,
});

function DashboardHome() {
	const navigate = useNavigate();
	const { data: attempts } = useSuspenseQuery(attemptsQueryOptions());

	const totalQs = TOPIC_GROUPS.reduce((s, g) => s + g.questions.length, 0);
	const all = attempts ?? [];
	const totalAttempts = all.length;
	const totalAnswered = all.reduce((s, a) => s + a.total, 0);
	const totalCorrect = all.reduce((s, a) => s + a.score, 0);
	const avgPct =
		totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

	const topicAttempts = new Map<
		string,
		{
			fullScores: number[];
			fullTotals: number[];
			fullRecent: { score: number; total: number } | null;
		}
	>();
	for (const a of all) {
		if (a.topic === "mixed-exam" || a.type !== "quiz") continue;
		const cur = topicAttempts.get(a.topic) ?? {
			fullScores: [],
			fullTotals: [],
			fullRecent: null,
		};
		cur.fullScores.push(a.score);
		cur.fullTotals.push(a.total);
		cur.fullRecent = { score: a.score, total: a.total };
		topicAttempts.set(a.topic, cur);
	}

	const cards = [
		{
			label: "Quizzes Test",
			value: String(totalAttempts),
			icon: IconCards,
			sub: "Total taken",
		},
		{
			label: "Avg. Score",
			value: `${avgPct}%`,
			icon: IconScoreboard,
			sub: "All time",
		},
		{
			label: "Question Bank",
			value: String(totalQs),
			icon: IconChecks,
			sub: "Total questions",
		},
		{
			label: "Topics",
			value: String(TOPIC_GROUPS.length),
			icon: IconHistory,
			sub: "CCNA domains",
		},
	];

	return (
		<div className="flex flex-col gap-8">
			<BorderGrid cols={4}>
				{cards.map((card) => (
					<BorderGridCell key={card.label} pad="compact">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<span className="text-xs text-muted-foreground uppercase tracking-wider">
									{card.label}
								</span>
								<card.icon className="size-4 text-muted-foreground" />
							</div>
							<div className="flex items-end justify-between">
								<span className="font-heading text-2xl font-semibold tracking-tight">
									{card.value}
								</span>
								<span className="text-xs text-muted-foreground">
									{card.sub}
								</span>
							</div>
						</div>
					</BorderGridCell>
				))}
			</BorderGrid>

			<BorderGrid cols={2}>
				{TOPIC_GROUPS.map((topic) => {
					const data = topicAttempts.get(topic.id);
					const best = data?.fullScores.length
						? Math.max(
								...data.fullScores.map((s, i) =>
									Math.round((s / data.fullTotals[i]) * 100),
								),
							)
						: null;
					const lastScore = data?.fullRecent
						? Math.round((data.fullRecent.score / data.fullRecent.total) * 100)
						: null;

					return (
						<BorderGridCell key={topic.id} pad="compact" tone="default">
							<button
								type="button"
								className="flex w-full items-center gap-4 text-left"
								onClick={() =>
									navigate({
										to: "/dashboard/quiz/$topic",
										params: { topic: topic.id },
									})
								}
							>
								<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<IconCards className="size-5" />
								</div>
								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									<span className="text-sm font-medium text-foreground">
										{topic.title}
									</span>
									<span className="text-xs text-muted-foreground">
										{topic.questions.length} questions
									</span>
								</div>
								{best !== null && (
									<div className="flex shrink-0 flex-col gap-1 text-xs">
										<span className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-0.5 text-muted-foreground">
											Best
											<span
												className={cn(
													"font-semibold tabular-nums",
													best >= 80 ? "text-chart-1" : "text-chart-3",
												)}
											>
												{best}%
											</span>
										</span>
										{lastScore !== null && (
											<span className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-0.5 text-muted-foreground">
												Last
												<span
													className={cn(
														"font-semibold tabular-nums",
														lastScore >= 80
															? "text-chart-1"
															: lastScore >= 60
																? "text-chart-3"
																: "text-chart-7",
													)}
												>
													{lastScore}%
												</span>
											</span>
										)}
									</div>
								)}
								<IconArrowRight className="size-4 shrink-0 text-muted-foreground" />
							</button>
						</BorderGridCell>
					);
				})}
			</BorderGrid>

			<div className="flex items-center justify-center gap-3">
				<Button onClick={() => navigate({ to: "/dashboard/exam" })}>
					<IconArrowsShuffle /> Mixed Quizzes Test (50)
				</Button>
				{totalAttempts > 0 && (
					<Button
						variant="outline"
						onClick={() => navigate({ to: "/dashboard/history" })}
					>
						<IconHistory /> History
					</Button>
				)}
			</div>
		</div>
	);
}
