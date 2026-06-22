/**
 * Cấu hình thông tin cơ bản của website như title, description và default metadata.
 * Được sử dụng tập trung cho việc hiển thị page title và hỗ trợ SEO.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "AnnoBot",
		description:
			"Smart home IoT data labeling platform for energy-efficient device management",
		keywords: [
			"AnnoBot",
			"IoT",
			"smart home",
			"data labeling",
			"energy monitoring",
		],
	},
	app: {
		title: "AnnoBot",
		slogan: "Label smarter. Save energy.",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
