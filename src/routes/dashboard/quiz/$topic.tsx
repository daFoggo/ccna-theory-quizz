import { createFileRoute, useParams } from "@tanstack/react-router";
import { QuizSession } from "@/features/quiz/components/quiz-session";

export const Route = createFileRoute("/dashboard/quiz/$topic")({
	staticData: {
		getTitle: () => "Quizzes Test",
		hideSidebar: true,
		pageContainerSize: "full",
	},
	component: QuizPage,
});

function QuizPage() {
	const { topic } = useParams({ from: "/dashboard/quiz/$topic" });
	return <QuizSession topic={topic} />;
}
