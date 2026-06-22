/**
 * Cấu hình thông tin cơ bản của website như title, description và default metadata.
 * Được sử dụng tập trung cho việc hiển thị page title và hỗ trợ SEO.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "CCNATheory",
		description:
			"Practice quizzes and study tools for Cisco CCNA certification preparation",
		keywords: ["CCNA", "Cisco", "networking", "quiz", "certification"],
	},
	app: {
		title: "CCNATheory",
		slogan: "Master the CCNA. One question at a time.",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
