import { IconCheck, IconHome, IconLoader2, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderList,
	BorderListItem,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { getAttemptResultsFn, quizKeys } from "@/features/quiz";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/results/$attemptId")({
	staticData: {
		getTitle: () => "Results",
		hideSidebar: false,
	},
	component: ResultsPage,
});

function ResultsPage() {
	const { attemptId } = useParams({ from: "/dashboard/results/$attemptId" });
	const navigate = useNavigate();

	const { data, isLoading, error } = useQuery({
		queryKey: quizKeys.attemptResults(attemptId),
		queryFn: () => getAttemptResultsFn({ data: { attemptId } }),
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<IconLoader2 className="size-6 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex flex-col items-center gap-4 py-20">
				<p className="text-sm text-destructive">Failed to load results</p>
				<Button
					variant="outline"
					onClick={() => navigate({ to: "/dashboard/history" })}
				>
					Back to History
				</Button>
			</div>
		);
	}

	const { attempt, answers } = data;
	const pct = Math.round((attempt.score / attempt.total) * 100);

	return (
		<div className="flex flex-col gap-8">
			<BorderGrid cols={2}>
				<BorderGridCell pad="compact">
					<div className="flex flex-col gap-1">
						<span className="text-xs text-muted-foreground uppercase tracking-wider">
							Score
						</span>
						<span className="font-heading text-3xl font-semibold tracking-tight text-foreground">
							{attempt.score}/{attempt.total}
						</span>
					</div>
				</BorderGridCell>
				<BorderGridCell pad="compact">
					<div className="flex flex-col gap-1">
						<span className="text-xs text-muted-foreground uppercase tracking-wider">
							Percentage
						</span>
						<span
							className={cn(
								"font-heading text-3xl font-semibold tracking-tight",
								pct >= 80
									? "text-chart-1"
									: pct >= 60
										? "text-chart-3"
										: "text-chart-7",
							)}
						>
							{pct}%
						</span>
					</div>
				</BorderGridCell>
			</BorderGrid>

			<div>
				<div className="mb-4">
					<BorderSectionHeader
						title="Review Answers"
						description={attempt.topic}
					/>
				</div>
				<BorderList>
					{answers.map((a) => {
						const correctText = a.question?.correctAnswers
							.map(
								(k) => a.question?.options.find((o) => o.key === k)?.text ?? k,
							)
							.join(", ");

						return (
							<BorderListItem
								key={a.question_id}
								pad="tight"
								tone={a.is_correct ? "default" : "muted"}
							>
								<div className="flex items-start gap-3">
									<div
										className={cn(
											"mt-0.5 flex size-5 shrink-0 items-center justify-center rounded",
											a.is_correct
												? "bg-chart-1/10 text-chart-1"
												: "bg-chart-7/10 text-chart-7",
										)}
									>
										{a.is_correct ? (
											<IconCheck className="size-3.5" />
										) : (
											<IconX className="size-3.5" />
										)}
									</div>
									<div className="flex min-w-0 flex-1 flex-col gap-1">
										<p className="text-sm font-medium text-foreground">
											{a.question?.question ?? a.question_id}
										</p>
										<p className="text-xs text-muted-foreground">
											You answered:{" "}
											{a.selected_answers
												.map(
													(k: string) =>
														a.question?.options.find((o) => o.key === k)
															?.text ?? k,
												)
												.join(", ") || "Nothing"}
										</p>
										{!a.is_correct && correctText && (
											<p className="text-xs text-chart-1">
												Correct: {correctText}
											</p>
										)}
										{a.question?.explanation && (
											<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
												{a.question.explanation}
											</p>
										)}
									</div>
								</div>
							</BorderListItem>
						);
					})}
				</BorderList>
			</div>

			<div className="flex items-center justify-center gap-3">
				<Button
					variant="outline"
					onClick={() => navigate({ to: "/dashboard" })}
				>
					<IconHome />
					Home
				</Button>
				<Button
					variant="outline"
					onClick={() => navigate({ to: "/dashboard/history" })}
				>
					Back to History
				</Button>
			</div>
		</div>
	);
}
