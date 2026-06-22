import {
	IconBrain,
	IconChecks,
	IconHistory,
} from "@tabler/icons-react";
import type { INavigationGroup } from "@/types/sidebar";

export const getSidebarGroups = (): INavigationGroup[] => [
	{
		items: [
			{ title: "Dashboard", icon: IconChecks, to: "/dashboard" },
		],
	},
	{
		items: [
			{ title: "Quiz", icon: IconBrain, to: "/dashboard/quiz" },
			{ title: "History", icon: IconHistory, to: "/dashboard/history" },
		],
	},
];
