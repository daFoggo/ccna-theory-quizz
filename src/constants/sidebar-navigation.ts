import { IconCards, IconChecks, IconHistory } from "@tabler/icons-react";
import type { INavigationGroup } from "@/types/sidebar";

export const getSidebarGroups = (): INavigationGroup[] => [
	{
		items: [{ title: "Dashboard", icon: IconChecks, to: "/dashboard" }],
	},
	{
		items: [
			{ title: "Quizzes Test", icon: IconCards, to: "/dashboard/quiz" },
			{ title: "History", icon: IconHistory, to: "/dashboard/history" },
		],
	},
];
