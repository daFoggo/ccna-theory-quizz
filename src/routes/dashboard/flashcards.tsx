import { IconBook } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/flashcards")({
	staticData: {
		getTitle: () => "Flashcards",
		hideSidebar: false,
	},
	component: FlashcardsPage,
});

const decks = [
	{ title: "OSI Model", cards: 12 },
	{ title: "TCP/IP Protocol Suite", cards: 10 },
	{ title: "Subnetting", cards: 8 },
	{ title: "Routing Protocols", cards: 15 },
];

function FlashcardsPage() {
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
					Flashcards
				</h1>
				<p className="mt-1 text-sm text-muted-foreground max-w-2xl">
					Review key concepts using digital flashcards. Pick a deck and flip
					through the cards.
				</p>
			</div>

			<div>
				<BorderSectionHeader
					title="Flashcard Decks"
					description="Browse available decks"
				/>
				<BorderGrid cols={2}>
					{decks.map((deck) => (
						<BorderGridCell key={deck.title} pad="compact">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex size-9 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground">
										<IconBook className="size-4" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">
											{deck.title}
										</span>
										<span className="text-xs text-muted-foreground">
											{deck.cards} cards
										</span>
									</div>
								</div>
								<Button size="sm">Review</Button>
							</div>
						</BorderGridCell>
					))}
				</BorderGrid>
			</div>
		</div>
	);
}
