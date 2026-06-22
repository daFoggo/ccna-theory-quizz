import { IconCheck, IconChevronLeft, IconChevronRight, IconHome, IconLoader2, IconRotate, IconX } from "@tabler/icons-react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BorderGrid, BorderGridCell, BorderList, BorderListItem } from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTopic, type Question } from "@/lib/questions";
import { saveAttemptFn } from "@/features/quiz";

export const Route = createFileRoute("/dashboard/quiz/$topic")({
	staticData: {
		getTitle: () => "Quiz",
		hideSidebar: true,
		pageContainerSize: "full",
	},
	component: QuizSession,
});

function QuizSession() {
	const { topic } = useParams({ from: "/dashboard/quiz/$topic" });
	const navigate = useNavigate();

	const topicData = useMemo(() => getTopic(topic), [topic]);
	const [questions, setQuestions] = useState<Question[]>(() => {
		if (!topicData) return [];
		return [...topicData.questions].sort(() => Math.random() - 0.5);
	});

	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<string[]>([]);
	const [submitted, setSubmitted] = useState(false);
	const [saving, setSaving] = useState(false);
	const [done, setDone] = useState(false);
	const answersRef = useRef<{ question_id: string; selected_answers: string[]; is_correct: boolean }[]>([]);

	const q = questions[index];
	const isLast = index === questions.length - 1;
	const isCorrect = submitted && selected.length === q?.correctAnswers.length && selected.every((s) => q.correctAnswers.includes(s));

	const handleSelect = useCallback((key: string) => {
		if (submitted || !q) return;

		if (q.type === "multiple-answer") {
			const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
			setSelected(next);
			if (next.length >= q.correctAnswers.length && !selected.includes(key)) {
				setSubmitted(true);
				const correct = next.length === q.correctAnswers.length && next.every((s) => q.correctAnswers.includes(s));
				const existing = answersRef.current.findIndex((a) => a.question_id === q.qs);
				if (existing >= 0) answersRef.current[existing] = { question_id: q.qs, selected_answers: next, is_correct: correct };
				else answersRef.current.push({ question_id: q.qs, selected_answers: next, is_correct: correct });
			}
		} else {
			const answer = [key];
			setSelected(answer);
			setSubmitted(true);
			const correct = key === q.correctAnswers[0];
			const existing = answersRef.current.findIndex((a) => a.question_id === q.qs);
			if (existing >= 0) answersRef.current[existing] = { question_id: q.qs, selected_answers: answer, is_correct: correct };
			else answersRef.current.push({ question_id: q.qs, selected_answers: answer, is_correct: correct });
		}
	}, [submitted, q, selected]);

	const handleNext = useCallback(async () => {
		if (isLast) {
			setSaving(true);
			try {
				const score = answersRef.current.filter((a) => a.is_correct).length;
				await saveAttemptFn({
					data: {
						topic,
						score,
						total: questions.length,
						answers: answersRef.current,
					},
				});
			} catch {
				toast.error("Failed to save results");
			}
			setDone(true);
			setSaving(false);
		} else {
			setIndex((i) => i + 1);
			setSelected([]);
			setSubmitted(false);
		}
	}, [isLast, questions.length, topic]);

	const handlePrevious = useCallback(() => {
		const prevIndex = index - 1;
		const prevQ = questions[prevIndex];
		const prevAnswer = answersRef.current.find((a) => a.question_id === prevQ?.qs);
		setIndex(prevIndex);
		setSelected(prevAnswer?.selected_answers ?? []);
		setSubmitted(!!prevAnswer);
	}, [index, questions]);

	const handleRetryWrong = useCallback(() => {
		const wrongIds = answersRef.current.filter((a) => !a.is_correct).map((a) => a.question_id);
		answersRef.current = [];
		setQuestions(questions.filter((q) => wrongIds.includes(q.qs)).sort(() => Math.random() - 0.5));
		setIndex(0);
		setSelected([]);
		setSubmitted(false);
		setDone(false);
	}, [questions]);

	if (!topicData) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20">
				<h2 className="font-heading text-lg font-semibold text-foreground">Topic not found</h2>
				<Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>Back</Button>
			</div>
		);
	}

	if (done) {
		const score = answersRef.current.filter((a) => a.is_correct).length;
		const pct = Math.round((score / questions.length) * 100);
		const wrongCount = answersRef.current.filter((a) => !a.is_correct).length;
		return (
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
				<BorderGrid cols={2}>
					<BorderGridCell pad="compact">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
							<span className="font-heading text-3xl font-semibold tracking-tight text-foreground">{score}/{questions.length}</span>
						</div>
					</BorderGridCell>
					<BorderGridCell pad="compact">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-muted-foreground uppercase tracking-wider">Percentage</span>
							<span className={cn("font-heading text-3xl font-semibold tracking-tight", pct >= 80 ? "text-chart-1" : pct >= 60 ? "text-chart-3" : "text-chart-7")}>{pct}%</span>
						</div>
					</BorderGridCell>
				</BorderGrid>

				<BorderList>
					{questions.map((q) => {
						const a = answersRef.current.find((r) => r.question_id === q.qs);
						const correct = a?.is_correct ?? false;
						const selected = a?.selected_answers ?? [];
						return (
							<BorderListItem key={q.qs} pad="tight" tone={correct ? "default" : "muted"}>
								<div className="flex items-start gap-3">
									<div className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded", correct ? "bg-chart-1/10 text-chart-1" : "bg-chart-7/10 text-chart-7")}>
										{correct ? <IconCheck className="size-3.5" /> : <IconX className="size-3.5" />}
									</div>
									<div className="flex min-w-0 flex-1 flex-col gap-1">
										<p className="text-sm font-medium text-foreground">{q.question}</p>
										<p className="text-xs text-muted-foreground">You answered: {selected.map((k) => q.options.find((o) => o.key === k)?.text ?? k).join(", ") || "Nothing"}</p>
										{!correct && <p className="text-xs text-chart-1">Correct: {q.correctAnswers.map((k) => q.options.find((o) => o.key === k)?.text ?? k).join(", ")}</p>}
									</div>
								</div>
							</BorderListItem>
						);
					})}
				</BorderList>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })}><IconHome /> Home</Button>
					<Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard/quiz/$topic", params: { topic } })}><IconRotate /> Retry All</Button>
					{wrongCount > 0 && <Button size="sm" onClick={handleRetryWrong}><IconRotate /> Retry Wrong ({wrongCount})</Button>}
				</div>
			</div>
		);
	}

	if (!q) return null;

	return (
		<div className="mx-auto flex w-full max-w-lg flex-col gap-6">
			{/* Progress */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>{topicData.title}</span>
				<span>{index + 1} / {questions.length}</span>
			</div>
			<div className="h-1 w-full rounded-full bg-secondary">
				<div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
			</div>

			{/* Question */}
			<p className="text-base font-medium leading-relaxed text-foreground">{q.question}</p>
			{q.type === "multiple-answer" && !submitted && <p className="text-xs text-muted-foreground">Select all that apply, tap selected again to confirm</p>}

			{/* Options */}
			<div className="flex flex-col gap-2">
				{q.options.map((opt) => {
					const isSelected = selected.includes(opt.key);
					const isCorrectOpt = q.correctAnswers.includes(opt.key);
					let style = "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-secondary/50";
					if (submitted && isSelected) style = isCorrectOpt ? "border-chart-1 bg-chart-1/10 text-chart-1" : "border-chart-7 bg-chart-7/10 text-chart-7";
					else if (submitted && isCorrectOpt) style = "border-chart-1/40 bg-chart-1/5 text-chart-1";
					else if (submitted) style = "border-border bg-secondary/30 text-muted-foreground";
					else if (isSelected) style = "border-primary bg-primary/5 text-foreground";

					return (
						<button key={opt.key} type="button" disabled={submitted}
							className={cn("flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors", style)}
							onClick={() => handleSelect(opt.key)}
						>
							<span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
								submitted && isSelected && isCorrectOpt ? "bg-chart-1 text-white" :
								submitted && isSelected ? "bg-chart-7 text-white" :
								submitted && isCorrectOpt ? "bg-chart-1/20 text-chart-1" :
								isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
							)}>{opt.key}</span>
							<span>{opt.text}</span>
						</button>
					);
				})}
			</div>

			{/* Result */}
			{submitted && (
				<div className={cn("rounded-lg border p-4", isCorrect ? "border-chart-1/30 bg-chart-1/5" : "border-chart-7/30 bg-chart-7/5")}>
					<p className={cn("text-sm font-medium", isCorrect ? "text-chart-1" : "text-chart-7")}>
						{isCorrect ? "Correct!" : "Incorrect"}
					</p>
					{q.explanation && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.explanation}</p>}
				</div>
			)}

			{/* Nav buttons */}
			<div className="flex justify-between">
				<Button variant="outline" size="sm" disabled={index === 0} onClick={handlePrevious}>
					<IconChevronLeft /> Previous
				</Button>
				{submitted && (
					<Button onClick={handleNext} disabled={saving}>
						{saving ? <><IconLoader2 className="animate-spin" />Saving...</> : <>{isLast ? "Finish" : "Next"} <IconChevronRight /></>}
					</Button>
				)}
			</div>
		</div>
	);
}
