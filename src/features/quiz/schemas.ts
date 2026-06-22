import { z } from "zod";

export const AttemptTypeSchema = z.enum(["quiz", "retry", "mixed"]);

export const SaveAttemptSchema = z.object({
	topic: z.string(),
	type: AttemptTypeSchema,
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
	type: z.string().optional(),
	score: z.number(),
	total: z.number(),
	completed_at: z.string(),
});

export type TSaveAttempt = z.infer<typeof SaveAttemptSchema>;
export type TAttempt = z.infer<typeof AttemptSchema>;
export type TAttemptType = "quiz" | "retry" | "mixed";
