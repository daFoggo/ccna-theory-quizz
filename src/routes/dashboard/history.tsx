import { IconBrain, IconHistory } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { attemptsQueryOptions } from "@/features/quiz";
import { BorderList, BorderListItem } from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/history")({
	staticData: {
		getTitle: () => "History",
		hideSidebar: false,
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(attemptsQueryOptions());
	},
	component: HistoryPage,
});

function HistoryPage() {
	const navigate = useNavigate();
	const { data: attempts } = useSuspenseQuery(attemptsQueryOptions());

	if (attempts.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-border p-6">
				<Empty>
					<EmptyHeader>
						<EmptyMedia><IconHistory className="size-4" /></EmptyMedia>
						<EmptyTitle>No attempts yet</EmptyTitle>
					</EmptyHeader>
					<EmptyContent>
						<p className="text-sm text-muted-foreground">Take your first quiz to see your history here.</p>
						<Button className="mt-4" size="sm" onClick={() => navigate({ to: "/dashboard/quiz" })}>
							<IconBrain /> Take a Quiz
						</Button>
					</EmptyContent>
				</Empty>
			</div>
		);
	}

	return (
		<BorderList>
			{attempts.map((attempt) => {
				const pct = Math.round((attempt.score / attempt.total) * 100);
				return (
					<BorderListItem key={attempt.id} pad="tight" tone="default">
						<div className="flex items-center gap-3">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<IconBrain className="size-4" />
							</div>
							<div className="flex min-w-0 flex-1 flex-col">
								<span className="text-sm font-medium text-foreground capitalize">
									{attempt.topic.replace(/-/g, " ")}
								</span>
								<span className="text-xs text-muted-foreground">
									{new Date(attempt.completed_at).toLocaleDateString()} · {attempt.score}/{attempt.total}
								</span>
							</div>
							<span className={cn("text-sm font-semibold tabular-nums", pct >= 80 ? "text-chart-1" : pct >= 60 ? "text-chart-3" : "text-chart-7")}>{pct}%</span>
							<Button size="sm" variant="ghost" onClick={() => navigate({ to: "/dashboard/results/$attemptId", params: { attemptId: attempt.id } })}>
								View
							</Button>
						</div>
					</BorderListItem>
				);
			})}
		</BorderList>
	);
}
