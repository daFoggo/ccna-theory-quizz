import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$experimentId/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/dashboard/quiz/$topic",
			params: { topic: params.experimentId },
			replace: true,
		});
	},
});
