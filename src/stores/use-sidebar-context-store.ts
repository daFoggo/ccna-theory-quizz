import { create } from "zustand";

interface ISidebarContextStore {
	activeContextId: string;
	routeParams: Record<string, string>;
	syncWithPathname: (_pathname: string) => void;
	reset: () => void;
}

export const useSidebarContextStore = create<ISidebarContextStore>()((set) => ({
	activeContextId: "default",
	routeParams: {},
	syncWithPathname: (_pathname) => {
		set(() => ({
			activeContextId: "default",
			routeParams: {},
		}));
	},
	reset: () => {
		set(() => ({
			activeContextId: "default",
			routeParams: {},
		}));
	},
}));
