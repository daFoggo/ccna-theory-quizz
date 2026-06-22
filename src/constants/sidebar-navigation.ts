import {
	IconAutomation,
	IconBook,
	IconBrain,
	IconChartBar,
	IconChecks,
	IconNetwork,
	IconRouter,
	IconServer,
	IconShield,
} from "@tabler/icons-react";
import type { INavigationGroup } from "@/types/sidebar";

export const getSidebarGroups = (): INavigationGroup[] => [
	{
		items: [{ title: "Dashboard", icon: IconChecks, to: "/dashboard" }],
	},
	{
		label: "Study Topics",
		items: [
			{
				title: "Network Fundamentals",
				icon: IconNetwork,
				to: "/dashboard/network-fundamentals",
			},
			{
				title: "IP Connectivity",
				icon: IconRouter,
				to: "/dashboard/ip-connectivity",
			},
			{
				title: "IP Services",
				icon: IconServer,
				to: "/dashboard/ip-services",
			},
			{
				title: "Security Fundamentals",
				icon: IconShield,
				to: "/dashboard/security",
			},
			{
				title: "Automation & Programmability",
				icon: IconAutomation,
				to: "/dashboard/automation",
			},
		],
	},
	{
		label: "Practice",
		items: [
			{ title: "Quiz", icon: IconBrain, to: "/dashboard/quiz" },
			{ title: "Flashcards", icon: IconBook, to: "/dashboard/flashcards" },
		],
	},
	{
		label: "Progress",
		items: [
			{ title: "Statistics", icon: IconChartBar, to: "/dashboard/stats" },
		],
	},
];
