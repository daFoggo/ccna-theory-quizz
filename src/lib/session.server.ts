import { useSession } from "@tanstack/react-start/server";

type SessionData = {
	access_token?: string;
	refresh_token?: string;
	userId?: string;
};

/**
 * Hook (chỉ sử dụng ở phía Server) để quản lý phiên đăng nhập của người dùng.
 * Sử dụng thư viện `@tanstack/react-start` để quản lý session thông qua HTTP-only cookie,
 * giúp lưu trữ các thông tin xác thực (access_token, refresh_token) một cách an toàn
 * và tránh bị tấn công XSS.
 */
export function useAppSession() {
	return useSession<SessionData>({
		name: "ccna_theory_session",
		password: (() => {
			const secret = process.env.SESSION_SECRET;
			if (!secret) {
				throw new Error(
					"SESSION_SECRET environment variable is required. " +
						"Set it in your .env file or server environment. " +
						"Generate one with: openssl rand -hex 32",
				);
			}
			return secret;
		})(),
		cookie: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7, // Hết hạn sau 7 ngày
		},
	});
}
