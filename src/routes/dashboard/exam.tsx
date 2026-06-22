import { createFileRoute } from "@tanstack/react-router";
import { ExamSession } from "@/features/quiz/components/exam-session";

export const Route = createFileRoute("/dashboard/exam")({
	staticData: {
		getTitle: () => "Mixed Exam",
		hideSidebar: true,
		pageContainerSize: "full",
	},
	component: ExamSession,
});
