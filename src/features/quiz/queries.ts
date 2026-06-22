import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { getAttemptsFn, saveAttemptFn } from "./functions";
import type { TSaveAttempt } from "./schemas";

export const quizKeys = {
	all: ["quiz"] as const,
	attempts: () => [...quizKeys.all, "attempts"] as const,
	attemptResults: (id: string) =>
		[...quizKeys.all, "attempt-results", id] as const,
};

export const attemptsQueryOptions = () =>
	queryOptions({
		queryKey: quizKeys.attempts(),
		queryFn: () => getAttemptsFn(),
	});

export const useQuizMutations = () => {
	const queryClient = useQueryClient();

	const saveAttempt = useMutation({
		mutationFn: (variables: TSaveAttempt) => saveAttemptFn({ data: variables }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: quizKeys.attempts() });
		},
	});

	return { saveAttempt };
};
