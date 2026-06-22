import { IconBook } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/$experimentId/devices")({
	staticData: {
		getTitle: () => "Devices",
		hideSidebar: false,
	},
	component: () => (
		<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
			<IconBook className="size-10 text-muted-foreground" />
			<h2 className="font-heading text-lg font-semibold text-foreground">
				Study Notes
			</h2>
			<p className="text-sm text-muted-foreground max-w-md">
				Detailed study content for this subtopic is being prepared.
			</p>
			<Button variant="outline" onClick={() => window.history.back()}>
				Go back
			</Button>
		</div>
	),
});
