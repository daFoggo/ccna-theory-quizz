import { createClient } from "@supabase/supabase-js";
import "@tanstack/react-start/server-only";
import type { TAttempt, TSaveAttempt } from "./schemas";

function getSupabase(accessToken: string) {
	return createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
			global: { headers: { Authorization: `Bearer ${accessToken}` } },
		},
	);
}

export async function saveAttempt(
	accessToken: string,
	userId: string,
	data: TSaveAttempt,
): Promise<string> {
	const supabase = getSupabase(accessToken);

	const { data: attempt, error: attemptError } = await supabase
		.from("quiz_attempts")
		.insert({ user_id: userId, topic: data.topic, score: data.score, total: data.total })
		.select("id")
		.single();

	if (attemptError) throw attemptError;

	const results = data.answers.map((a) => ({
		user_id: userId,
		attempt_id: attempt.id,
		question_id: a.question_id,
		selected_answers: a.selected_answers,
		is_correct: a.is_correct,
	}));

	const { error: resultsError } = await supabase
		.from("question_results")
		.insert(results);

	if (resultsError) throw resultsError;

	return attempt.id;
}

export async function getAttempts(
	accessToken: string,
	userId: string,
): Promise<TAttempt[]> {
	const supabase = getSupabase(accessToken);

	const { data, error } = await supabase
		.from("quiz_attempts")
		.select("id, topic, score, total, completed_at")
		.eq("user_id", userId)
		.order("completed_at", { ascending: false })
		.limit(50);

	if (error) throw error;
	return data ?? [];
}

export async function getAttemptResults(
	accessToken: string,
	attemptId: string,
) {
	const supabase = getSupabase(accessToken);

	const { data: attempt, error: attemptError } = await supabase
		.from("quiz_attempts")
		.select("id, topic, score, total, completed_at")
		.eq("id", attemptId)
		.single();

	if (attemptError) throw attemptError;

	const { data: results, error: resultsError } = await supabase
		.from("question_results")
		.select("question_id, selected_answers, is_correct")
		.eq("attempt_id", attemptId);

	if (resultsError) throw resultsError;

	const { getQuestion } = await import("@/lib/questions");
	const answers = results.map((r) => ({
		...r,
		question: getQuestion(r.question_id),
	}));

	return { attempt, answers };
}
