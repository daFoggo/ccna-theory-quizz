import automationAndProgrammability from "../../data/automation-and-programmability.json";
import ipConnectivity from "../../data/ip-connectivity.json";
import ipServices from "../../data/ip-services.json";
import networkAccess from "../../data/network-access.json";
import networkFundamentals from "../../data/network-fundamentals.json";
import securityFundamentals from "../../data/security-fundamentals.json";
import virtualizationAndCloud from "../../data/virtualization-and-cloud.json";
import wireless from "../../data/wireless.json";

export interface QuestionOption {
	key: string;
	text: string;
}

export interface Question {
	qs: string;
	question: string;
	options: QuestionOption[];
	correctAnswers: string[];
	topics: string[];
	type: "single-answer" | "multiple-answer";
	difficulty: "easy" | "medium" | "hard";
	explanation: string;
}

export interface TopicGroup {
	id: string;
	title: string;
	questions: Question[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
	{
		id: "network-fundamentals",
		title: "Network Fundamentals",
		questions: networkFundamentals as Question[],
	},
	{
		id: "network-access",
		title: "Network Access",
		questions: networkAccess as Question[],
	},
	{
		id: "ip-connectivity",
		title: "IP Connectivity",
		questions: ipConnectivity as Question[],
	},
	{
		id: "ip-services",
		title: "IP Services",
		questions: ipServices as Question[],
	},
	{
		id: "security",
		title: "Security Fundamentals",
		questions: securityFundamentals as Question[],
	},
	{
		id: "wireless",
		title: "Wireless",
		questions: wireless as Question[],
	},
	{
		id: "virtualization-cloud",
		title: "Virtualization & Cloud",
		questions: virtualizationAndCloud as Question[],
	},
	{
		id: "automation",
		title: "Automation & Programmability",
		questions: automationAndProgrammability as Question[],
	},
];

export function getTopicQuestions(topicId: string): Question[] {
	const group = TOPIC_GROUPS.find((g) => g.id === topicId);
	return group?.questions ?? [];
}

export function getTopic(topicId: string): TopicGroup | undefined {
	return TOPIC_GROUPS.find((g) => g.id === topicId);
}

export function getQuestion(questionId: string): Question | undefined {
	for (const group of TOPIC_GROUPS) {
		const q = group.questions.find((q) => q.qs === questionId);
		if (q) return q;
	}
	return undefined;
}

export function getMixedExamQuestions(count = 50): Question[] {
	const total = TOPIC_GROUPS.reduce((s, g) => s + g.questions.length, 0);
	const result: Question[] = [];

	for (const group of TOPIC_GROUPS) {
		const proportion = group.questions.length / total;
		const take = Math.max(1, Math.round(count * proportion));
		const shuffled = [...group.questions].sort(() => Math.random() - 0.5);
		result.push(...shuffled.slice(0, Math.min(take, group.questions.length)));
	}

	// Shuffle final result and trim to count
	return result.sort(() => Math.random() - 0.5).slice(0, count);
}
