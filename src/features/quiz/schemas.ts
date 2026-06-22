import { z } from "zod";

export const SaveAttemptSchema = z.object({
	topic: z.string(),
	score: z.number(),
	total: z.number(),
	answers: z.array(
		z.object({
			question_id: z.string(),
			selected_answers: z.array(z.string()),
			is_correct: z.boolean(),
		}),
	),
});

export const AttemptSchema = z.object({
	id: z.string(),
	topic: z.string(),
	score: z.number(),
	total: z.number(),
	completed_at: z.string(),
});

export type TSaveAttempt = z.infer<typeof SaveAttemptSchema>;
export type TAttempt = z.infer<typeof AttemptSchema>;
