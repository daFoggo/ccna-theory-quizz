import "@tanstack/react-start/server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
	DATABASE_URL: z.string().url().optional(),
	OPEN_AI_API_KEY: z.string().min(1).optional(),
	SELINE_TOKEN: z.string().min(1).optional(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (parsed.success) {
	const { DATABASE_URL, OPEN_AI_API_KEY, SELINE_TOKEN } = parsed.data;
	const missingKeys = [
		!DATABASE_URL && "DATABASE_URL",
		!OPEN_AI_API_KEY && "OPEN_AI_API_KEY",
		!SELINE_TOKEN && "SELINE_TOKEN",
	].filter(Boolean) as string[];
	if (missingKeys.length > 0) {
		console.warn(
			`[env.server] Missing server-only env vars (app will still run): ${missingKeys.join(", ")}`,
		);
	}
} else {
	console.warn("[env.server] Server env vars schema validation failed");
}

export const serverEnv = parsed.success
	? parsed.data
	: ({} as z.infer<typeof serverEnvSchema>);
