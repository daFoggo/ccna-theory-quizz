import { IconCards } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BorderGrid, BorderGridCell } from "@/components/common/grid";
import { Button } from "@/components/ui/button";
import { TOPIC_GROUPS } from "@/lib/questions";

export const Route = createFileRoute("/dashboard/quiz/")({
	staticData: {
		getTitle: () => "Quizzes Test",
		hideSidebar: false,
		pageHeader: {
			title: "Quizzes Test",
			description: "Choose a topic to test your knowledge",
		},	
	},
	component: QuizHomePage,
});

function QuizHomePage() {
	const navigate = useNavigate();

	return (
		<BorderGrid cols={2}>
			{TOPIC_GROUPS.map((topic) => (
				<BorderGridCell key={topic.id} pad="compact">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<IconCards className="size-4" />
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-medium text-foreground">
									{topic.title}
								</span>
								<span className="text-xs text-muted-foreground">
									{topic.questions.length} questions
								</span>
							</div>
						</div>
						<Button
							size="sm"
							onClick={() =>
								navigate({
									to: "/dashboard/quiz/$topic",
									params: { topic: topic.id },
								})
							}
						>
							Start
						</Button>
					</div>
				</BorderGridCell>
			))}
		</BorderGrid>
	);
}
