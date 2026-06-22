import { IconBrain } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/quiz")({
	staticData: {
		getTitle: () => "Quiz",
		hideSidebar: false,
	},
	component: QuizPage,
});

const topics = [
	{ title: "Network Fundamentals", questions: 15 },
	{ title: "IP Connectivity", questions: 12 },
	{ title: "IP Services", questions: 10 },
	{ title: "Security Fundamentals", questions: 10 },
	{ title: "Automation & Programmability", questions: 8 },
];

function QuizPage() {
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
					Practice Quiz
				</h1>
				<p className="mt-1 text-sm text-muted-foreground max-w-2xl">
					Test your knowledge with topic-specific quizzes. Choose a category
					below to get started.
				</p>
			</div>

			<div>
				<BorderSectionHeader
					title="Quiz Categories"
					description="Select a topic to begin"
				/>
				<BorderGrid cols={2}>
					{topics.map((topic) => (
						<BorderGridCell key={topic.title} pad="compact">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<IconBrain className="size-4" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">
											{topic.title}
										</span>
										<span className="text-xs text-muted-foreground">
											{topic.questions} questions
										</span>
									</div>
								</div>
								<Button size="sm">Start</Button>
							</div>
						</BorderGridCell>
					))}
				</BorderGrid>
			</div>
		</div>
	);
}
